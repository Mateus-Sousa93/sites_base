import { expect, test, type Page } from "@playwright/test";
import { largestContentfulPaint } from "./lcp";
import { withoutWebGL } from "./webgl";

// Specs do palco do hero: rodam só no projeto "motion-3d" (desktop, ponteiro
// fino, sem preferência por movimento reduzido, com WebGL). O Chromium sem
// interface desenha o WebGL por software, bem devagar: só os testes que são
// sobre a cena 3D a deixam subir. Os que são sobre o palco (texto, tema,
// alturas) desligam o WebGL e rodam com a lente em CSS, que percorre o mesmo
// palco.

const stage = (page: Page) => page.locator('[data-stage="hero"]');
// Os dois blocos de texto do hero: o do título (com o parágrafo e o botão) e o
// dos selos de confiança.
const textBlocks = (page: Page) => page.locator("#topo :is(div:has(> #hero-title), dl)");
const virada = (page: Page) => page.locator("[data-virada]");
const opacity = (page: Page, selector: string) =>
  page.locator(selector).evaluate((el) => Number(getComputedStyle(el).opacity));

// Rola até a fração `progress` do palco: 0 no topo, 1 quando o pé do palco
// encosta no pé da janela.
const scrollToProgress = (page: Page, progress: number) =>
  page.evaluate((p) => {
    const hero = document.querySelector('[data-stage="hero"]')!;
    window.scrollTo(0, p * (hero.getBoundingClientRect().height - window.innerHeight));
  }, progress);

// O palco já responde ao scroll: a camada da virada só existe com ele ligado.
// (Antes, o cabeçalho com tema mostra que o JavaScript da página subiu: se o
// palco não ligar, a falha diz qual das duas coisas faltou.)
const stageReady = async (page: Page) => {
  await expect(page.locator("header")).toHaveAttribute("data-header-theme", /ink|pearl/);
  await expect(virada(page)).toBeAttached();
};

test("canvas sobe e a virada clareia o hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#topo canvas")).toBeVisible({ timeout: 15000 });
  const virada = page.locator("[data-virada]");
  expect(Number(await virada.evaluate((e) => getComputedStyle(e).opacity))).toBeLessThan(0.1);
  await page.evaluate(() => {
    const h = document.querySelector('[data-stage="hero"]')!;
    window.scrollTo(0, h.getBoundingClientRect().height - window.innerHeight);
  });
  await expect
    .poll(async () => Number(await virada.evaluate((e) => getComputedStyle(e).opacity)))
    .toBeGreaterThan(0.9);
});

test("a lente em CSS segura o lugar até o primeiro quadro da cena, e então sai", async ({ page }) => {
  const scripts: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "script") scripts.push(new URL(request.url()).pathname);
  });

  await page.goto("/");
  const fallback = page.locator("#topo [data-lens-fallback]");
  const canvas = page.locator("#topo canvas");

  // Na primeira pintura só existe a lente em CSS; a cena entra depois que a
  // entrada dela assentou.
  await expect(fallback).toBeVisible();
  await expect(canvas).toHaveCount(0);
  await expect(canvas).toBeVisible({ timeout: 30000 });

  // O código da cena veio num chunk que o HTML não referencia: fica fora do
  // JavaScript inicial da rota.
  const html = await (await page.request.get("/")).text();
  const lazy = scripts.filter((path) => !html.includes(path));
  expect(lazy.length).toBeGreaterThan(0);
  expect(scripts.length).toBeGreaterThan(lazy.length);

  // Com o primeiro quadro desenhado, a cena aparece e a lente em CSS some.
  await expect(page.locator("#topo [data-lens-scene]")).toHaveAttribute("data-lens-scene", "ready", { timeout: 60000 });
  await expect(fallback).toBeHidden();
  await expect.poll(() => opacity(page, "#topo [data-lens-scene]")).toBe(1);

  // O canvas cobre o palco inteiro, atrás do texto, e não captura o ponteiro.
  const box = (await canvas.boundingBox())!;
  const viewport = page.viewportSize()!;
  expect(box.width).toBe(viewport.width);
  expect(box.height).toBeGreaterThanOrEqual(viewport.height);
  const cta = page.locator("#topo").getByRole("link", { name: /Agendar avaliação/ });
  const reachable = await cta.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    return hit === el || el.contains(hit);
  });
  expect(reachable).toBe(true);
});

