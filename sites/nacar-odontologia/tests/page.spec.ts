import { expect, test } from "@playwright/test";

const whatsapp = /^https:\/\/wa\.me\/5534992011427\?text=/;
// Os specs não importam o conteúdo do site (ele importa fotos, que o Node não carrega):
// as quantidades esperadas ficam aqui.
const nav = ["#tratamentos", "#resultados", "#planejamento", "#clinica", "#equipe"];
const sections = ["topo", "manifesto", "tratamentos", "resultados", "planejamento", "clinica", "equipe", "depoimentos", "agendar"];

test("abertura: título, CTA e metadados", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Nácar Odontologia/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("O sorriso que você sempre quis ver.");
  await expect(page.locator("#topo").getByRole("link", { name: /Agendar avaliação/ })).toHaveAttribute("href", whatsapp);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("todas as seções existem e todo link do menu tem destino", async ({ page }) => {
  await page.goto("/");
  for (const id of sections) await expect(page.locator(`#${id}`)).toHaveCount(1);
  for (const href of nav) {
    await expect(page.locator(`header nav a[href="${href}"]`).first()).toHaveCount(1);
    await expect(page.locator(href)).toHaveCount(1);
  }
  await expect(page.locator("footer")).toContainText(/demonstrativo/i);
});

test("sem overflow horizontal", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("nenhum preço ou gratuidade no texto", async ({ page }) => {
  await page.goto("/");
  expect(await page.locator("body").innerText()).not.toMatch(/R\$|gratuit|grátis/i);
});

test("sem JavaScript o conteúdo continua legível", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  // Sem JavaScript o mapa deixa de ser carregado sob demanda e segura o evento
  // de load; para este teste basta o HTML.
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  for (const id of ["tratamentos", "resultados", "equipe", "agendar"]) {
    await expect(page.locator(`#${id} h2`)).toBeVisible();
  }
  await context.close();
});

test("navegação: links na barra no desktop, menu em tela cheia no celular", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("header");

  if (page.viewportSize()!.width >= 900) {
    await expect(header.getByRole("navigation", { name: "Seções" }).getByRole("link")).toHaveCount(nav.length);
    await header.getByRole("link", { name: "Resultados" }).click();
    await expect(page.locator("#resultados h2")).toBeInViewport();
    return;
  }

  await header.getByRole("button", { name: "Abrir menu" }).click();
  const menu = page.locator("#menu-mobile");
  await expect(menu.getByRole("link", { name: /Agendar avaliação/ })).toHaveAttribute("href", whatsapp);
  await menu.getByRole("link", { name: "A clínica" }).click();
  await expect(page.locator("#clinica h2")).toBeInViewport();
});

test("tratamentos: abrir um item troca o painel e a foto", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#tratamentos");
  await expect(section.locator("li[data-active]")).toHaveCount(5);
  const trigger = section.getByRole("button", { name: /Alinhadores invisíveis/ });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(section.locator('li[data-active="true"]')).toContainText("Placas transparentes");
  await expect(section.locator('li[data-active="true"]')).toHaveCount(1);
});

test("antes e depois: a cortina responde ao teclado", async ({ page }) => {
  await page.goto("/");
  const range = page.locator("#resultados input[type=range]");
  await range.focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  const value = await range.inputValue();
  expect(Number(value)).toBeGreaterThan(50);
  const position = await page.locator("#resultados [data-curtain]").evaluate((node) => (node as HTMLElement).style.getPropertyValue("--pos"));
  expect(position).toBe(`${value}%`);
});

test("agendar: as escolhas montam a mensagem do WhatsApp", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#agendar");
  await section.getByRole("button", { name: "Clarear o sorriso" }).click();
  await section.getByRole("button", { name: "Tarde" }).click();
  const href = await section.getByRole("link", { name: /Enviar pelo WhatsApp/ }).getAttribute("href");
  expect(decodeURIComponent(href!)).toContain("Quero clarear o sorriso e prefiro atendimento à tarde.");
});

test("equipe, clínica e depoimentos têm o conteúdo esperado", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#equipe [data-person]")).toHaveCount(2);
  await expect(page.locator("#equipe")).toContainText("CRO");
  await expect(page.locator("#clinica [data-space-item]")).toHaveCount(4);
  await expect(page.locator("#depoimentos blockquote")).toHaveCount(3);
});

test("movimento: ligado no desktop com movimento permitido, desligado com movimento reduzido", async ({ page }, testInfo) => {
  await page.goto("/");
  const expected = testInfo.project.name === "motion" ? "on" : "off";
  await expect(page.locator("html")).toHaveAttribute("data-motion", expected);
  if (expected === "off") {
    await expect(page.locator("html")).not.toHaveClass(/lenis/);
    const hidden = await page.locator("[data-reveal]").evaluateAll((nodes) => nodes.filter((node) => getComputedStyle(node).opacity !== "1").length);
    expect(hidden).toBe(0);
  }
});
