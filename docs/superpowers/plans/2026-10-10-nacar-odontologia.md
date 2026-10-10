# Nácar Odontologia Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir `sites/nacar-odontologia`, demo de clínica odontológica cujo impacto visual (lente 3D no hero, scroll narrativo) funciona no desktop e no celular.

**Architecture:** Projeto Next.js estático e independente, no padrão do repositório. Todo o conteúdo em `src/content/site.ts`; movimento em `src/motion/` (GSAP + Lenis) aplicado por cima de HTML já legível; o objeto do hero é uma peça trocável (`HeroObject`) cuja primeira implementação é 3D em tempo real (React Three Fiber). Seções fixas usam `position: sticky` em CSS, e o ScrollTrigger só mede progresso.

**Tech Stack:** Next.js 16.3.6, React 19.3.0, TypeScript 5.9.3, CSS Modules, pnpm 10.32.1, gsap, lenis, three + @react-three/fiber + @react-three/drei, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-10-nacar-odontologia-design.md`

## Global Constraints

- Pasta do projeto: `sites/nacar-odontologia`. Não alterar nenhum outro site. Referência de padrão: `sites/clinica-pulso` (estrutura, `site.ts`, `format.ts`, cabeçalhos de segurança do `next.config.ts`) e `sites/cultura-das-ruas` (ESLint, Playwright).
- Versões exatas: `next` 16.3.6, `react`/`react-dom` 19.3.0, `typescript` 5.9.3, `@playwright/test` 1.63.0 (o Chromium dessa versão já está instalado; **não instalar navegadores novos no C:**), `packageManager` pnpm@10.32.1.
- Dependências permitidas além dessas: `gsap` ^3.15.0, `@gsap/react` ^2.1.2, `lenis` ^1.3.26, `three` ^0.186.1, `@react-three/fiber` ^9.8.1, `@react-three/drei` ^10.7.9, `@types/three`, `eslint` + `eslint-config-next` 16.3.6. Nenhuma outra.
- Paleta: tinta `#0B1020`, pérola `#F4F1EC`, azul-gelo `#C9DDE8`. Sem azul hospitalar, sem dourado.
- Fontes via `next/font/google`: `Host_Grotesk` em `--font-sans` (se o build não a encontrar, `Instrument_Sans`) e `Instrument_Serif` 400 itálico em `--font-serif`, usada só em palavras-chave.
- Texto em português do Brasil com acentuação correta. **Proibido em qualquer texto do site: preço, "R$", "gratuito", "grátis".**
- Nenhum texto de negócio em JSX: tudo vem de `src/content/site.ts`.
- WhatsApp: número `5534992011427`, exibição `(34) 99201-1427`, saudação `Olá, Estúdio Conceito! Vi o site demonstrativo da Nácar Odontologia e quero saber mais sobre um projeto assim.`
- `site.url` = `https://nacar.estudioconceito.com`, `site.demo` = `true` (robots `noindex, nofollow` e aviso no rodapé).
- **Conteúdo visível por padrão.** O HTML renderizado no servidor mostra todo o texto. Animações de entrada acima da dobra são CSS; abaixo da dobra o GSAP define o estado inicial ao montar. Com `prefers-reduced-motion: reduce` não há Lenis, não há seções fixas, não há canvas.
- O elemento de LCP é texto do hero renderizado no servidor (no desktop, o título; no celular pode ser o parágrafo de apoio), medido sem artifício de opacidade. O canvas nunca bloqueia a primeira pintura.
- Seções são alvos de âncora rentes ao topo da janela (`scroll-margin-top` negativo em `[data-theme]`): toda seção tem `padding-top` de pelo menos `var(--header-h)`.
- Palcos altos de scroll só existem sob `html[data-motion="on"]` e `@media (min-height: 520px)`; `useStageProgress(...).enabled` espelha essa regra.
- Cada seção declara `data-theme="ink"` ou `data-theme="pearl"`.
- Commits pequenos na branch `feat/nacar-odontologia`, mensagens no padrão do repositório (`feat(nacar-odontologia): …`).

## Review Focus

1. **JavaScript não carrega ou demora** → título, CTA e todas as seções continuam legíveis. Teste na Task 1 (`sem JavaScript`).
2. **WebGL indisponível ou contexto perdido** → aparece a lente desenhada em CSS, sem erro no console. Teste na Task 3.
3. **Mídia ausente** (manifesto vazio ou parcial) → marcador com o nome do arquivo, layout intacto, nenhuma requisição 404 de mídia. Teste na Task 5.
4. **Viewport baixo** (celular deitado 844×390, notebook 1366×600) → seções fixas se desfazem e o CTA do hero é alcançável. Teste nas Tasks 3 e 5.
5. **Redimensionar ou girar com a página aberta** → sem overflow horizontal e sem seção presa. Teste na Task 9.

---

## Estrutura de arquivos

```
sites/nacar-odontologia/
  package.json  next.config.ts  tsconfig.json  eslint.config.mjs  playwright.config.ts  .gitignore
  README.md  MIDIA.md (já existe)
  scripts/midia.mjs                 ingestão de midia-bruta/ → public/media/ + manifesto
  public/media/                     mídia processada (commitada)
  src/app/                          layout.tsx  page.tsx  globals.css  icon.svg
  src/content/site.ts               todo o conteúdo
  src/content/media.ts              media(file, alt) lê o manifesto
  src/content/media-manifest.json   gerado pelo script; começa como {}
  src/lib/format.ts                 whatsappUrl
  src/lib/booking.ts                bookingMessage (puro)
  src/motion/                       gsap.ts  useReducedMotion.ts  SmoothScroll.tsx  SplitReveal.tsx  useStageProgress.ts
  src/components/hero/              Hero.tsx  HeroObject.tsx  LensScene.tsx  lensGeometry.ts  pose.ts  (+ .module.css)
  src/components/                   SiteHeader  MobileBookingBar  Manifesto  MediaSlot  Treatments  BeforeAfter
                                    Planning  Space  Team  Testimonials  Booking  SiteFooter  icons  (+ .module.css)
  tests/unit/                       funções puras, sem navegador
  tests/                            specs de página
  midia-bruta/                      entrada da mídia (fora do git)
```

