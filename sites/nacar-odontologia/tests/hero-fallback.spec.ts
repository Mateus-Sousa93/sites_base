import { expect, test } from "@playwright/test";

// Roda nos quatro projetos de movimento reduzido.

test("movimento reduzido: sem canvas, com lente em CSS", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#topo canvas")).toHaveCount(0);
  await expect(page.locator("#topo [data-lens-fallback]")).toBeVisible();
});

test("celular deitado: CTA do hero alcançável", async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto("/");
  const cta = page.locator("#topo").getByRole("link", { name: /Agendar avaliação/ });
  await cta.scrollIntoViewIfNeeded();
  await expect(cta).toBeInViewport();
});

test("movimento reduzido: o hero não vira palco e fica em tinta", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator('[data-stage="hero"]');
  // O cabeçalho com tema mostra que o JavaScript já subiu.
  await expect(page.locator("header")).toHaveAttribute("data-header-theme", "ink");

  const { height, sticky } = await hero.evaluate((section) => ({
    height: section.getBoundingClientRect().height,
    sticky: Array.from(section.querySelectorAll("*")).some((el) => getComputedStyle(el).position === "sticky"),
  }));
  // Em fluxo normal: a altura do conteúdo, nunca os 350svh do palco.
  expect(height).toBeLessThan(page.viewportSize()!.height * 2);
  expect(sticky).toBe(false);
  await expect(page.locator("[data-virada]")).toHaveCount(0);

  // No fim do hero nada clareou: a seção continua em tinta até o manifesto.
  await page.evaluate(() => window.scrollTo(0, document.querySelector("#topo")!.getBoundingClientRect().height - 200));
  await expect(hero).toHaveAttribute("data-theme", "ink");
  await expect(page.locator("#topo").getByRole("link", { name: /Agendar avaliação/ })).toBeVisible();
});