test("a preferência muda com a cena no ar: sai o canvas, fica a lente em CSS, e a cena volta depois", async ({
  page,
}) => {
  await page.goto("/");
  const scene = page.locator("#topo [data-lens-scene]");
  const fallback = page.locator("#topo [data-lens-fallback]");
  await expect(scene).toHaveAttribute("data-lens-scene", "ready", { timeout: 60000 });
  await expect(fallback).toBeHidden();

  // Movimento reduzido: sem canvas, sem palco, a lente em CSS inteira à vista.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("#topo canvas")).toHaveCount(0);
  await expect(fallback).toBeVisible();
  await expect.poll(() => fallback.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  await expect(virada(page)).toHaveCount(0);
  await expect.poll(async () => Math.round((await stage(page).boundingBox())!.height)).toBe(900);

  // De volta: o palco religa e a cena sobe outra vez, com a lente em CSS no
  // lugar até o primeiro quadro.
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await stageReady(page);
  await expect(scene).toHaveAttribute("data-lens-scene", "ready", { timeout: 60000 });
  await expect(fallback).toBeHidden();
});

// A página como ela é, com o chunk da cena baixando durante a entrada e a cena
// no ar: o LCP continua sendo o título, pintado de verdade e a tempo.
test("com a cena no ar, o LCP é o título, dentro de 2,5 s", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#topo [data-lens-scene]")).toHaveAttribute("data-lens-scene", "ready", { timeout: 60000 });
  const lcp = await largestContentfulPaint(page);
  expect(lcp.where).toBe("título");
  expect(lcp.time).toBeLessThan(2500);
  expect(lcp.afterFirstPaint).toBeGreaterThan(150);
});

test("sem WebGL: a lente em CSS fica, sem erro, e o palco funciona do mesmo jeito", async ({ page }) => {
  const errors: Error[] = [];
  page.on("pageerror", (error) => errors.push(error));
  const scripts: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "script") scripts.push(new URL(request.url()).pathname);
  });
  await withoutWebGL(page);

  await page.goto("/");
  const fallback = page.locator("#topo [data-lens-fallback]");
  await expect(fallback).toBeVisible();
  await stageReady(page);

  // Passado o tempo em que a cena subiria, continua só a lente em CSS, e o
  // chunk da cena nem foi pedido: todo script carregado está no HTML.
  await page.waitForFunction(() => performance.now() > 4000);
  await expect(page.locator("#topo canvas")).toHaveCount(0);
  await expect(fallback).toBeVisible();
  const html = await (await page.request.get("/")).text();
  expect(scripts.filter((path) => !html.includes(path))).toEqual([]);

  // A lente em CSS cresce com o scroll e a virada acontece igual.
  const width = async () => (await fallback.boundingBox())!.width;
  const resting = await width();
  await scrollToProgress(page, 0.6);
  await expect.poll(width).toBeGreaterThan(resting * 2);
  await scrollToProgress(page, 1);
  await expect.poll(() => opacity(page, "[data-virada]")).toBeGreaterThan(0.9);
  expect(errors).toEqual([]);
});

test("o palco só existe em janela com pelo menos 520 px de altura", async ({ page }) => {
  await withoutWebGL(page);

  // 519 px: o hero fica em fluxo normal, com a altura de uma tela, e nada gruda.
  await page.setViewportSize({ width: 1440, height: 519 });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  await expect(page.locator("header")).toHaveAttribute("data-header-theme", "ink");
  const measure = () =>
    stage(page).evaluate((section) => ({
      height: Math.round(section.getBoundingClientRect().height),
      sticky: Array.from(section.querySelectorAll("*")).some((el) => getComputedStyle(el).position === "sticky"),
    }));
  expect(await measure()).toEqual({ height: 519, sticky: false });
  await expect(virada(page)).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 400));
  await expect(stage(page)).toHaveAttribute("data-theme", "ink");
  await expect.poll(() => opacity(page, "#hero-title")).toBe(1);

  // 520 px: palco de 350svh com a primeira tela grudada.
  await page.setViewportSize({ width: 1440, height: 520 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(measure).toEqual({ height: 1820, sticky: true });
  await stageReady(page);
  await scrollToProgress(page, 1);
  await expect.poll(() => opacity(page, "[data-virada]")).toBeGreaterThan(0.9);

  // De volta a 519 px com a página aberta: o palco se desfaz e o hero volta ao
  // estado de repouso.
  await page.setViewportSize({ width: 1440, height: 519 });
  await expect.poll(measure).toEqual({ height: 519, sticky: false });
  await expect(virada(page)).toHaveCount(0);
  await expect(stage(page)).toHaveAttribute("data-theme", "ink");
});

