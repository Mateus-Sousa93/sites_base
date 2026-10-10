"use client";

import { useEffect, useState, type RefObject } from "react";
import { ScrollTrigger } from "@/motion/gsap";

export type Theme = "ink" | "pearl";

type Section = { node: HTMLElement; top: number; bottom: number };

// O que há sob a barra do cabeçalho:
// - theme: o tema da seção que cruza a borda de baixo dela. Quando uma seção
//   encosta na barra, a barra já assume as cores dela;
// - crossing: a barra ainda cobre o fim da seção anterior, de outro tema;
// - swapping: a troca de cores está em andamento (dura `swapMs`).
// Não é movimento: vale também com movimento reduzido.
//
// A cada quadro com scroll o custo é ler a posição da página e comparar com
// números guardados: a lista de seções e as alturas de cada uma (em
// coordenadas da página, que não mudam com o scroll) só são lidas de novo
// quando o layout muda. O tema de cada seção é lido na hora, do atributo: uma
// seção pode trocar de tema sem sair do lugar (a virada do hero).
export function useThemeUnder(headerRef: RefObject<HTMLElement | null>, swapMs: number) {
  const [under, setUnder] = useState({ theme: "ink" as Theme, crossing: false, swapping: false });

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let frame = 0;
    let swapTimer = 0;
    let shown: Theme = "ink";
    let sections: Section[] = [];
    let barBottom = 0;
    let stale = true;

    const measure = () => {
      stale = false;
      const scrollY = window.scrollY;
      sections = Array.from(document.querySelectorAll<HTMLElement>("[data-theme]"), (node) => {
        const { top, bottom } = node.getBoundingClientRect();
        return { node, top: top + scrollY, bottom: bottom + scrollY };
      });
      barBottom = header.getBoundingClientRect().bottom;
    };

    // A última que contém a linha: numa seção dentro de outra, vale a de dentro.
    const themeAt = (y: number) => {
      let theme: Theme | undefined;
      for (const section of sections) {
        if (section.top <= y && section.bottom > y) theme = section.node.dataset.theme === "pearl" ? "pearl" : "ink";
      }
      return theme;
    };

    const read = () => {
      frame = 0;
      if (stale) measure();
      const scrollY = window.scrollY;
      const theme = themeAt(scrollY + barBottom + 1);
      if (!theme) return;
      const crossing = (themeAt(scrollY + 1) ?? theme) !== theme;
      const swapped = theme !== shown;
      shown = theme;

      setUnder((prev) =>
        prev.theme === theme && prev.crossing === crossing
          ? prev
          : { theme, crossing, swapping: prev.swapping || swapped },
      );
      if (swapped) {
        window.clearTimeout(swapTimer);
        swapTimer = window.setTimeout(() => setUnder((prev) => ({ ...prev, swapping: false })), swapMs + 60);
      }
    };

    // No máximo uma leitura por quadro, seja qual for a origem da mudança.
    const schedule = () => {
      frame ||= requestAnimationFrame(read);
    };
    // O layout mudou: as medidas guardadas não valem mais.
    const invalidate = () => {
      stale = true;
      schedule();
    };

    // Troca de tema sem mudança de layout: as medidas continuam valendo.
    const themes = new MutationObserver(schedule);
    themes.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["data-theme"] });
    // Uma seção muda de altura sem a janela mudar (o palco do hero liga e
    // desliga com a preferência de movimento, uma fonte termina de carregar).
    const sizes = new ResizeObserver(invalidate);
    for (const node of document.querySelectorAll("[data-theme]")) sizes.observe(node);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", invalidate);
    ScrollTrigger.addEventListener("refresh", invalidate);
    schedule();

    return () => {
      themes.disconnect();
      sizes.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", invalidate);
      ScrollTrigger.removeEventListener("refresh", invalidate);
      cancelAnimationFrame(frame);
      window.clearTimeout(swapTimer);
    };
  }, [headerRef, swapMs]);

  return under;
}