---

### Task 1: Base do projeto e página estática de abertura

Entrega: o projeto builda e mostra cabeçalho, hero e manifesto **sem nenhuma animação**, já com identidade visual final.

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `playwright.config.ts`, `.gitignore`
- Create: `src/app/{layout.tsx,page.tsx,globals.css,icon.svg}`, `src/content/{site.ts,media.ts,media-manifest.json}`, `src/lib/format.ts`
- Create: `src/components/{SiteHeader,MobileBookingBar,Manifesto,icons}.tsx`, `src/components/hero/Hero.tsx` e seus `.module.css`
- Test: `tests/smoke.spec.ts`, `tests/unit/format.spec.ts`

**Interfaces:**
- Produces:
  - `site` (objeto único) com, no mínimo: `name`, `url`, `demo`, `whatsapp {number, display, greeting}`, `address`, `hours`, `nav: {label, href}[]`, `hero {titleLines: string[]; titleAccent: string; lead: string; cta: string; trust: {value, label}[]}`, `manifesto {text: string; stats: {value, label}[]}`. As demais chaves entram nas tasks que as consomem.
  - `whatsappUrl(message?: string): string` em `src/lib/format.ts` (mesmo comportamento do `clinica-pulso`).
  - `type Media = { file: string; alt: string; kind: "video" | "image"; src: string | null; poster: string | null; width: number; height: number }` e `media(file: string, alt: string): Media` em `src/content/media.ts`. Lê `media-manifest.json` (`Record<file, {src, poster?, width, height}>`); arquivo ausente do manifesto devolve `src: null`. `kind` vem da extensão.
  - Classes globais: `.container`, `.visually-hidden`, `.skip-link`, `.button`, `.button--ghost`. Variáveis CSS: `--ink`, `--pearl`, `--ice`, `--font-sans`, `--font-serif`, `--gutter`, `--header-h`.
  - Ids de âncora: `#topo` (hero), `#manifesto`, `#tratamentos`, `#resultados`, `#planejamento`, `#espaco`, `#equipe`, `#agendar`.
  - `playwright.config.ts`: `webServer` roda `pnpm start -p 3210` com `reuseExistingServer: true`; `baseURL` = `process.env.SITE_URL || "http://localhost:3210"`. Projetos: `unit` (`testDir: tests/unit`, sem navegador), `motion` (1440×900, `reducedMotion: "no-preference"`, só `*.motion.spec.ts`), e quatro com `reducedMotion: "reduce"` para os demais specs: `desktop` 1440×1000, `short-desktop` 1366×768, `mobile` 390×844 (`isMobile`, `hasTouch`), `small-mobile` 320×740 (`isMobile`, `hasTouch`).
  - Scripts: `dev`, `build`, `start`, `typecheck`, `lint`, `test` (`playwright test`).

**Conteúdo fixado pela spec (hero):** `titleLines: ["O sorriso que", "você sempre"]`, `titleAccent: "quis ver."` (em `--font-serif` itálico, cor `--ice`), `cta: "Agendar avaliação"`. Lead e selos: escrever dentro das regras de conteúdo (sugestão de selos: anos de clínica, nota no Google, planejamento 3D). Manifesto: um parágrafo de 18 a 30 palavras e três números.

- [ ] **Step 1: Escrever os testes**

```ts
// tests/unit/format.spec.ts
test("whatsappUrl usa o número do estúdio e codifica a mensagem", () => {
  expect(whatsappUrl("Olá, tudo bem?")).toBe("https://wa.me/5534992011427?text=Ol%C3%A1%2C%20tudo%20bem%3F");
});

// tests/smoke.spec.ts
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
```

- [ ] **Step 2: Rodar e ver falhar** — `pnpm install` e `pnpm exec playwright test`; falha por não haver projeto.
- [ ] **Step 3: Implementar.** Layout com fontes, metadados, `MedicalClinic`→`Dentist` no JSON-LD, skip link. `globals.css` com tokens e reset no espírito do `clinica-pulso`. Cabeçalho fixo com marca tipográfica "Nácar", navegação, botão "Agendar" e menu em tela cheia no celular (padrão do `pedal-forte`). Hero em tela cheia (`100svh`), fundo tinta, título com `font-size: clamp(2.75rem, 9vw, 9rem)`, `line-height: 0.92`, `letter-spacing: -0.04em`; espaço reservado à direita (desktop) ou acima (celular) para o objeto, ocupado por enquanto pela lente em CSS (classe `lensFallback`: elipse inclinada com gradiente radial perolado e reflexo iridescente). Manifesto em fundo pérola.
- [ ] **Step 4: Verificar** — `pnpm typecheck && pnpm lint && pnpm build && pnpm test`; tudo passa.
- [ ] **Step 5: Commit** — `feat(nacar-odontologia): base do projeto e abertura estática`.

---

### Task 2: Fundação de movimento

