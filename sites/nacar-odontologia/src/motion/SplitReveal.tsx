"use client";

import { useRef, type HTMLAttributes, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "./gsap";
import { useReducedMotion } from "./useReducedMotion";

// Elementos de texto que o componente pode ser.
type TextTag = "div" | "p" | "span" | "h2" | "h3" | "h4" | "dt" | "dd" | "li" | "blockquote" | "figcaption";

type SplitRevealProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  /** Elemento que envolve o texto. Padrão: `div`. */
  as?: TextTag;
  /**
   * `lines`: as linhas sobem de trás de uma máscara, uma vez, quando o elemento
   * entra na tela. `words-scrub`: cada palavra vai de quase apagada a acesa
   * conforme o elemento atravessa a tela.
   */
  mode: "lines" | "words-scrub";
  children: ReactNode;
};

// Fração da altura da janela em que um elemento "entra na tela".
const ENTER_LINE = 0.88;

// Linhas mascaradas subindo. Um elemento que já está à vista quando o
// JavaScript sobe fica como está: o que a pessoa já lê não some para reaparecer.
function revealLines(element: HTMLElement) {
  if (element.getBoundingClientRect().top < window.innerHeight * ENTER_LINE) return;

  SplitText.create(element, {
    // Sem `tag`: o SplitText mede e monta as linhas com blocos (<div>). Com
    // <span> a detecção de linha erra quando um <em> atravessa uma quebra.
    type: "lines",
    mask: "lines",
    aria: "none",
    linesClass: "split-line",
    // Enquanto espera, refaz a divisão se a largura ou a fonte mudarem.
    autoSplit: true,
    onSplit: (split) =>
      gsap.from(split.lines, {
        yPercent: 130,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.11,
        scrollTrigger: { trigger: element, start: `top ${ENTER_LINE * 100}%`, once: true },
        // Terminada a entrada, o elemento volta ao HTML original: sem máscara,
        // sem observadores, livre para quebrar linha como qualquer texto.
        onComplete: () => split.revert(),
      }),
  });
}

// Palavras acendendo com o scroll, de 0,18 a 1. A frente de luz tem umas cinco
// palavras de largura e termina com o texto ainda bem acima do pé da tela.
function scrubWords(element: HTMLElement) {
  const split = SplitText.create(element, { type: "words", tag: "span", aria: "none", wordsClass: "split-word" });

  gsap.fromTo(
    split.words,
    { opacity: 0.18 },
    {
      opacity: 1,
      duration: 1,
      stagger: 0.2,
      ease: "none",
      scrollTrigger: { trigger: element, start: "clamp(top 82%)", end: "clamp(bottom 55%)", scrub: true },
    },
  );
}

// Revela um texto com o scroll. O HTML do servidor é o texto inteiro e legível;
// a divisão em linhas ou palavras só acontece no navegador, com movimento
// ligado. Com movimento reduzido devolve os filhos intactos.
//
// Os filhos precisam ser conteúdo fixo (texto e marcação simples, como <em>): a
// divisão troca os nós de texto por outros, que o React não acompanha mais.
export function SplitReveal({ as = "div", mode, children, ...rest }: SplitRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  // Para o TypeScript todas as opções são um `div`: aceitam as mesmas props.
  const Tag = as as "div";

  useGSAP(
    () => {
      const element = ref.current;
      if (reducedMotion || !element) return;
      if (mode === "lines") revealLines(element);
      else scrubWords(element);
    },
    { dependencies: [reducedMotion, mode], revertOnUpdate: true },
  );

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
