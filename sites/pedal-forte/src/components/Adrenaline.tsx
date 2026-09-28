"use client";

import { useEffect, useRef } from "react";
import { site } from "@/content/site";
import styles from "./Adrenaline.module.css";

// O vídeo só baixa e roda quando a seção entra na tela, e para quando sai.
export function Adrenaline() {
  const { video, title, text } = site.adrenaline;
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!el.src) el.src = video.src;
          el.play().catch(() => undefined);
        } else {
          el.pause();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [video.src]);

  return (
    <section className={`screen ${styles.section}`} aria-labelledby="adrenalina-title">
      <video
        ref={ref}
        className={styles.video}
        poster={video.poster}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
      />
      <div className={styles.shade} aria-hidden="true" />
      <div className={`container ${styles.content}`}>
        <h2 id="adrenalina-title" className={styles.title}>
          {title.map((line) => (
            <span key={line}>{line} </span>
          ))}
        </h2>
        <p className={styles.text}>{text}</p>
      </div>
    </section>
  );
}
