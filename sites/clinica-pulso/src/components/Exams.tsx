"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { WhatsAppIcon } from "./icons";
import styles from "./Exams.module.css";

export function Exams() {
  const { title, text, video, items } = site.exams;
  const ref = useRef<HTMLVideoElement>(null);

  // O vídeo só carrega e roda quando a seção aparece.
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
    <section className={`screen ${styles.section}`} id="exames" aria-labelledby="exames-title">
      <div className={styles.grid}>
        <div className={styles.videoWrap}>
          <video ref={ref} className={styles.video} poster={video.poster} muted loop playsInline preload="none" aria-hidden="true" />
          <p className={styles.badge}>
            <strong>24h</strong>
            resultado no WhatsApp
          </p>
        </div>
        <div className={styles.body}>
          <h2 id="exames-title" className={styles.title}>
            {title}
          </h2>
          <p className={styles.text}>{text}</p>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.name} className={styles.item}>
                <div className={`photo-cover ${styles.thumb}`}>
                  {item.photo ? (
                    <Image src={item.photo.src} alt={item.photo.alt} fill placeholder="blur" sizes="96px" />
                  ) : (
                    <Image src={video.poster} alt="Eletrocardiograma sendo impresso" fill sizes="96px" />
                  )}
                </div>
                <div>
                  <p className={styles.name}>{item.name}</p>
                  <p className={styles.detail}>{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
          <a
            className="button"
            href={whatsappUrl(`${site.whatsapp.greeting}\nQuero agendar um exame.`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon />
            Agendar exame
            <span className="visually-hidden"> pelo WhatsApp (abre em nova aba)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
