import type { Page } from "@playwright/test";

export type Lcp = {
  /** Em que parte da página está o elemento. */
  where: string;
  /** Quando ele foi pintado, em milissegundos desde o início da navegação. */
  time: number;
  /** Quanto isso foi depois da primeira pintura da página. */
  afterFirstPaint: number;
};

// Maior elemento pintado segundo o navegador (LCP), sem artifício. O texto do
// hero entra invisível: o LCP só pode vir depois da primeira pintura.
export const largestContentfulPaint = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<Lcp>((resolve) => {
        const none = window.setTimeout(() => resolve({ where: "nenhum", time: 0, afterFirstPaint: 0 }), 300);
        new PerformanceObserver((list) => {
          window.clearTimeout(none);
          const entries = list.getEntries() as (PerformanceEntry & { element: Element | null })[];
          const largest = entries[entries.length - 1];
          const firstPaint = performance.getEntriesByName("first-contentful-paint")[0];
          const element = largest.element;
          const where = !element
            ? "elemento removido"
            : element.closest("#hero-title")
              ? "título"
              : element.matches("#hero-title ~ p")
                ? "parágrafo de apoio"
                : element.closest("canvas, [data-hero-object]")
                  ? "objeto do hero"
                  : "outro: " + element.tagName.toLowerCase();
          resolve({ where, time: largest.startTime, afterFirstPaint: largest.startTime - firstPaint.startTime });
        }).observe({ type: "largest-contentful-paint", buffered: true });
      }),
  );
