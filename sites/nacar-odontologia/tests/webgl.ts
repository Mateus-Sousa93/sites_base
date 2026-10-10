import type { Page } from "@playwright/test";

// Faz o navegador recusar contextos WebGL nesta página: o hero fica com a lente
// em CSS, que percorre o mesmo palco. O Chromium sem interface desenha o WebGL
// por software, a poucos quadros por segundo; no projeto "motion-3d", os testes
// que são sobre o palco, e não sobre a cena, a deixam de fora com isto. (O
// projeto "motion" inteiro já roda sem WebGL, pela configuração.)
export const withoutWebGL = (page: Page) =>
  page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
      if (type === "webgl" || type === "webgl2") return null;
      return (getContext as (...args: unknown[]) => unknown).call(this, type, ...rest);
    } as typeof getContext;
  });
