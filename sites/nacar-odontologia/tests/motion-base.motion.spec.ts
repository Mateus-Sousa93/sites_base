import { expect, test, type Page } from "@playwright/test";

// Specs de movimento: rodam só no projeto "motion" (desktop, ponteiro fino,
// sem preferência por movimento reduzido).

const manifestoWords = (page: Page) =>
  page
    .locator("#manifesto p .split-word")
    .evaluateAll((els) => els.map((el) => Number(getComputedStyle(el).opacity)));

// A entrada do hero terminou: não resta animação rodando no título.
const entranceDone = (page: Page) =>
  expect
    .poll(() => page.locator("#hero-title").evaluate((h1) => h1.getAnimations({ subtree: true }).length))
    .toBe(0);

// Maior elemento pintado segundo o navegador (LCP): em que parte do hero está e
// se foi pintado junto com a primeira pintura da página.
const largestContentfulPaint = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<{ where: string; atFirstPaint: boolean }>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries() as (PerformanceEntry & { element: Element | null })[];
          const largest = entries[entries.length - 1];
          const firstPaint = performance.getEntriesByName("first-contentful-paint")[0];
          const element = largest.element;
          resolve({
            where: element?.closest("#hero-title") ? "título" : element?.closest("#topo") ? "hero" : "fora do hero",
            atFirstPaint: Math.abs(largest.startTime - firstPaint.startTime) < 1,
          });
        }).observe({ type: "largest-contentful-paint", buffered: true });
      }),
  );

// As seções da navegação chegam nas próximas tasks; por ora um link de teste
// aponta para a única seção que já existe abaixo do hero. Junto com ele vai um
// registro da posição do scroll a cada quadro. Devolve onde o topo da seção
// deve parar: no topo da janela, ou o mais perto disso que a página alcança.
const addManifestoLink = (page: Page) =>
  page.evaluate(() => {
    const link = document.createElement("a");
    link.id = "link-de-teste";
    link.href = "#manifesto";
    link.textContent = "Manifesto";
    link.style.cssText = "position:fixed;left:24px;top:160px;z-index:999";
    document.body.append(link);

    const samples: number[] = [];
    Object.assign(window, { __samples: samples });
    const sample = () => {
      samples.push(Math.round(window.scrollY));
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);

    const top = document.querySelector("#manifesto")!.getBoundingClientRect().top + window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    return Math.round(Math.max(0, top - maxScroll));
  });

// (A soma com zero desfaz o "-0" que o arredondamento de -0,3 produziria.)
const manifestoTop = (page: Page) =>
  page.evaluate(() => Math.round(document.querySelector("#manifesto")!.getBoundingClientRect().top) + 0);

const scrollSamples = (page: Page) => page.evaluate(() => (window as unknown as { __samples: number[] }).__samples);

test("movimento ligado no desktop", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  await expect(page.locator("html")).toHaveClass(/lenis/);
});

test("cabeçalho acompanha o tema da seção", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header")).toHaveAttribute("data-header-theme", "ink");
  await page.locator("#manifesto").scrollIntoViewIfNeeded();
  await expect(page.locator("header")).toHaveAttribute("data-header-theme", "pearl");
});

test("cabeçalho: opaco enquanto cobre a emenda entre duas seções, fosco depois", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("header");
  const backdrop = () => header.evaluate((el) => getComputedStyle(el, "::before").backgroundColor);
  const barHeight = (await header.boundingBox())!.height;
  const seam = await page.locator("#manifesto").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);

  // A seção clara já encostou na barra, que ainda cobre o fim do hero.
  await page.evaluate((y) => window.scrollTo(0, y), seam - barHeight / 2);
  await expect(header).toHaveAttribute("data-header-theme", "pearl");
  await expect(header).toHaveAttribute("data-header-crossing", "");
  await expect.poll(backdrop).toBe("rgb(244, 241, 236)");

  // A barra inteira sobre a seção clara: volta o fundo translúcido.
  await page.evaluate((y) => window.scrollTo(0, y), seam);
  await expect(header).not.toHaveAttribute("data-header-crossing");
  await expect.poll(backdrop).toContain("/ 0.88)");

  // A troca de cores termina e devolve aos links a transição do hover.
  await expect(header).not.toHaveAttribute("data-header-swapping");
});

