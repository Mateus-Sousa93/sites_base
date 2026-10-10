import { expect, test } from "@playwright/test";

test("abertura: título, CTA e metadados", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Nácar Odontologia/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("O sorriso que você sempre quis ver.");
  const cta = page.locator("#topo").getByRole("link", { name: /Agendar avaliação/ });
  await expect(cta).toHaveAttribute("href", /^https:\/\/wa\.me\/5534992011427\?text=/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("sem overflow horizontal", async ({ page }) => {
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("nenhum preço ou gratuidade no texto", async ({ page }) => {
  await page.goto("/");
  expect(await page.locator("body").innerText()).not.toMatch(/R\$|gratuit|grátis/i);
});

test("sem JavaScript o conteúdo continua legível", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("#manifesto")).toBeVisible();
  await ctx.close();
});

test("a lente em CSS ocupa o lugar do objeto do hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#topo [data-lens-fallback]")).toBeVisible();
});

test("o hero ocupa a primeira tela e o manifesto vem em seguida", async ({ page }) => {
  await page.goto("/");
  const viewport = page.viewportSize()!;
  const hero = await page.locator("#topo").boundingBox();
  const manifesto = await page.locator("#manifesto").boundingBox();
  expect(hero!.y).toBe(0);
  expect(hero!.height).toBeGreaterThanOrEqual(viewport.height);
  expect(manifesto!.y).toBeGreaterThanOrEqual(viewport.height);
  await expect(page.locator("#topo")).toHaveAttribute("data-theme", "ink");
  await expect(page.locator("#manifesto")).toHaveAttribute("data-theme", "pearl");
});

test("navegação: links na barra no desktop, menu em tela cheia no celular", async ({ page }, testInfo) => {
  await page.goto("/");
  const header = page.locator("header");
  const menu = page.locator("#menu-mobile");

  if (!testInfo.project.name.includes("mobile")) {
    await expect(header.getByRole("navigation", { name: "Seções" }).getByRole("link")).toHaveCount(5);
    await expect(header.getByRole("link", { name: "Tratamentos" })).toHaveAttribute("href", "#tratamentos");
    await expect(header.getByRole("link", { name: /^Agendar/ })).toHaveAttribute(
      "href",
      /^https:\/\/wa\.me\/5534992011427\?text=/,
    );
    await expect(header.getByRole("button")).toBeHidden();
    await expect(menu).toBeHidden();
    return;
  }

  const toggle = header.getByRole("button", { name: "Abrir menu" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(header.getByRole("button", { name: "Fechar menu" })).toHaveAttribute("aria-expanded", "true");

  const firstLink = menu.getByRole("link", { name: "Tratamentos" });
  const cta = menu.getByRole("link", { name: /Agendar avaliação/ });
  await expect(firstLink).toBeVisible();
  await expect(cta).toHaveAttribute("href", /^https:\/\/wa\.me\/5534992011427\?text=/);

  // Tela cheia: da barra até o fim da janela, de ponta a ponta.
  const box = await menu.boundingBox();
  const viewport = page.viewportSize()!;
  expect(box!.width).toBe(viewport.width);
  expect(box!.y + box!.height).toBe(viewport.height);

  // O foco circula entre a barra e o menu.
  await cta.focus();
  await page.keyboard.press("Tab");
  await expect(header.getByRole("link", { name: /voltar ao início/ })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(firstLink).toBeHidden();
  await expect(header.getByRole("button", { name: "Abrir menu" })).toBeFocused();
});