Entrega: scroll suave no desktop, entrada do hero em CSS, texto revelado no scroll, cabeçalho que troca de cor conforme o fundo. Tudo desligado com movimento reduzido.

**Files:**
- Create: `src/motion/{gsap.ts,useReducedMotion.ts,SmoothScroll.tsx,SplitReveal.tsx,useStageProgress.ts}`
- Modify: `src/app/layout.tsx`, `src/components/hero/Hero.tsx`, `src/components/Manifesto.tsx`, `src/components/SiteHeader.tsx` e CSS
- Test: `tests/motion-base.motion.spec.ts`, `tests/reduced.spec.ts`

**Interfaces:**
- Produces:
  - `src/motion/gsap.ts`: registra e reexporta `gsap`, `ScrollTrigger`, `SplitText`, `DrawSVGPlugin`, `useGSAP`. Chama `ScrollTrigger.config({ ignoreMobileResize: true })`.
  - `useReducedMotion(): boolean`.
  - `<SmoothScroll>` (cliente): define `document.documentElement.dataset.motion = "on" | "off"`; com `"on"` e ponteiro fino cria o Lenis dirigido por `gsap.ticker` e ligado a `ScrollTrigger.update`; no toque mantém o scroll nativo. Links de âncora rolam pelo Lenis quando ele existe.
  - `<SplitReveal as? mode="lines" | "words-scrub" className?>`: `"lines"` anima uma vez ao entrar na tela (linhas mascaradas subindo); `"words-scrub"` leva a opacidade de cada palavra de 0,18 a 1 ao longo da passagem do elemento. Com movimento reduzido devolve os filhos intactos.
  - `useStageProgress(ref, onProgress: (p: number) => void, opts?: { minHeight?: number })`: mede o progresso 0→1 de um contêiner alto com filho `sticky` (`start: "top top"`, `end: "bottom bottom"`). Não ativa com movimento reduzido nem com viewport mais baixo que `minHeight` (padrão 520). Devolve `enabled: boolean`.
  - Cabeçalho: atributo `data-header-theme="ink" | "pearl"` espelhando o `data-theme` da seção sob ele.

- [ ] **Step 1: Escrever os testes**

```ts
// tests/motion-base.motion.spec.ts
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

// tests/reduced.spec.ts
test("movimento reduzido: sem Lenis e com texto opaco", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  const opacities = await page.locator("#manifesto p, h1").evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
  expect(opacities.every((o) => o === "1")).toBe(true);
});
```

- [ ] **Step 2: Rodar e ver falhar.**
- [ ] **Step 3: Implementar.** Entrada do hero só em CSS (`@keyframes`, linhas com atraso escalonado, dentro de `@media (prefers-reduced-motion: no-preference)`). Manifesto usa `<SplitReveal mode="words-scrub">`.
- [ ] **Step 4: Verificar** — `pnpm typecheck && pnpm lint && pnpm build && pnpm test`.
- [ ] **Step 5: Commit** — `feat(nacar-odontologia): fundação de movimento`.

---

### Task 3: Lente 3D no hero e virada

Entrega: o momento principal do site. A lente gira e cresce com o scroll até cobrir a tela e abrir o site em pérola.

**Files:**
- Create: `src/components/hero/{pose.ts,lensGeometry.ts,HeroObject.tsx,LensScene.tsx}` (+ CSS)
- Modify: `src/components/hero/Hero.tsx`, `Hero.module.css`
- Test: `tests/unit/pose.spec.ts`, `tests/unit/lensGeometry.spec.ts`, `tests/hero.motion.spec.ts`, `tests/hero-fallback.spec.ts`

**Interfaces:**
- Consumes: `useStageProgress`, `useReducedMotion`.
- Produces:
  - `lensPose(p: number): { rotY: number; rotX: number; scale: number; glow: number }` — `p` limitado a [0, 1]; `rotY` de −0,6 a π; `rotX` de 0,25 a 0; `scale = 1 + 9·p³`; `glow = smoothstep(0.78, 0.98, p)`.
  - `createLensGeometry(opts?: { width?: number; height?: number; depth?: number; thickness?: number; segments?: number }): THREE.BufferGeometry` — casca fina e convexa em forma de lente de contato dental (contorno de superelipse, mais estreito numa ponta), duas faces unidas pela borda, com normais. Padrões: 1 × 1,3 × 0,22, espessura 0,035, 64 segmentos.
  - `<HeroObject progressRef={{ current: number }} />` — decide: movimento reduzido, sem WebGL ou erro de carga → `lensFallback` em CSS; caso contrário importa `LensScene` com `next/dynamic` (`ssr: false`) depois da primeira pintura, mantendo o fallback visível até o primeiro quadro.
  - `<LensScene progressRef active quality />` — um `Canvas` transparente; `dpr` até 1,75 (1,5 em ponteiro grosso); `frameloop` `"always"` só com `active`; lê `progressRef` em `useFrame` e aplica `lensPose`, mais inclinação pelo ponteiro (ponteiro fino) e flutuação lenta. `PerformanceMonitor`: ao declinar, `quality="low"` (DPR 1, material sem transmissão).
  - Hero: contêiner com `height: 350svh` e palco `sticky` de `100svh`; `data-stage="hero"`; sobreposição `data-virada` em pérola cuja opacidade é `glow`; ao passar de 0,5 o hero expõe `data-theme="pearl"`. Em viewport mais baixo que 520 px ou com movimento reduzido o contêiner volta a `100svh` sem palco.

