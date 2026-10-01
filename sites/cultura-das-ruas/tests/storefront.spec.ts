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
  if (testInfo.project.name.includes('desktop')) {
    await page.getByRole('group', { name: 'Tamanho de Vértice 01', exact: true }).getByRole('button', { name: '40', exact: true }).click();
  } else {
    await page.getByRole('combobox', { name: 'Tamanho de Vértice 01', exact: true }).selectOption('40');
  }
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
  if (!testInfo.project.name.includes('desktop')) {
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

test('each section fits the viewport and the complete catalog stays visible', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const headerHeight = await page.locator('.header').evaluate(element => element.getBoundingClientRect().height);
  const height = page.viewportSize()!.height;
  for (const id of ['inicio', 'drop', 'produtos', 'sobre', 'contato']) {
    const section = page.locator(`#${id}`);
    await section.evaluate(element => element.scrollIntoView());
    await expect.poll(() => section.evaluate(element => Math.round(element.getBoundingClientRect().top))).toBe(headerHeight);
    const box = await section.boundingBox();
    expect(Math.abs(box!.height - (height - headerHeight))).toBeLessThanOrEqual(1);
    await page.screenshot({ path: testInfo.outputPath(`${id}.png`) });
  }
  await page.locator('#produtos').evaluate(element => element.scrollIntoView());
  for (const button of await page.locator('.add-button').all()) {
    const box = await button.boundingBox();
    expect(box!.y).toBeGreaterThanOrEqual(headerHeight);
    expect(box!.y + box!.height).toBeLessThanOrEqual(height);
  }
  for (const filter of ['Sneakers', 'Roupas', 'Todos']) {
    await page.getByRole('group', { name: 'Filtrar produtos' }).getByRole('button', { name: filter, exact: true }).click();
    const box = await page.locator('.product-grid').boundingBox();
    expect(box!.y + box!.height).toBeLessThanOrEqual(height);
    expect(await page.locator('.product-photo').first().evaluate(element => element.clientHeight)).toBeGreaterThan(60);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test('campaign video plays, pauses and respects reduced motion', async ({ page }) => {
  await page.goto('/');
  const video = page.locator('#inicio video');
  expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await page.getByRole('button', { name: 'Reproduzir vídeo: Cultura em movimento', exact: true }).click();
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime), { timeout: 15000 }).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Pausar vídeo: Cultura em movimento', exact: true }).click();
  expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.getByRole('button', { name: 'Reproduzir vídeo: Cultura em movimento', exact: true }).click();
  await page.locator('#sobre').evaluate(element => element.scrollIntoView({ behavior: 'instant' }));
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  const secondVideo = page.locator('#sobre video');
  await expect.poll(() => secondVideo.evaluate((element: HTMLVideoElement) => element.currentTime), { timeout: 15000 }).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Pausar vídeo: Streetwear nas ruas', exact: true }).click();
  expect(await secondVideo.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
});
