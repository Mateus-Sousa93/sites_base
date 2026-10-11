// Captura cada seção da página em desktop e celular, para conferência visual.
// Uso: node scripts/shots.mjs <url> <pasta de saída>
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const url = process.argv[2] ?? "http://localhost:3300/";
const out = process.argv[3] ?? "shots";
mkdirSync(out, { recursive: true });

const targets = [
  { name: "desktop", viewport: { width: 1440, height: 900 } },
  { name: "notebook", viewport: { width: 1366, height: 768 } },
  { name: "phone", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];

const browser = await chromium.launch();
for (const target of targets) {
  const { name, ...options } = target;
  const context = await browser.newContext(options);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(2600);
  await page.screenshot({ path: join(out, `${name}-00-topo.png`) });

  const ids = await page.evaluate(() =>
    Array.from(document.querySelectorAll("main > section[id], footer"), (node) => node.id || "rodape").slice(1),
  );
  let index = 1;
  for (const id of ids) {
    const steps = await page.evaluate((sectionId) => {
      const node = sectionId === "rodape" ? document.querySelector("footer") : document.getElementById(sectionId);
      const top = node.getBoundingClientRect().top + window.scrollY;
      const height = node.getBoundingClientRect().height;
      const count = Math.min(3, Math.max(1, Math.round(height / window.innerHeight)));
      return Array.from({ length: count }, (_, i) => Math.round(top + (i * (height - window.innerHeight)) / Math.max(1, count - 1)));
    }, id);
    for (const [part, y] of steps.entries()) {
      await page.evaluate((value) => window.scrollTo(0, value), y);
      await page.waitForTimeout(1700);
      await page.screenshot({ path: join(out, `${name}-${String(index).padStart(2, "0")}-${id}-${part}.png`) });
    }
    index += 1;
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log(name, "seções:", ids.join(", "), "| overflow horizontal:", overflow, "| erros:", errors.length ? errors : "nenhum");
  await context.close();
}
await browser.close();