**Direção visual da lente:** `MeshPhysicalMaterial` branco-pérola, `roughness` ~0,15, `transmission` ~0,6, `thickness` ~0,4, `ior` 1,5, `clearcoat` 1, `iridescence` 1 com `iridescenceIOR` ~1,3 e faixa de espessura 100–400. Luz por `Environment` do drei com `Lightformer` (sem HDRI externo): uma área fria superior esquerda, uma tira de contraluz, um preenchimento fraco. Atrás da lente, um brilho radial azul-gelo em CSS. O resultado deve ler como cerâmica translúcida com reflexo de madrepérola, não como plástico nem vidro.

- [ ] **Step 1: Escrever os testes**

```ts
// tests/unit/pose.spec.ts
test("extremos e limites", () => {
  expect(lensPose(0)).toEqual({ rotY: -0.6, rotX: 0.25, scale: 1, glow: 0 });
  const end = lensPose(1);
  expect(end.rotY).toBeCloseTo(Math.PI); expect(end.rotX).toBeCloseTo(0);
  expect(end.scale).toBeCloseTo(10); expect(end.glow).toBe(1);
  expect(lensPose(-1)).toEqual(lensPose(0)); expect(lensPose(2)).toEqual(lensPose(1));
});
test("escala nunca diminui", () => {
  const s = Array.from({ length: 21 }, (_, i) => lensPose(i / 20).scale);
  expect(s.every((v, i) => i === 0 || v >= s[i - 1])).toBe(true);
});

// tests/unit/lensGeometry.spec.ts
test("geometria fechada, finita e nas dimensões pedidas", () => {
  const g = createLensGeometry(); g.computeBoundingBox();
  const pos = g.getAttribute("position");
  expect(pos.count).toBeGreaterThan(1000);
  expect(Array.from(pos.array).every(Number.isFinite)).toBe(true);
  expect(g.getAttribute("normal")).toBeTruthy();
  const size = g.boundingBox!.max.clone().sub(g.boundingBox!.min);
  expect(size.x).toBeCloseTo(1, 1); expect(size.y).toBeCloseTo(1.3, 1);
});

// tests/hero.motion.spec.ts
test("canvas sobe e a virada clareia o hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#topo canvas")).toBeVisible({ timeout: 15000 });
  const virada = page.locator("[data-virada]");
  expect(Number(await virada.evaluate((e) => getComputedStyle(e).opacity))).toBeLessThan(0.1);
  await page.evaluate(() => { const h = document.querySelector('[data-stage="hero"]')!; window.scrollTo(0, h.getBoundingClientRect().height - window.innerHeight); });
  await expect.poll(async () => Number(await virada.evaluate((e) => getComputedStyle(e).opacity))).toBeGreaterThan(0.9);
});

// tests/hero-fallback.spec.ts  (projetos de movimento reduzido)
test("movimento reduzido: sem canvas, com lente em CSS", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#topo canvas")).toHaveCount(0);
  await expect(page.locator("#topo [data-lens-fallback]")).toBeVisible();
});
test("celular deitado: CTA do hero alcançável", async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto("/");
  const cta = page.locator("#topo").getByRole("link", { name: /Agendar avaliação/ });
  await cta.scrollIntoViewIfNeeded(); await expect(cta).toBeInViewport();
});
```

Mais um teste em `hero.motion.spec.ts` para o Review Focus 2: com `page.addInitScript` fazendo `HTMLCanvasElement.prototype.getContext` devolver `null` para `webgl`/`webgl2`, o fallback fica visível e não há `pageerror`.

- [ ] **Step 2: Rodar e ver falhar.**
- [ ] **Step 3: Implementar** `pose.ts` e `lensGeometry.ts`; rodar `pnpm exec playwright test --project=unit`.
- [ ] **Step 4: Implementar** `LensScene`, `HeroObject` e o palco do hero.
- [ ] **Step 5: Verificar** — `pnpm typecheck && pnpm lint && pnpm build && pnpm test`. Conferir no relatório do build que o chunk com `three` não está no JS inicial da rota `/`.
- [ ] **Step 6: Commit** — `feat(nacar-odontologia): lente 3D no hero e virada`.

---

### Task 4: Preview na Vercel (executada pelo arquiteto, não por subagente)

- [ ] Conferência visual do hero em 1440, 390 e 320 px por capturas; ajustar com o implementador o que não estiver no nível.
- [ ] `git push -u origin feat/nacar-odontologia`.
- [ ] Criar o projeto Vercel `nacar-odontologia` ligado a `Mateus-Sousa93/sites_base`, Root Directory `sites/nacar-odontologia`, e obter a URL de preview da branch.
- [ ] Entregar o link ao Mateus para validar no desktop e no celular. **Ponto de decisão: lente 3D aprovada, ajustar, ou trocar para sequência de frames.**

---

### Task 5: MediaSlot e Tratamentos

**Files:**
- Create: `src/components/{MediaSlot,Treatments}.tsx` (+ CSS)
- Modify: `src/content/site.ts`, `src/app/page.tsx`
- Test: `tests/treatments.motion.spec.ts`, `tests/treatments.spec.ts`

