import { defineConfig } from "@playwright/test";

const PORT = 3210;
const localUrl = `http://localhost:${PORT}`;

// O three avisa, em cada processo, que carregá-lo por `require` está de saída, e
// o Playwright carrega os specs (e o que eles importam do site) como CommonJS:
// o aviso sujaria toda execução. Só ele é calado, pelo código; qualquer outro
// continua aparecendo.
const emitWarning = process.emitWarning.bind(process) as (...args: unknown[]) => void;
process.emitWarning = ((warning: unknown, ...rest: unknown[]) => {
  const code = typeof rest[0] === "object" && rest[0] !== null ? (rest[0] as { code?: string }).code : undefined;
  if (code !== "THREE_CJS_DEPRECATED") emitWarning(warning, ...rest);
}) as typeof process.emitWarning;

// Specs de página rodam com movimento reduzido em quatro tamanhos de tela.
// Ficam de fora os specs de movimento (*.motion.spec.ts) e os unitários.
const pageSpecs = { testIgnore: ["**/*.motion.spec.ts", "**/unit/**"] };

// Specs de movimento: desktop, ponteiro fino, sem preferência por movimento reduzido.
const motion = { viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" as const };

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: process.env.SITE_URL || localUrl,
    browserName: "chromium",
  },
  // Com SITE_URL (preview publicado) não há servidor local para subir.
  webServer: process.env.SITE_URL
    ? undefined
    : { command: `pnpm start -p ${PORT}`, url: localUrl, reuseExistingServer: true },
  projects: [
    { name: "unit", testDir: "./tests/unit" },
    // Specs de movimento. Com movimento a página sobe a cena 3D do hero, e o
    // Chromium sem interface desenha WebGL por software: o primeiro quadro leva
    // vários segundos de processador, com a página parada enquanto isso. Por
    // isso são dois projetos:
    // - "motion": tudo o que não é sobre a cena. O navegador recusa contextos
    //   WebGL e o hero fica com a lente em CSS, que percorre o mesmo palco.
    // - "motion-3d": os specs do hero, com a cena de verdade e prazos largos.
    //   Roda depois do "motion", para não disputar processador com os testes
    //   que medem tempo (LCP, duração da entrada, quadros da rolagem).
    {
      name: "motion",
      testMatch: "**/*.motion.spec.ts",
      testIgnore: "**/hero.motion.spec.ts",
      use: { ...motion, launchOptions: { args: ["--disable-3d-apis"] } },
    },
    {
      name: "motion-3d",
      testMatch: "**/hero.motion.spec.ts",
      dependencies: ["motion"],
      timeout: 120_000,
      expect: { timeout: 20_000 },
      use: motion,
    },
    { name: "desktop", ...pageSpecs, use: { viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" } },
    { name: "short-desktop", ...pageSpecs, use: { viewport: { width: 1366, height: 768 }, reducedMotion: "reduce" } },
    {
      name: "mobile",
      ...pageSpecs,
      use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" },
    },
    {
      name: "small-mobile",
      ...pageSpecs,
      use: { viewport: { width: 320, height: 740 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" },
    },
  ],
});
