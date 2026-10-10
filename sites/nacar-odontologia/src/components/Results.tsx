"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { site } from "@/content/site";
import { Reveal } from "@/motion/Reveal";
import styles from "./Results.module.css";

// Antes e depois com cortina arrastável, e uma galeria de sorrisos.
export function Results() {
  const { label, title, titleAccent, lead, caseLabel, before, after, note, gallery } = site.results;
  const [position, setPosition] = useState(50);
  const compareRef = useRef<HTMLDivElement>(null);
  const touched = useRef(false);

  // Ao entrar na tela, a cortina dá uma passada sozinha para mostrar que arrasta.
  useEffect(() => {
    const element = compareRef.current;
    if (!element || document.documentElement.dataset.motion !== "on") return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          if (touched.current) return;
          const t = Math.min((now - start) / 2200, 1);
          setPosition(50 + Math.sin(t * Math.PI * 2) * 22 * (1 - t * 0.35));
          if (t < 1) frame = requestAnimationFrame(tick);
          else setPosition(50);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.55 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="resultados" data-theme="ink" className={styles.section} aria-labelledby="resultados-title">
      <div className={`container ${styles.grid}`}>
        <Reveal className={styles.head}>
          <p className="eyebrow">{label}</p>
          <h2 id="resultados-title" className="section-title">
            {title} <em>{titleAccent}</em>
          </h2>
          <p className="section-lead">{lead}</p>
        </Reveal>

        <Reveal kind="image" className={styles.compareWrap}>
          <div
            ref={compareRef}
            className={styles.compare}
            data-curtain
            style={{ "--pos": `${position}%` } as CSSProperties}
          >
            <Image src={before.src} alt={before.alt} fill placeholder="blur" sizes="(max-width: 899px) 100vw, 60vw" />
            <div className={styles.after}>
              <Image src={after.src} alt={after.alt} fill placeholder="blur" sizes="(max-width: 899px) 100vw, 60vw" />
            </div>
            <span className={`${styles.tag} ${styles.tagBefore}`}>Antes</span>
            <span className={`${styles.tag} ${styles.tagAfter}`}>Depois</span>
            <span className={styles.handle} aria-hidden="true" />
            <input
              className={styles.range}
              type="range"
              min={0}
              max={100}
              step={1}
              value={Math.round(position)}
              aria-label="Posição da cortina entre antes e depois"
              onChange={(event) => {
                touched.current = true;
                setPosition(Number(event.target.value));
              }}
            />
          </div>
        </Reveal>

        <div className={styles.caption}>
          <p className={styles.caseLabel}>{caseLabel}</p>
          <p className={styles.note}>{note}</p>
        </div>

        <ul className={styles.gallery}>
          {gallery.map((item, index) => (
            <li key={item.caption}>
              <Reveal kind="image" delay={index * 90} className={styles.shot}>
                <Image src={item.photo.src} alt={item.photo.alt} fill placeholder="blur" sizes="(max-width: 899px) 50vw, 24vw" />
              </Reveal>
              <p>{item.caption}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
