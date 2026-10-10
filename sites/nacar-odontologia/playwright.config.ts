import { defineConfig } from "@playwright/test";

const PORT = 3210;
const localUrl = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: process.env.SITE_URL || localUrl,
    browserName: "chromium",
  },
  // Com SITE_URL (site publicado) não há servidor local para subir.
  webServer: process.env.SITE_URL
    ? undefined
    : { command: `pnpm start -p ${PORT}`, url: localUrl, reuseExistingServer: true },
  projects: [
    // Com movimento: desktop, ponteiro fino.
    { name: "motion", use: { viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" } },
    // Com movimento reduzido, em quatro tamanhos de tela.
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" } },
    { name: "short-desktop", use: { viewport: { width: 1366, height: 768 }, reducedMotion: "reduce" } },
    {
      name: "mobile",
      use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" },
    },
    {
      name: "small-mobile",
      use: { viewport: { width: 320, height: 740 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" },
    },
  ],
});
