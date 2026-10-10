"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { useStageProgress } from "@/motion/useStageProgress";
import { ArrowIcon } from "../icons";
import { HeroObject } from "./HeroObject";
import { lensPose } from "./pose";
import styles from "./Hero.module.css";

// Posição do elemento na entrada escalonada (ver "Entrada" no CSS).
const order = (index: number) => ({ "--i": index }) as CSSProperties;

// Altura do palco em telas: a mesma dos 350svh do CSS.
const STAGE_SCREENS = 3.5;
// O texto sai da frente da lente neste trecho do progresso, contado a partir do
// ponto em que o palco gruda.
const EXIT_START = 0.05;
const EXIT_SPAN = 0.25;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
// Quatro casas: o bastante para o olho, e o valor só é reescrito quando muda.
const css = (value: number) => String(Math.round(value * 1e4) / 1e4);

export function Hero() {
  const { titleLines, titleAccent, lead, cta, trust } = site.hero;
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  // Fração do progresso em que o palco gruda: zero quando o conteúdo cabe na
  // tela; maior quando ele é mais alto que ela e rola um pouco antes.
  const pinStartRef = useRef(0);
  // Os dois estados que mudam o que o resto da página enxerga do hero.
  const [turned, setTurned] = useState(false);
  const [textGone, setTextGone] = useState(false);

  // O progresso é publicado em três propriedades na seção; o CSS do hero e o do
  // objeto fazem o resto:
  //   --hero-p     progresso do palco, de 0 a 1;
  //   --hero-exit  quanto o texto já saiu, de 0 a 1;
  //   --hero-glow  quanto a tela já clareou, de 0 a 1 (a virada).
  const { enabled } = useStageProgress(sectionRef, (progress) => {
    progressRef.current = progress;
    const { glow } = lensPose(progress);
    const exit = clamp01((progress - pinStartRef.current - EXIT_START) / EXIT_SPAN);

    const style = sectionRef.current?.style;
    style?.setProperty("--hero-p", css(progress));
    style?.setProperty("--hero-exit", css(exit));
    style?.setProperty("--hero-glow", css(glow));
    setTurned(glow > 0.5);
    setTextGone(exit >= 1);
  });

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!enabled || !section || !stage) return;

    const measure = () => {
      const screen = section.offsetHeight / STAGE_SCREENS;
      const overflow = Math.max(0, stage.offsetHeight - screen);
      pinStartRef.current = overflow / (section.offsetHeight - screen);
    };
    const sizes = new ResizeObserver(measure);
    sizes.observe(stage);
    return () => {
      sizes.disconnect();
      pinStartRef.current = 0;
    };
  }, [enabled]);

  return (
    <section
      ref={sectionRef}
      id="topo"
      data-theme={turned ? "pearl" : "ink"}
      data-stage="hero"
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <div ref={stageRef} className={styles.stage}>
        <div className={`container ${styles.layout}`}>
          <div className={styles.copy} inert={textGone}>
            {/* Cada linha é um bloco com o texto num bloco interno: o de fora é a
                máscara da entrada, o de dentro sobe. O espaço entre as linhas
                mantém a frase inteira no texto do DOM. */}
            <h1 id="hero-title" className={styles.title}>
              {titleLines.map((line, index) => (
                <Fragment key={line}>
                  <span className={styles.line} style={order(index)}>
                    <span className={styles.lineText}>{line}</span>
                  </span>{" "}
                </Fragment>
              ))}
              <span className={styles.line} style={order(titleLines.length)}>
                <em className={`${styles.lineText} ${styles.accent}`}>{titleAccent}</em>
              </span>
            </h1>
            <p className={styles.lead}>{lead}</p>
            <a className={`button ${styles.cta}`} href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              {cta}
              <span className="visually-hidden"> pelo WhatsApp (abre em nova aba)</span>
              <ArrowIcon />
            </a>
          </div>

          {/* O objeto do hero: ocupa o seu lugar na grade (à direita no desktop,
              acima do título no celular) e desenha por trás do palco inteiro. */}
          <HeroObject progressRef={progressRef} />

          <dl className={styles.trust} inert={textGone}>
            {trust.map((item, index) => (
              <div key={item.label} className={styles.trustItem} style={order(index)}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* A virada: a tela clareia até a cor da seção seguinte. Só existe com o
            palco ligado. */}
        {enabled && <div className={styles.virada} data-virada aria-hidden="true" />}
      </div>
    </section>
  );
}
