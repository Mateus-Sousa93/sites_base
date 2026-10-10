"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { REDUCED_MOTION_QUERY } from "./useReducedMotion";

// Ponteiro fino (mouse, trackpad) recebe o Lenis; no toque o scroll é nativo.
const FINE_POINTER_QUERY = "(pointer: fine)";

// Rolagem até uma âncora: parte sem tranco, chega devagar, e demora um pouco
// mais quando o destino está longe.
const anchorEasing = gsap.parseEase("power2.inOut");
const anchorDuration = (distance: number) => gsap.utils.clamp(0.8, 1.6, 0.6 + Math.abs(distance) / 5000);

// Alguém travou a página (menu aberto, por exemplo) com `overflow: hidden`.
const isScrollLocked = () =>
  [document.documentElement, document.body].some((element) => getComputedStyle(element).overflowY === "hidden");

// O elemento para onde aponta um clique em link da própria página, ou nulo se o
// clique deve seguir o caminho normal do navegador (outra página, nova aba,
// tecla modificadora, destino inexistente).
function anchorTarget(event: MouseEvent): HTMLElement | null {
  if (event.defaultPrevented || event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;

  const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
  if (!link || link.target === "_blank" || link.hasAttribute("download")) return null;

  const url = new URL(link.href);
  const samePage = url.origin === location.origin && url.pathname === location.pathname && url.search === location.search;
  if (!samePage || !url.hash) return null;

  return document.getElementById(decodeURIComponent(url.hash.slice(1)));
}

// O navegador, ao seguir uma âncora, passa a tabulação a partir do destino.
// Como o clique é interceptado, o foco é levado até lá à mão.
function focusWithoutScrolling(target: HTMLElement) {
  if (target.tabIndex < 0 && !target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
    target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
  }
  target.focus({ preventScroll: true });
}

// Dono do scroll da página. Mantém `data-motion` no <html> ("on" ou "off",
// conforme a preferência do sistema; o script do <head> já o define antes da
// primeira pintura), liga o Lenis só com movimento ligado e ponteiro fino, e
// leva os links de âncora até o destino com rolagem animada.
export function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    const finePointer = window.matchMedia(FINE_POINTER_QUERY);
    let lenis: Lenis | null = null;

    const tick = (time: number) => lenis?.raf(time * 1000);

    const startLenis = () => {
      lenis = new Lenis({
        lerp: 0.12,
        // Com a página travada o Lenis sai da frente: a roda volta a ser do
        // navegador, que rola só o que estiver aberto por cima.
        virtualScroll: () => !isScrollLocked(),
      });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
    };

    const stopLenis = () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };

    const sync = () => {
      const motion = !reducedMotion.matches;
      root.dataset.motion = motion ? "on" : "off";

      const smooth = motion && finePointer.matches;
      if (smooth && !lenis) startLenis();
      if (!smooth && lenis) stopLenis();
    };

    const onClick = (event: MouseEvent) => {
      // Com movimento reduzido a âncora é do navegador: salto direto.
      if (reducedMotion.matches) return;
      const target = anchorTarget(event);
      if (!target) return;

      event.preventDefault();
      const hash = `#${target.id}`;
      if (location.hash !== hash) history.pushState(null, "", hash);
      focusWithoutScrolling(target);

      // Os dois caminhos respeitam `scroll-padding-top` e `scroll-margin-top`,
      // como o navegador faria: um destino comum para logo abaixo do cabeçalho
      // fixo; uma seção, que anula essa folga no CSS, encosta no topo da janela.
      if (lenis) {
        const distance = target.getBoundingClientRect().top;
        lenis.scrollTo(target, { duration: anchorDuration(distance), easing: anchorEasing });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    sync();
    reducedMotion.addEventListener("change", sync);
    finePointer.addEventListener("change", sync);
    document.addEventListener("click", onClick);

    return () => {
      reducedMotion.removeEventListener("change", sync);
      finePointer.removeEventListener("change", sync);
      document.removeEventListener("click", onClick);
      stopLenis();
    };
  }, []);

  return null;
}
