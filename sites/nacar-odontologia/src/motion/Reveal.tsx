"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  // "up": sobe e aparece. "image": abre de baixo para cima, com a foto assentando.
  kind?: "up" | "image";
  // Atraso em milissegundos, para escalonar itens vizinhos.
  delay?: number;
  className?: string;
};

// Entrada de um bloco ao chegar na tela. O conteúdo é visível por padrão: só
// depois de montado o bloco é "armado" (escondido pelo CSS, e apenas com
// movimento ligado) e revelado quando entra no viewport.
export function Reveal({ children, kind = "up", delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.dataset.armed = "true";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.dataset.inview = "true";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={kind}
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