**Interfaces:**
- Consumes: `Media`, `media()`, `useStageProgress`.
- Produces:
  - `<MediaSlot media={Media} sizes? className? priority? />` — com `src`: `<video muted loop playsInline preload="none" poster>` que toca ao entrar na tela e pausa ao sair, ou `next/image`. Sem `src`: bloco `data-media-missing` em tinta com o nome do arquivo (`media.file`) e um brilho azul-gelo sutil; nunca emite `<video>`/`<img>` com endereço vazio.
  - `site.treatments = { title: string; items: { id; name; summary; visits; duration; media: Media }[] }` com os cinco itens na ordem: lentes de contato dental (`lente.mp4`), implantes (`implante.mp4`), alinhadores invisíveis (`alinhador.mp4`), clareamento (`clareamento.mp4`), check-up digital (`checkup.mp4`).
  - Seção `#tratamentos`, `data-theme="pearl"`, `data-stage="treatments"`: contêiner de `5 × 90svh` com palco `sticky`; item ativo = `min(4, floor(p × 5))`, marcado com `data-active="true"`; contador `data-counter` no formato `03 / 05`. Desktop: lista à esquerda, moldura 4:5 à direita, troca por `clip-path`. Celular: mídia no topo do palco, texto do item ativo abaixo. Palco desativado (movimento reduzido ou viewport baixo): lista vertical, cada item com a sua mídia.

- [ ] **Step 1: Escrever os testes**

```ts
// tests/treatments.motion.spec.ts
test("o scroll troca o tratamento ativo e o contador", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => { const s = document.querySelector('[data-stage="treatments"]')!; const r = s.getBoundingClientRect(); window.scrollTo(0, window.scrollY + r.top + (r.height - window.innerHeight) * 0.5); });
  await expect(page.locator('[data-stage="treatments"] [data-active="true"]')).toContainText("Alinhadores");
  await expect(page.locator('[data-stage="treatments"] [data-counter]')).toHaveText("03 / 05");
});

// tests/treatments.spec.ts
test("cinco tratamentos legíveis sem palco", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#tratamentos li")).toHaveCount(5);
  for (const li of await page.locator("#tratamentos li").all()) await expect(li).toBeVisible();
});
test("mídia ausente vira marcador e não gera 404", async ({ page }) => {
  const failed: string[] = [];
  page.on("response", (r) => { if (r.status() === 404) failed.push(r.url()); });
  await page.goto("/");
  await page.locator("#tratamentos").scrollIntoViewIfNeeded();
  await expect(page.locator("#tratamentos [data-media-missing]").first()).toContainText(".mp4");
  expect(failed).toEqual([]);
});
```

(O teste de marcador vale enquanto o manifesto estiver vazio; a Task 10 o troca por um teste de mídia presente.)

- [ ] **Step 2: Rodar e ver falhar.** — [ ] **Step 3: Implementar.** — [ ] **Step 4: Verificar** (`typecheck`, `lint`, `build`, `test`). — [ ] **Step 5: Commit** — `feat(nacar-odontologia): tratamentos em palco fixo`.

---

### Task 6: Antes e depois

**Files:**
- Create: `src/components/BeforeAfter.tsx` (+ CSS) · Modify: `site.ts`, `page.tsx` · Test: `tests/before-after.spec.ts`

**Interfaces:**
- Produces: `site.cases = { title; note; items: { id; label; before: Media; after: Media }[] }` com três casos (`caso-N-antes.png` / `caso-N-depois.png`; rótulos: lentes de contato, alinhadores, implante). `note` avisa que são simulações ilustrativas do planejamento digital (renders 3D da Task 12, não fotos de pacientes). Seção `#resultados`, `data-theme="pearl"`. A cortina é um `<input type="range" min="0" max="100">` sobreposto (rótulo acessível "Posição da cortina entre antes e depois"), que escreve `--pos` no contêiner; a imagem "depois" usa `clip-path: inset(0 0 0 var(--pos))`. Seletor de caso: três botões com `aria-pressed`.

- [ ] **Step 1: Escrever os testes**

```ts
test("cortina responde ao teclado", async ({ page }) => {
  await page.goto("/");
  const range = page.locator("#resultados input[type=range]");
  await range.focus();
  const before = await range.inputValue();
  await page.keyboard.press("ArrowRight");
  expect(Number(await range.inputValue())).toBeGreaterThan(Number(before));
  const pos = await page.locator("#resultados [data-curtain]").evaluate((e) => getComputedStyle(e).getPropertyValue("--pos"));
  expect(pos.trim()).toBe(`${await range.inputValue()}%`);
});
test("trocar de caso marca o botão", async ({ page }) => {
  await page.goto("/");
  const second = page.locator("#resultados").getByRole("button", { name: /Alinhadores/ });
  await second.click();
  await expect(second).toHaveAttribute("aria-pressed", "true");
});
```

- [ ] Steps 2–5: falhar, implementar, verificar, commit `feat(nacar-odontologia): antes e depois com cortina`.

---

### Task 7: Planejamento digital

**Files:**
- Create: `src/components/Planning.tsx` (+ CSS) · Modify: `site.ts`, `page.tsx` · Test: `tests/planning.spec.ts`

**Interfaces:**
- Produces: `site.planning = { title; lead; steps: { label; detail }[]; clip: Media }` com três ou quatro etapas (escaneamento, planejamento, prévia, execução) e `clip = media("planejamento.mp4", …)`. Seção `#planejamento`, `data-theme="ink"`. Arcada em SVG inline gerada em código (14 contornos de dente ao longo de uma parábola) com linhas-guia e rótulos; `DrawSVGPlugin` desenha os traços conforme a seção atravessa a tela. Com clipe presente, ele entra atrás do SVG com `mix-blend-mode: screen`; sem clipe, só o SVG (aqui **não** aparece marcador). Movimento reduzido: tudo desenhado.

- [ ] **Step 1: Teste**

