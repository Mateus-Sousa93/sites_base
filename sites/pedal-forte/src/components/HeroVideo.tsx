"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { PauseIcon, PlayIcon, WhatsAppIcon } from "./icons";
import styles from "./HeroVideo.module.css";

export function HeroVideo() {
  const { video, title, lead, primary, secondary, perks } = site.hero;
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  // Quem pede menos movimento no sistema vê só o quadro parado.
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
          {title.map((line, index) => (
            <span key={line} className={styles.line}>
              <span style={{ animationDelay: `${150 + index * 110}ms` }}>{line}</span>{" "}
            </span>
          ))}
        </h1>
        <div className={styles.bottom}>
          <div className={styles.copy}>
            <p className={styles.lead}>{lead}</p>
            <div className={styles.actions}>
              <a className="button" href="#bikes">
                {primary}
              </a>
              <a className="button button--ghost" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon />
                {secondary}
                <span className="visually-hidden"> (abre em nova aba)</span>
              </a>
            </div>
          </div>
          <ul className={styles.perks}>
            {perks.map((perk) => (
              <li key={perk}>{perk}</li>
            ))}
          </ul>
        </div>
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