test("hero: a entrada é CSS, por linhas, e termina com o título inteiro à vista", async ({ page }) => {
  await page.goto("/");
  const title = page.locator("#hero-title");

  // Cada linha tem a sua animação de CSS e espera um pouco mais que a anterior.
  // (A espera é o atraso da subida, a última animação da lista.)
  const waits = await title.evaluate((h1) =>
    Array.from(h1.children, (mask) => {
      const style = getComputedStyle(mask.firstElementChild!);
      return style.animationName === "none" ? -1 : parseFloat(style.animationDelay.split(",").pop()!);
    }),
  );
  expect(waits).toHaveLength(3);
  expect(waits[0]).toBeGreaterThan(0);
  expect(waits.every((wait, i) => i === 0 || wait > waits[i - 1])).toBe(true);

  // Sem depender de JavaScript: as animações acabam sozinhas e nada fica
  // escondido nem com animação pendurada.
  await entranceDone(page);
  const lines = await title.evaluate((h1) =>
    Array.from(h1.children, (mask) => {
      const line = mask.firstElementChild!;
      const outer = mask.getBoundingClientRect();
      const inner = line.getBoundingClientRect();
      return {
        opacity: getComputedStyle(line).opacity,
        transform: getComputedStyle(line).transform,
        inside: inner.top >= outer.top - 1 && inner.bottom <= outer.bottom + 1,
      };
    }),
  );
  expect(lines).toEqual(Array(3).fill({ opacity: "1", transform: "none", inside: true }));
});

test("o movimento não muda o layout: tudo fica onde está na página estática", async ({ page }) => {
  const geometry = () =>
    page.evaluate(() => ({
      boxes: Array.from(
        document.querySelectorAll(
          "#hero-title, #hero-title > span > *, #topo p, #topo a, #topo dl, #manifesto p, #manifesto dd, #manifesto dt",
        ),
        (el) => {
          const box = el.getBoundingClientRect();
          return [box.left, box.top + window.scrollY, box.width, box.height].map(Math.round);
        },
      ),
      pageHeight: document.documentElement.scrollHeight,
    }));

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  const still = await geometry();
  expect(still.boxes.length).toBeGreaterThan(12);

  // Liga o movimento com a página aberta: a entrada roda, o texto é dividido,
  // os números ficam à espera atrás das máscaras. Nada disso desloca nada.
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("#manifesto p .split-word").first()).toBeAttached();
  await expect(page.locator("#manifesto dd .split-line")).toHaveCount(3);
  const entrance = () => page.evaluate(() => document.getAnimations().filter((a) => a instanceof CSSAnimation).length);
  await expect.poll(entrance).toBeGreaterThan(0);
  await expect.poll(entrance).toBe(0);
  expect(await geometry()).toEqual(still);
});

test("hero: o LCP é o título, na primeira pintura, mesmo com a entrada animada", async ({ page }) => {
  await page.goto("/");
  await entranceDone(page);
  expect(await largestContentfulPaint(page)).toEqual({ where: "título", atFirstPaint: true });
});

test("hero: a entrada inteira termina a tempo, sem recomeçar no meio", async ({ page }) => {
  await page.goto("/");
  // A animação mais longa acaba 2,6 s depois da primeira pintura. Uma animação
  // que recomece no caminho (aconteceu com a legenda da lente, por causa de uma
  // container query) estoura esse prazo.
  await page.waitForFunction(() => performance.now() > 3600);
  const running = await page.evaluate(() =>
    document
      .getAnimations()
      .filter((animation) => animation instanceof CSSAnimation)
      .map((animation) => animation.animationName),
  );
  expect(running).toEqual([]);
});

test("manifesto: as palavras acendem com o scroll e o destaque continua em serifa itálica", async ({ page }) => {
  await page.goto("/");
  const text = page.locator("#manifesto p");

  // Abaixo da dobra, todas as palavras esperam apagadas.
  await expect.poll(async () => (await manifestoWords(page)).length).toBeGreaterThan(17);
  expect((await manifestoWords(page)).every((opacity) => Math.abs(opacity - 0.18) < 0.005)).toBe(true);

  // O texto continua o mesmo e o trecho de destaque continua dentro do <em>.
  await expect(text).toHaveText(
    "Antes de tocar em um dente, escutamos, examinamos e desenhamos o resultado em 3D. Você vê o sorriso pronto na tela e só então decide começar.",
  );
  await expect(text.locator("em")).toHaveText("só então");
  await expect(text.locator("em .split-word")).toHaveCount(2);
  const accent = await text
    .locator("em .split-word")
    .first()
    .evaluate((el) => ({ style: getComputedStyle(el).fontStyle, family: getComputedStyle(el).fontFamily }));
  expect(accent.style).toBe("italic");
  expect(accent.family).toMatch(/Instrument Serif/i);

  // No meio da passagem: as primeiras acesas, as últimas ainda apagadas, sem saltos.
  await text.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + rect.top + rect.height / 2 - window.innerHeight * 0.62);
  });
  await expect.poll(async () => (await manifestoWords(page))[0]).toBe(1);
  const midway = await manifestoWords(page);
  expect(midway[midway.length - 1]).toBeLessThan(0.3);
  expect(midway.every((opacity, i) => i === 0 || opacity <= midway[i - 1] + 0.001)).toBe(true);

  // Depois da passagem: tudo aceso.
  await text.evaluate((el) => window.scrollTo(0, window.scrollY + el.getBoundingClientRect().bottom - 120));
  await expect.poll(async () => (await manifestoWords(page)).every((opacity) => opacity === 1)).toBe(true);
});