```ts
test("planejamento mostra a arcada e as etapas", async ({ page }) => {
  await page.goto("/");
  await page.locator("#planejamento").scrollIntoViewIfNeeded();
  await expect(page.locator("#planejamento svg [data-tooth]")).toHaveCount(14);
  expect(await page.locator("#planejamento [data-step]").count()).toBeGreaterThanOrEqual(3);
  await expect(page.locator("#planejamento [data-media-missing]")).toHaveCount(0);
});
```

- [ ] Steps 2–5: falhar, implementar, verificar, commit `feat(nacar-odontologia): planejamento digital`.

---

### Task 8: Espaço, equipe e depoimentos

**Files:**
- Create: `src/components/{Space,Team,Testimonials}.tsx` (+ CSS) · Modify: `site.ts`, `page.tsx` · Test: `tests/space-team.spec.ts`, `tests/space.motion.spec.ts`

**Interfaces:**
- Produces:
  - `site.space = { title; items: { caption; media: Media }[] }` com quatro ambientes (`espaco-recepcao.png`, `espaco-consultorio.png`, `espaco-tecnologia.png`, `espaco-lounge.png`). Seção `#espaco`, `data-theme="ink"`, `data-stage="space"`. Desktop com movimento: palco `sticky` e trilho transladado em X pelo progresso, com parallax leve na imagem. Largura até 899 px, ponteiro grosso ou palco desativado: lista horizontal com `scroll-snap`, rolagem nativa.
  - `site.team = { title; people: { name; role; cro; photo: Media }[] }` com duas pessoas (`equipe-1.png`, `equipe-2.png`). Seção `#equipe`, `data-theme="pearl"`. **Sem foto no manifesto, a pessoa aparece com um medalhão de monograma** (iniciais em `--font-serif` itálico sobre disco perolado iridescente), nunca com marcador de mídia: o site não usa rosto de banco de imagem como se fosse da equipe.
  - `site.testimonials = { rating: { value; count }; items: { quote; author; context }[] }` com três depoimentos. `data-theme="pearl"`.

- [ ] **Step 1: Testes**

```ts
// tests/space-team.spec.ts
test("espaço, equipe e depoimentos presentes", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#espaco [data-space-item]")).toHaveCount(4);
  await expect(page.locator("#equipe [data-person]")).toHaveCount(2);
  await expect(page.locator("#equipe")).toContainText("CRO");
  await expect(page.locator("blockquote")).toHaveCount(3);
});
// tests/space.motion.spec.ts
test("no desktop o trilho anda com o scroll", async ({ page }) => {
  await page.goto("/");
  const track = page.locator('[data-stage="space"] [data-track]');
  const x = () => track.evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m41);
  await page.evaluate(() => { const s = document.querySelector('[data-stage="space"]')!; const r = s.getBoundingClientRect(); window.scrollTo(0, window.scrollY + r.top + (r.height - window.innerHeight) * 0.8); });
  await expect.poll(x).toBeLessThan(-100);
});
```

- [ ] Steps 2–5: falhar, implementar, verificar, commit `feat(nacar-odontologia): espaço, equipe e depoimentos`.

---

### Task 9: Agendar, rodapé e robustez de layout

**Files:**
- Create: `src/lib/booking.ts`, `src/components/{Booking,SiteFooter}.tsx` (+ CSS) · Modify: `site.ts`, `page.tsx`, `MobileBookingBar.tsx` · Test: `tests/unit/booking.spec.ts`, `tests/booking.spec.ts`, `tests/layout.motion.spec.ts`

**Interfaces:**
- Produces:
  - `site.booking = { title; lead; goals: { id; label; phrase }[]; periods: { id; label; phrase }[] }`. Objetivos: `alinhar` ("alinhar os dentes"), `clarear` ("clarear o sorriso"), `repor` ("repor um dente"), `lentes` ("avaliar lentes de contato dental"). Períodos: `manha` ("de manhã"), `tarde` ("à tarde"), `noite` ("no início da noite").
  - `bookingMessage(goalId: string | null, periodId: string | null): string` — saudação; com objetivo acrescenta `\nQuero {phrase}`; com período acrescenta ` e prefiro atendimento {phrase}` (ou `\nPrefiro atendimento {phrase}` se não houver objetivo); termina com ponto quando acrescenta algo. Id desconhecido é tratado como `null`.
  - Seção `#agendar`, `data-theme="ink"`: dois grupos `role="radiogroup"`, botão que abre `whatsappUrl(bookingMessage(...))`, endereço, horários, mapa (`iframe` com `loading="lazy"`, padrão do `clinica-pulso`). Rodapé com o nome gigante, links e o aviso de projeto demonstrativo com imagens ilustrativas.

- [ ] **Step 1: Testes**

```ts
// tests/unit/booking.spec.ts
const g = site.whatsapp.greeting;
test("mensagens", () => {
  expect(bookingMessage(null, null)).toBe(g);
  expect(bookingMessage("lentes", "manha")).toBe(`${g}\nQuero avaliar lentes de contato dental e prefiro atendimento de manhã.`);
  expect(bookingMessage("repor", null)).toBe(`${g}\nQuero repor um dente.`);
  expect(bookingMessage(null, "tarde")).toBe(`${g}\nPrefiro atendimento à tarde.`);
  expect(bookingMessage("inexistente", "x")).toBe(g);
});

// tests/booking.spec.ts
test("escolhas montam o link do WhatsApp", async ({ page }) => {
  await page.goto("/");
  const s = page.locator("#agendar");
  await s.getByRole("radio", { name: /Clarear/ }).click();
  await s.getByRole("radio", { name: /Tarde/ }).click();
  const href = await s.getByRole("link", { name: /WhatsApp/ }).getAttribute("href");
  expect(decodeURIComponent(href!)).toContain("Quero clarear o sorriso e prefiro atendimento à tarde.");
});
test("rodapé avisa que é demonstrativo", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("footer")).toContainText(/demonstrativo/i);
});

// tests/layout.motion.spec.ts  (Review Focus 5)
test("redimensionar com a página aberta não quebra o layout", async ({ page }) => {
  await page.goto("/");
  await page.locator("#tratamentos").scrollIntoViewIfNeeded();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.locator("#agendar").scrollIntoViewIfNeeded();
  await expect(page.locator("#agendar h2")).toBeInViewport();
});
```

