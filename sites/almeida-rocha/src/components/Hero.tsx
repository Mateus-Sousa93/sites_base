"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { PauseIcon, PlayIcon, WhatsAppIcon } from "./icons";
import styles from "./Hero.module.css";

export function Hero() {
  const { video, title, lead, primary, secondary, stats } = site.hero;
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.pause();
      setPlaying(false);
      return;
    }
    el.play().catch(() => setPlaying(false));
  }, []);

  function toggle() {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  return (
    <section className={`screen screen-mobile ${styles.hero}`} id="topo" aria-labelledby="hero-title">
      <video
        ref={ref}
        className={styles.video}
        src={video.src}
        poster={video.poster}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className={styles.shade} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        <h1 id="hero-title" className={styles.title}>
          {title.map((line, i) => (
            <span key={line} className={i === 1 ? styles.second : undefined}>
              {line}{" "}
            </span>
          ))}
        </h1>
        <p className={styles.lead}>{lead}</p>
        <div className={styles.actions}>
          <a className="button" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            {primary}
            <span className="visually-hidden"> pelo WhatsApp (abre em nova aba)</span>
          </a>
          <a className="button button--ghost" href="#plano">
            {secondary}
          </a>
        </div>
      </div>

      <div className={styles.statsBar}>
        <dl className={`container ${styles.stats}`}>
          {stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <button
        type="button"
        className={styles.toggle}
        onClick={toggle}
        aria-label={playing ? "Pausar vídeo de fundo" : "Reproduzir vídeo de fundo"}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
    </section>
  );
}