test("manifesto: os números sobem por trás de uma máscara e devolvem o HTML original", async ({ page }) => {
  await page.goto("/");
  const values = page.locator("#manifesto dd");
  const lines = page.locator("#manifesto dd .split-line");

  // Abaixo da dobra: cada número espera escondido atrás da própria máscara.
  await expect(lines).toHaveCount(3);
  const hidden = await lines.evaluateAll((els) =>
    els.map((line) => line.getBoundingClientRect().top >= line.parentElement!.getBoundingClientRect().bottom - 1),
  );
  expect(hidden).toEqual([true, true, true]);

  await values.first().scrollIntoViewIfNeeded();
  await expect(lines).toHaveCount(0);
  await expect(values).toHaveText(["60 min", "2", "3.200"]);
  await expect(values.first()).toBeInViewport();
});

test("âncoras rolam pelo Lenis: a seção encosta no topo e o cabeçalho assume o tema dela", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/lenis/);

  expect(await addManifestoLink(page)).toBe(0);
  await page.locator("#link-de-teste").click();
  await expect.poll(() => manifestoTop(page)).toBe(0);

  // A barra fica sobre o respiro da seção, com as cores dela, e nada do
  // conteúdo fica escondido atrás.
  const header = page.locator("header");
  await expect(header).toHaveAttribute("data-header-theme", "pearl");
  await expect(header).not.toHaveAttribute("data-header-crossing");
  const headerBottom = (await header.boundingBox())!.height;
  expect((await page.locator("#manifesto-title").boundingBox())!.y).toBeGreaterThan(headerBottom);

  // Rolagem animada: muitos quadros intermediários, sempre para a frente.
  const samples = await scrollSamples(page);
  expect(new Set(samples).size).toBeGreaterThan(12);
  expect(samples.every((y, i) => i === 0 || y >= samples[i - 1])).toBe(true);

  // O que o navegador faria sozinho continua valendo: endereço e foco.
  expect(new URL(page.url()).hash).toBe("#manifesto");
  expect(await page.evaluate(() => document.activeElement?.id)).toBe("manifesto");

  // A marca do cabeçalho volta ao início.
  await header.getByRole("link", { name: /voltar ao início/ }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  expect(new URL(page.url()).hash).toBe("#topo");
});

test("a preferência muda com a página aberta: tudo volta ao estático", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).toHaveClass(/lenis/);
  await expect(page.locator("#manifesto p .split-word").first()).toBeAttached();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(html).toHaveAttribute("data-motion", "off");
  await expect(html).not.toHaveClass(/lenis/);
  await expect(page.locator("#manifesto .split-word, #manifesto .split-line")).toHaveCount(0);
  const opacities = await page
    .locator("#manifesto p, #manifesto dd, h1")
    .evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity));
  expect(opacities.every((opacity) => opacity === "1")).toBe(true);

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(html).toHaveAttribute("data-motion", "on");
  await expect(html).toHaveClass(/lenis/);
  await expect(page.locator("#manifesto p .split-word").first()).toBeAttached();
});

test.describe("no toque", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("movimento ligado, scroll nativo", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-motion", "on");

    // O texto dividido mostra que o JavaScript de movimento já subiu; só então
    // a ausência do Lenis quer dizer alguma coisa.
    await expect(page.locator("#manifesto p .split-word").first()).toBeAttached();
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await expect(html).not.toHaveClass(/lenis/);

    await page.locator("#manifesto").scrollIntoViewIfNeeded();
    await expect(page.locator("header")).toHaveAttribute("data-header-theme", "pearl");
  });

  test("âncoras rolam com o scroll nativo, animado", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#manifesto p .split-word").first()).toBeAttached();

    const restingTop = await addManifestoLink(page);
    await page.locator("#link-de-teste").click();
    await expect.poll(() => manifestoTop(page)).toBe(restingTop);

    const samples = await scrollSamples(page);
    expect(new Set(samples).size).toBeGreaterThan(6);
    expect(samples.every((y, i) => i === 0 || y >= samples[i - 1])).toBe(true);
    expect(new URL(page.url()).hash).toBe("#manifesto");
    expect(await page.evaluate(() => document.activeElement?.id)).toBe("manifesto");
  });

  // No celular o parágrafo do hero ocupa mais área que qualquer linha do
  // título, e é ele o LCP. O que importa é que seja texto do hero e que conte
  // desde a primeira pintura, não só quando a entrada termina.
  test("o LCP é texto do hero, na primeira pintura", async ({ page }) => {
    await page.goto("/");
    await entranceDone(page);
    await expect.poll(() => page.evaluate(() => document.getAnimations().length)).toBe(0);
    expect(await largestContentfulPaint(page)).toEqual({ where: "hero", atFirstPaint: true });
  });
});