test("o progresso do palco vai de 0 a 1 e conduz a virada", async ({ page }) => {
  await withoutWebGL(page);
  await page.goto("/");
  await stageReady(page);
  const progress = () =>
    stage(page).evaluate((section) => Number(getComputedStyle(section).getPropertyValue("--hero-p")));

  expect(await progress()).toBe(0);
  await scrollToProgress(page, 0.5);
  await expect.poll(progress).toBeCloseTo(0.5, 2);
  expect(await opacity(page, "[data-virada]")).toBe(0);

  // Meio da virada (p = 0,88): metade da opacidade.
  await scrollToProgress(page, 0.88);
  await expect.poll(progress).toBeCloseTo(0.88, 2);
  await expect.poll(() => opacity(page, "[data-virada]")).toBeCloseTo(0.5, 1);

  // Além do fim do palco o progresso fica em 1.
  await page.locator("#manifesto").scrollIntoViewIfNeeded();
  await expect.poll(progress).toBe(1);
  await expect.poll(() => opacity(page, "[data-virada]")).toBe(1);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(progress).toBe(0);
  await expect.poll(() => opacity(page, "[data-virada]")).toBe(0);
});

test("o texto do hero sai da frente da lente e deixa de ser interativo", async ({ page }) => {
  await withoutWebGL(page);
  await page.goto("/");
  await stageReady(page);
  const cta = page.locator("#topo").getByRole("link", { name: /Agendar avaliação/ });
  const blocks = () =>
    textBlocks(page).evaluateAll((els) => els.map((el) => ({ opacity: Number(getComputedStyle(el).opacity), top: el.getBoundingClientRect().top })));

  // Em repouso: texto, botão e selos à vista e clicáveis.
  await expect.poll(async () => (await page.locator("#hero-title").evaluate((h1) => h1.getAnimations({ subtree: true }).length))).toBe(0);
  const resting = await blocks();
  expect(resting).toHaveLength(2);
  expect(resting.every((block) => block.opacity === 1)).toBe(true);
  await expect(cta).toBeVisible();

  // No meio da saída: mais apagado e mais alto, o título inteiro (nada cortado
  // pela máscara da entrada).
  await scrollToProgress(page, 0.175);
  await expect.poll(async () => (await blocks())[0].opacity).toBeLessThan(0.8);
  const leaving = await blocks();
  expect(leaving.every((block) => block.opacity > 0.1 && block.opacity < 0.9)).toBe(true);
  expect(leaving.every((block, i) => block.top < resting[i].top - 4)).toBe(true);
  expect(await page.locator("#hero-title > span").evaluateAll((lines) => lines.map((line) => getComputedStyle(line).clipPath))).toEqual(
    ["none", "none", "none"],
  );

  // Depois da saída: invisível e fora do alcance do ponteiro, do teclado e do
  // leitor de tela.
  await scrollToProgress(page, 0.4);
  await expect.poll(async () => (await blocks()).map((block) => block.opacity)).toEqual([0, 0]);
  await expect(textBlocks(page).first()).toHaveAttribute("inert", "");
  await expect(textBlocks(page).last()).toHaveAttribute("inert", "");
  await expect(page.locator("#topo").getByRole("link", { name: /Agendar avaliação/ })).toHaveCount(0);
  const inertLink = page.locator("#topo a.button");
  await inertLink.focus();
  expect(await inertLink.evaluate((el) => document.activeElement === el)).toBe(false);

  // De volta ao topo: tudo como antes.
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(blocks).toEqual(resting);
  await expect(textBlocks(page).first()).not.toHaveAttribute("inert");
  await expect(cta).toBeVisible();
});

test("a virada troca o tema do hero para pérola e o cabeçalho acompanha, sem emenda até o manifesto", async ({
  page,
}) => {
  await withoutWebGL(page);
  await page.goto("/");
  await stageReady(page);
  const header = page.locator("header");

  await scrollToProgress(page, 0.86);
  await expect.poll(() => opacity(page, "[data-virada]")).toBeGreaterThan(0.2);
  await expect(stage(page)).toHaveAttribute("data-theme", "ink");
  await expect(header).toHaveAttribute("data-header-theme", "ink");

  // Passou de 0,5: o hero se declara pérola e a barra troca sem a página rolar
  // para outra seção.
  await scrollToProgress(page, 0.9);
  await expect(stage(page)).toHaveAttribute("data-theme", "pearl");
  await expect(header).toHaveAttribute("data-header-theme", "pearl");

  // A cobertura tem a cor do manifesto: a emenda entre as duas seções não existe
  // para a barra, que segue fosca, nem para o olho.
  await scrollToProgress(page, 1);
  await expect.poll(() => opacity(page, "[data-virada]")).toBe(1);
  const seam = await page.locator("#manifesto").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  await page.evaluate((y) => window.scrollTo(0, y), seam - 30);
  await expect(header).toHaveAttribute("data-header-theme", "pearl");
  await expect(header).not.toHaveAttribute("data-header-crossing");
  const colors = await page.evaluate(() => ({
    virada: getComputedStyle(document.querySelector("[data-virada]")!).backgroundColor,
    manifesto: getComputedStyle(document.querySelector("#manifesto")!).backgroundColor,
  }));
  expect(colors.virada).toBe(colors.manifesto);

  // Voltando, o hero volta a tinta.
  await scrollToProgress(page, 0.5);
  await expect(stage(page)).toHaveAttribute("data-theme", "ink");
  await expect(header).toHaveAttribute("data-header-theme", "ink");
});

