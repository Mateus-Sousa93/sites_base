import { defineConfig } from "@playwright/test";

const PORT = 3210;
const localUrl = `http://localhost:${PORT}`;

// Specs de página rodam com movimento reduzido em quatro tamanhos de tela.
// Ficam de fora os specs de movimento (*.motion.spec.ts) e os unitários.
const pageSpecs = { testIgnore: ["**/*.motion.spec.ts", "**/unit/**"] };

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
    {
      name: "motion",
      testMatch: "**/*.motion.spec.ts",
      use: { viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" },
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
