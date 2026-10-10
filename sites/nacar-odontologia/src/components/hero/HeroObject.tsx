"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { site } from "@/content/site";
import { useReducedMotion } from "@/motion/useReducedMotion";
import type { LensQuality } from "./LensScene";
import styles from "./HeroObject.module.css";

// A cena 3D (three, fiber e drei) mora num chunk à parte, que o HTML não
// referencia: só é baixado no navegador, depois da primeira pintura.
const loadScene = () => import("./LensScene");
const LensScene = dynamic(() => loadScene().then((module) => module.LensScene), { ssr: false });

// A cena exige WebGL 2 (o three não desenha com menos). O contexto de teste é
// devolvido na hora.
function supportsWebGL() {
  try {
    const context = document.createElement("canvas").getContext("webgl2");
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    return context !== null;
  } catch {
    return false;
  }
}

// Qualquer erro ao baixar ou montar a cena (chunk que não chega, contexto WebGL
// perdido) fica contido aqui: quem chama volta à lente em CSS.
class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type HeroObjectProps = {
  /** Progresso do palco do hero, de 0 a 1, lido a cada quadro. */
  progressRef: { current: number };
};

// O objeto do hero: uma lente de porcelana. Este componente é o contrato com o
// resto do hero (recebe o progresso do palco e desenha) e decide como desenhar:
// - com movimento reduzido, sem WebGL ou se a cena falhar: a lente em CSS;
// - caso contrário: a cena 3D, com a lente em CSS no lugar até o primeiro quadro.
// A lente em CSS mora na célula da grade; a cena cobre o palco inteiro, por
// trás do texto, porque a lente cresce até cobrir a tela.
export function HeroObject({ progressRef }: HeroObjectProps) {
  const reducedMotion = useReducedMotion();
  const homeRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [wanted, setWanted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [quality, setQuality] = useState<LensQuality>("high");

  const mounted = wanted && !reducedMotion && !failed;

  // Depois da primeira pintura (dois quadros adiante), e só se o navegador der
  // um contexto WebGL, o chunk da cena começa a baixar. A cena entra quando a
  // entrada em CSS da lente assentou: a lente em CSS já está na pose de
  // repouso, e a troca é uma fusão entre duas imagens iguais.
  useEffect(() => {
    const fallback = fallbackRef.current;
    if (reducedMotion || failed || wanted || !fallback) return;
    let current = true;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        if (!supportsWebGL()) return;
        loadScene().catch(() => {});
        const entrance = fallback.getAnimations().map((animation) => animation.finished);
        Promise.allSettled(entrance).then(() => {
          if (current) setWanted(true);
        });
      });
    });
    return () => {
      current = false;
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion, failed, wanted]);

  // A cena só desenha com o palco na tela.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!mounted || !scene) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(scene);
    return () => {
      observer.disconnect();
      setReady(false);
    };
  }, [mounted]);

  const handleReady = useCallback(() => setReady(true), []);
  const handleDecline = useCallback(() => setQuality("low"), []);
  const handleFailure = useCallback(() => setFailed(true), []);

  return (
    <div className={styles.object} data-hero-object data-lens={mounted && ready ? "3d" : "css"} aria-hidden="true">
      <div className={styles.slot}>
        <div ref={homeRef} className={styles.lensBox}>
          <div ref={fallbackRef} className={styles.lensFallback} data-lens-fallback />
        </div>
        <p className={styles.caption}>
          <span>{site.hero.caption}</span>
        </p>
      </div>

      {mounted && (
        <div ref={sceneRef} className={styles.scene} data-lens-scene={ready ? "ready" : "loading"}>
          <SceneBoundary onError={handleFailure}>
            <LensScene
              progressRef={progressRef}
              homeRef={homeRef}
              active={onScreen}
              quality={quality}
              onReady={handleReady}
              onDecline={handleDecline}
              onLost={handleFailure}
            />
          </SceneBoundary>
        </div>
      )}
    </div>
  );
}
