import { test, expect } from '@playwright/test';

test('catalog, search, sizes, bag and navigation work without overflow', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A RUA VESTEQUEM VOCÊ É.');
  await expect(page.locator('.product-card')).toHaveCount(4);
  await page.getByRole('link', { name: 'EXPLORAR COLEÇÃO' }).click();
  await page.getByRole('button', { name: 'Adicionar Vértice 01 à sacola', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Escolha um tamanho');
  await page.getByRole('group', { name: 'Tamanho de Vértice 01', exact: true }).getByRole('button', { name: '40', exact: true }).click();
  await page.getByRole('button', { name: 'Adicionar Vértice 01 à sacola', exact: true }).click();
  await page.getByRole('button', { name: 'Fechar aviso' }).click();
  await page.getByRole('button', { name: 'Abrir sacola, 1 itens' }).click();
  const bag = page.getByRole('dialog', { name: 'Sacola' });
  await expect(bag).toContainText('Tamanho 40');
  await expect(bag.locator('.bag-total')).toContainText('699,90');
  await bag.getByRole('button', { name: 'Adicionar um Vértice 01' }).click();
  await expect(bag.locator('.bag-total')).toContainText('1.399,80');
  await bag.getByRole('button', { name: 'Remover um Vértice 01' }).click({ clickCount: 2 });
  await expect(bag).toContainText('Sua sacola está vazia');
  await bag.getByRole('button', { name: 'Fechar', exact: true }).click();
  await expect(bag).not.toBeVisible();
  await page.getByRole('group', { name: 'Filtrar produtos' }).getByRole('button', { name: 'Roupas', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(2);
  await page.getByRole('group', { name: 'Filtrar produtos' }).getByRole('button', { name: 'Todos', exact: true }).click();
  await page.getByRole('button', { name: 'Buscar produtos' }).click();
  await page.getByLabel('Buscar no catálogo').fill('Urbano');
  await page.getByRole('button', { name: 'Ver resultados' }).click();
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.getByLabel('Buscar no catálogo').fill('inexistente');
  await expect(page.locator('.empty-results')).toBeVisible();
  await page.getByLabel('Buscar no catálogo').fill('');
  await page.getByRole('button', { name: 'Buscar produtos' }).click();
  if (testInfo.project.name !== 'desktop') {
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Sneakers' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.locator('.product-card')).toHaveCount(2);
  }
  await page.getByRole('group', { name: 'Filtrar produtos' }).getByRole('button', { name: 'Todos', exact: true }).click();
  await page.evaluate(() => document.fonts.ready);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  for (const asset of ['hero.jpg', 'products.jpg', 'editorial.jpg']) {
    const response = await page.request.get(`/images/${asset}`);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image');
  }
  await expect(page.getByRole('link', { name: 'CONVERSAR SOBRE MEU SITE' })).toHaveAttribute('href', /^https:\/\/wa\.me\/5534992011427\?/);
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath('storefront.png'), fullPage: true });
  expect(errors).toEqual([]);
});

test('dialog traps keyboard focus, closes with Escape and restores focus', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Abrir sacola' });
  await trigger.click();
  await expect(page.getByRole('button', { name: 'Fechar', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('link', { name: 'QUERO UMA LOJA ASSIM' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Fechar', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