- [ ] Steps 2–5: falhar, implementar, verificar, commit `feat(nacar-odontologia): agendamento e rodapé`.

---

### Task 10: Ingestão da mídia

**Files:**
- Create: `scripts/midia.mjs` · Modify: `package.json` (script `midia`), `.gitignore` (`midia-bruta/`), `src/content/media-manifest.json` (gerado), testes de marcador
- Test: `tests/unit/midia.spec.ts`

**Interfaces:**
- Produces: `pnpm midia` — lê `midia-bruta/`, e para cada arquivo cujo nome está em `MIDIA.md`:
  - vídeo → `public/media/<nome>.mp4` (H.264, sem áudio, largura máxima 1280, CRF que mantenha o arquivo perto de 1,5 MB, `+faststart`) e `public/media/<nome>-poster.jpg` (quadro em 1 s);
  - imagem → `public/media/<nome>.jpg` (largura máxima 1920, qualidade ~82). A entrada pode ser `.png`, `.jpg`, `.jpeg` ou `.webp`; o que identifica o item é o nome sem extensão.
  - Reescreve `src/content/media-manifest.json` com `src`, `poster`, `width`, `height` de tudo o que existe em `public/media/`, e imprime uma tabela de presentes e ausentes.
  - Usa o ffmpeg de `process.env.FFMPEG_DIR` ou, por padrão, `E:\Tools\ffmpeg\bin`. Sem dependências npm novas.
  - Exporta a função pura `planOutputs(file: string): { kind: "video" | "image"; out: string; poster: string | null } | null` (nome fora da lista → `null`). O processamento só roda quando o arquivo é executado diretamente, não quando é importado pelo teste.

- [ ] **Step 1: Teste**

```ts
test("mapeamento de nomes", () => {
  expect(planOutputs("lente.mp4")).toEqual({ kind: "video", out: "public/media/lente.mp4", poster: "public/media/lente-poster.jpg" });
  expect(planOutputs("caso-1-antes.png")).toEqual({ kind: "image", out: "public/media/caso-1-antes.jpg", poster: null });
  expect(planOutputs("qualquer-coisa.mov")).toBeNull();
});
```

- [ ] Steps 2–5: falhar, implementar, rodar `pnpm midia` com o que houver em `midia-bruta/`, trocar o teste de marcador da Task 5 por um que exija mídia presente para os arquivos do manifesto, verificar, commit `feat(nacar-odontologia): ingestão de mídia`.

---

### Task 11: Acabamento e publicação (arquiteto)

- [ ] `README.md` do site no padrão dos outros: comandos, como adaptar, tabela de mídias com origem (Veo, GPT Image 2), avisos de conteúdo fictício e das regras do CFO.
- [ ] Linha nova na tabela do `README.md` da raiz.
- [ ] Conferir se existe clínica "Nácar" em Uberlândia; se existir, trocar a cidade do demo.
- [ ] Passada final em 1440, 1366×768, 390 e 320 px: foco de teclado, contraste, peso do JS inicial e dos vídeos contra o orçamento da spec.
- [ ] Revisão de código da branch inteira; corrigir achados.
- [ ] Merge na `main`, domínio `nacar.estudioconceito.com` no projeto Vercel, e passar ao Mateus o CNAME para a Hostinger.

---

## Adendo de 10/10/2026: mudança de mídia

Os clipes gerados no Veo não serviram e o Pexels passou a exigir verificação humana para acesso automatizado. Decisão: **o site não depende de mídia gerada por terceiros para ir ao ar.**

- Clipes dos tratamentos, clipe do planejamento e pares de antes e depois: renders 3D nossos (Task 12), com o material e a luz da lente do hero.
- Ambientes: fotos do Unsplash (licença gratuita), com tratamento de cor único.
- Equipe: medalhão de monograma enquanto não houver foto real (Task 8).
- Ordem de execução atual: 3 → 5 → 6 → 7 → 8 → 9 → 10 → 11, com a Task 12 em paralelo num worktree a partir do fim da Task 3. A Task 4 (preview) deixa de ser ponto de parada: a publicação acontece uma vez, na Task 11.

### Task 12: Estúdio de render

Entrega: uma ferramenta local que desenha cenas Three.js quadro a quadro e grava os clipes e as imagens de que o site precisa, com os nomes canônicos. Nada disso entra no bundle do site.

**Files:**
- Create: `render/studio.mjs` (servidor estático + captura), `render/studio.html`, `render/lib/{stage.js,materials.js,arch.js,loop.js}`, `render/scenes/{lente,implante,alinhador,clareamento,arcada,simulacao}.js`
- Modify: `package.json` (script `render`), `eslint.config.mjs` (se preciso para `render/`)
- Test: `tests/unit/render-arch.spec.ts`, `tests/unit/render-loop.spec.ts`, `tests/unit/render-smoke.spec.ts`

