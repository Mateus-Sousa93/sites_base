"use client";

// Convenção dos palcos altos
// --------------------------
// Um palco é um contêiner bem mais alto que a janela com um filho `sticky` que
// fica parado enquanto a página rola por dentro dele. No CSS, a altura extra e
// o `sticky` só existem sob as duas condições abaixo:
//
//   html[data-motion="on"] .palco { ... }   dentro de   @media (min-height: 520px)
//
// Fora delas (sem JavaScript, com movimento reduzido ou em janela baixa, como
// celular deitado) a seção fica em fluxo normal, com todo o conteúdo à vista.
// O `enabled` devolvido aqui espelha exatamente essa regra: movimento ligado E
// janela com pelo menos `minHeight` de altura. Ele acompanha o
// redimensionamento e a troca da preferência do sistema. Quem usar outro
// `minHeight` precisa usar o mesmo valor na media query do CSS.

import { useLayoutEffect, useRef, type RefObject } from "react";
import { ScrollTrigger, useGSAP } from "./gsap";
import { useMediaQuery, useReducedMotion } from "./useReducedMotion";

// Mede o progresso de 0 a 1 da rolagem por dentro de um palco: 0 quando o topo
// do contêiner encosta no topo da janela, 1 quando o pé encosta no pé.
// `onProgress` é chamado fora do render, a cada mudança. Quando o palco é
// desativado com a página aberta, recebe 0 uma última vez: é a pose do layout
// estático.
export function useStageProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void,
  { minHeight = 520 }: { minHeight?: number } = {},
): { enabled: boolean } {
  const reducedMotion = useReducedMotion();
  const tallEnough = useMediaQuery(`(min-height: ${minHeight}px)`, false);
  const enabled = !reducedMotion && tallEnough;

  // Sempre a versão mais recente do callback, sem recriar o gatilho.
  const latest = useRef(onProgress);
  useLayoutEffect(() => {
    latest.current = onProgress;
  });

  const wasActive = useRef(false);

  useGSAP(
    () => {
      const stage = ref.current;
      if (!enabled || !stage) {
        if (wasActive.current) latest.current(0);
        wasActive.current = false;
        return;
      }

      wasActive.current = true;
      const report = (self: ScrollTrigger) => latest.current(self.progress);
      const trigger = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: "bottom bottom",
        onUpdate: report,
        onRefresh: report,
      });
      report(trigger);
    },
    { dependencies: [enabled], revertOnUpdate: true },
  );

  return { enabled };
}