// Com o palco ligado, a primeira tela é tudo o que se vê do hero enquanto ele
// está grudado: título, botão e selos precisam caber nela.
for (const [width, height] of [
  [1920, 1080],
  [1440, 900],
  [1440, 640],
  [1440, 520],
  [1366, 768],
  [1366, 600],
  [1280, 720],
  [1024, 768],
  [1024, 600],
  [900, 560],
  [900, 520],
]) {
  test(`o hero cabe na primeira tela em ${width}×${height}`, async ({ page }) => {
    await withoutWebGL(page);
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await stageReady(page);
    const boxes = await page.evaluate(() => {
      const box = (selector: string) => {
        const rect = document.querySelector(selector)!.getBoundingClientRect();
        return { top: rect.top, bottom: rect.bottom };
      };
      return {
        header: box("header").bottom,
        title: box("#hero-title"),
        trust: box("#topo dl"),
        pinned: box('[data-stage="hero"] > *'),
      };
    });
    // (Frações de pixel de sobra ou de falta não contam.)
    expect(boxes.pinned.top).toBe(0);
    expect(Math.round(boxes.pinned.bottom)).toBe(height);
    expect(boxes.title.top).toBeGreaterThanOrEqual(boxes.header);
    expect(Math.round(boxes.trust.bottom)).toBeLessThanOrEqual(height);
  });
}

test.describe("no toque", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("mesmo palco e mesma virada, com a lente na parte de cima da tela", async ({ page }) => {
    await page.goto("/");
    await stageReady(page);
    const canvas = page.locator("#topo canvas");
    await expect(canvas).toBeVisible({ timeout: 30000 });

    // A lente repousa acima do título; o canvas cobre a tela inteira.
    const lens = (await page.locator("#topo [data-lens-fallback]").boundingBox())!;
    const title = (await page.locator("#hero-title").boundingBox())!;
    expect(lens.y + lens.height).toBeLessThanOrEqual(title.y);
    const box = (await canvas.boundingBox())!;
    expect(box.width).toBe(390);
    expect(box.height).toBeGreaterThanOrEqual(844);

    expect(Math.round((await stage(page).boundingBox())!.height)).toBe(Math.round(844 * 3.5));
    await scrollToProgress(page, 1);
    await expect.poll(() => opacity(page, "[data-virada]")).toBeGreaterThan(0.9);
    await expect(page.locator("header")).toHaveAttribute("data-header-theme", "pearl");
  });

  test("com a cena no ar, o LCP é texto do hero, dentro de 2,5 s", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#topo [data-lens-scene]")).toHaveAttribute("data-lens-scene", "ready", { timeout: 60000 });
    const lcp = await largestContentfulPaint(page);
    expect(["título", "parágrafo de apoio"]).toContain(lcp.where);
    expect(lcp.time).toBeLessThan(2500);
    expect(lcp.afterFirstPaint).toBeGreaterThan(150);
  });

  // Num celular baixo o conteúdo do hero é mais alto que a tela. O palco então
  // rola até mostrar o pé do conteúdo e só aí gruda: nada fica inalcançável.
  for (const [width, height] of [
    [390, 664],
    [360, 560],
  ]) {
    test(`em ${width}×${height} o botão e os selos aparecem antes de o texto sair`, async ({ page }) => {
      await withoutWebGL(page);
      await page.setViewportSize({ width, height });
      await page.goto("/");
      await stageReady(page);
      const cta = page.locator("#topo").getByRole("link", { name: /Agendar avaliação/ });
      const trust = page.locator("#topo dl");

      const overflow = await page.evaluate(
        () => document.querySelector('[data-stage="hero"] > *')!.getBoundingClientRect().height - window.innerHeight,
      );
      await page.evaluate((y) => window.scrollTo(0, y), Math.ceil(Math.max(0, overflow)));
      await expect(cta).toBeInViewport({ ratio: 1 });
      expect((await trust.boundingBox())!.y + (await trust.boundingBox())!.height).toBeLessThanOrEqual(height + 1);
      // Com o pé do conteúdo à vista o texto ainda está inteiro.
      await expect.poll(() => textBlocks(page).first().evaluate((el) => getComputedStyle(el).opacity)).toBe("1");

      // Dali em diante o palco fica parado, com o pé rente ao pé da janela.
      await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, overflow) + 300);
      const bottom = await page.evaluate(
        () => document.querySelector('[data-stage="hero"] > *')!.getBoundingClientRect().bottom,
      );
      expect(Math.round(bottom)).toBe(height);
    });
  }
});