**Interfaces:**
- Consumes: `createLensGeometry` de `src/components/hero/lensGeometry.ts` (o servidor do estúdio transpila `.ts` sob demanda com o `typescript` já instalado; não duplicar a geometria) e os parâmetros de material da lente do hero.
- Produces:
  - `pnpm render [cena…] [--preview] [--out <pasta>]` — sem nome de cena renderiza tudo; `--out` padrão é `midia-bruta/`. Sobe um servidor estático local (porta 3310) que serve `render/`, `src/` e `node_modules/` (import map para `three` e `three/addons/`), abre o Chromium do Playwright, desenha cada quadro de forma determinística (`window.__frame(i)` resolve quando o quadro está pronto) e envia os PNGs por pipe para o ffmpeg (`process.env.FFMPEG_DIR` ou `E:\Tools\ffmpeg\bin`), sem gravar quadros soltos em disco. `--preview` renderiza 12 quadros por cena em meia resolução para conferência.
  - Saídas: `lente.mp4`, `implante.mp4`, `alinhador.mp4`, `clareamento.mp4`, `checkup.mp4` (1080×1350, 30 fps, 6 s, H.264 CRF 18, sem áudio, fundo tinta `#0B1020` com brilho radial azul-gelo); `planejamento.mp4` (1920×1080, 30 fps, 8 s, fundo preto puro `#000000`); `caso-1-antes.png`, `caso-1-depois.png`, `caso-2-antes.png`, `caso-2-depois.png`, `caso-3-antes.png`, `caso-3-depois.png` (1536×1024).
  - Todo clipe é um **loop perfeito**: o estado do quadro `N` é idêntico ao do quadro `0`.
  - `render/lib/loop.js`: `loopPhase(frame: number, total: number): number` (0 ≤ fase < 1, `loopPhase(total, total) === 0`).
  - `render/lib/arch.js`: `buildArch(overrides?: Record<number, ToothOverride>): Tooth[]` — 14 dentes de uma arcada superior ao longo de uma parábola, simétricos, cada um com `type` (`incisor`, `canine`, `premolar`, `molar`), `position`, `rotation`, `scale`, `tint` e `absent`. `ToothOverride = { rotate?: [x, y, z]; offset?: [x, y, z]; scale?: [x, y, z]; tint?: number; absent?: boolean }`, somado ao dente de mesmo índice.

**Cenas**

| Cena | Saída | O que mostra |
|---|---|---|
| `lente` | `lente.mp4` | A lente do hero em giro completo e lento, com a luz atravessando a cerâmica |
| `implante` | `implante.mp4` | Implante de titânio (corpo cônico com rosca helicoidal de verdade e conexão hexagonal), girando, com uma barra de luz percorrendo a rosca |
| `alinhador` | `alinhador.mp4` | A arcada como casca transparente e fina (plástico cristalino, sem dentes dentro), girando, com refração e brilho nas bordas |
| `clareamento` | `clareamento.mp4` | Os dentes da frente vistos de frente: a luz varre da esquerda para a direita enquanto o tom vai do amarelado ao branco natural e volta |
| `arcada` | `checkup.mp4`, `planejamento.mp4` | A arcada em nuvem de pontos e malha fina azul-gelo, com uma linha de varredura; duas variantes de enquadramento e fundo |
| `simulacao` | seis PNGs | Modelo de estudo (dentes perolados sobre base fosca), mesma câmera nos dois estados de cada caso. Caso 1, lentes: tom amarelado, comprimentos irregulares e diastema → uniforme e claro. Caso 2, alinhadores: apinhamento e giroversão → alinhado. Caso 3, implante: pré-molar ausente → arcada completa |

A régua de qualidade é a do hero: cerâmica translúcida com reflexo de madrepérola, luz de estúdio fria com contraluz desenhando a borda, movimento lento e pesado. Nada pode parecer plástico de brinquedo.

- [ ] **Step 1: Testes**

```ts
// tests/unit/render-loop.spec.ts
test("fase do loop fecha em zero", () => {
  expect(loopPhase(0, 180)).toBe(0);
  expect(loopPhase(90, 180)).toBeCloseTo(0.5);
  expect(loopPhase(180, 180)).toBe(0);
});

// tests/unit/render-arch.spec.ts
test("arcada simétrica com 14 dentes e overrides", () => {
  const arch = buildArch();
  expect(arch).toHaveLength(14);
  arch.forEach((t, i) => {
    const m = arch[13 - i];
    expect(t.position[0]).toBeCloseTo(-m.position[0]);
    expect(t.type).toBe(m.type);
  });
  const changed = buildArch({ 4: { absent: true }, 6: { rotate: [0, 0.3, 0] } });
  expect(changed[4].absent).toBe(true);
  expect(changed[6].rotation[1]).toBeCloseTo(arch[6].rotation[1] + 0.3);
});
```

`tests/unit/render-smoke.spec.ts`: roda `node render/studio.mjs --preview --out <pasta temporária>` e verifica que os 6 `.mp4` e os 6 `.png` existem, cada um com mais de 10 KB, e que cada PNG não é um quadro uniforme (mais de uma cor distinta entre pixels amostrados).

- [ ] **Step 2:** rodar e ver falhar.
- [ ] **Step 3:** implementar `loop.js` e `arch.js`; `pnpm exec playwright test --project=unit`.
- [ ] **Step 4:** implementar o estúdio e as cenas; conferir a olho os quadros do `--preview` de cada cena e iterar até o nível do hero.
- [ ] **Step 5:** rodar o render completo; `pnpm typecheck && pnpm lint && pnpm test`.
- [ ] **Step 6:** commit `feat(nacar-odontologia): estúdio de render e mídia 3D`.
