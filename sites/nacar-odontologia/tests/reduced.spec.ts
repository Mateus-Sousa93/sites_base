import { expect, test } from "@playwright/test";

// Roda nos quatro projetos de movimento reduzido.

test("movimento reduzido: sem Lenis e com texto opaco", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  const opacities = await page
    .locator("#manifesto p, h1")
    .evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
  expect(opacities.every((o) => o === "1")).toBe(true);
});

test("movimento reduzido: a página fica estática, e o cabeçalho ainda acompanha o tema", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("header");
  await expect(header).toHaveAttribute("data-header-theme", "ink");

  // A troca de tema do cabeçalho é estado, não movimento: continua valendo. Ela
  // também mostra que o JavaScript já subiu, e o que vem depois não é vazio.
  await page.locator("#manifesto").scrollIntoViewIfNeeded();
  await expect(header).toHaveAttribute("data-header-theme", "pearl");

  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  await expect(page.locator(".split-word, .split-line")).toHaveCount(0);
  expect(await page.evaluate(() => document.getAnimations().filter((a) => a instanceof CSSAnimation).length)).toBe(0);
  const opacities = await page
    .locator("#topo *, #manifesto *")
    .evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity));
  expect(opacities.every((opacity) => opacity === "1")).toBe(true);
});

test("movimento reduzido: a âncora salta direto e a seção encosta no topo", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header")).toHaveAttribute("data-header-theme", "ink");

  // As seções da navegação chegam nas próximas tasks; por ora um link de teste.
  const restingTop = await page.evaluate(() => {
    const link = document.createElement("a");
    link.id = "link-de-teste";
    link.href = "#manifesto";
    link.textContent = "Manifesto";
    link.style.cssText = "position:fixed;left:24px;top:160px;z-index:999";
    document.body.append(link);

    const top = document.querySelector("#manifesto")!.getBoundingClientRect().top + window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    return Math.round(Math.max(0, top - maxScroll));
  });

  // O clique é do navegador: no quadro seguinte a página já está no destino.
  await page.locator("#link-de-teste").click();
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));
  const top = await page.evaluate(() => document.querySelector("#manifesto")!.getBoundingClientRect().top);
  expect(Math.abs(top - restingTop)).toBeLessThan(1);
  expect(new URL(page.url()).hash).toBe("#manifesto");
  await expect(page.locator("header")).toHaveAttribute("data-header-theme", "pearl");
});
