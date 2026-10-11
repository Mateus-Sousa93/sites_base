// Captura referências (sites de clínicas) para calibrar proporção e densidade.
// Uso: node scripts/refs.mjs <pasta de saída> <url> [url...]
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const [out, ...urls] = process.argv.slice(2);
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
for (const [index, url] of urls.entries()) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "pt-BR" });
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(7000);
    for (const [step, fraction] of [0, 1, 2.2, 3.6].entries()) {
      await page.mouse.wheel(0, step === 0 ? 0 : 900 * (fraction - [0, 1, 2.2, 3.6][step - 1]));
      await page.waitForTimeout(step === 0 ? 0 : 2200);
      await page.screenshot({ path: join(out, `ref-${index + 1}-${step}.png`) });
    }
    console.log("ok", url);
  } catch (error) {
    console.log("falhou", url, String(error).slice(0, 120));
  }
  await context.close();
}
await browser.close();
