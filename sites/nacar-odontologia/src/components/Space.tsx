"use client";

import Image from "next/image";
import { useRef } from "react";
import { site } from "@/content/site";
import { Reveal } from "@/motion/Reveal";
import styles from "./Space.module.css";

// A clínica: galeria horizontal. Rola com o dedo, com o trackpad ou pelos botões.
export function Space() {
  const { label, title, titleAccent, lead, items } = site.space;
  const trackRef = useRef<HTMLUListElement>(null);

  function move(direction: 1 | -1) {
    const track = trackRef.current;
    const first = track?.firstElementChild;
    if (!track || !first) return;
    const step = first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || "0");
    track.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  return (
    <section id="clinica" data-theme="pearl" className={`screen ${styles.section}`} aria-labelledby="clinica-title">
      <div className={`container ${styles.head}`}>
        <Reveal className={styles.heading}>
          <p className="eyebrow">{label}</p>
          <h2 id="clinica-title" className="section-title">
            {title} <em>{titleAccent}</em>
          </h2>
        </Reveal>
        <Reveal delay={120} className={styles.side}>
          <p className="section-lead">{lead}</p>
          <div className={styles.controls}>
            <button type="button" onClick={() => move(-1)} aria-label="Foto anterior">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 12H5m6-6-6 6 6 6" />
              </svg>
            </button>
            <button type="button" onClick={() => move(1)} aria-label="Próxima foto">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </button>
          </div>
        </Reveal>
      </div>

      <ul ref={trackRef} className={styles.track} data-lenis-prevent-touch tabIndex={0} aria-label="Fotos da clínica">
        {items.map((item, index) => (
          <li key={item.caption} data-space-item>
            <Reveal kind="image" delay={Math.min(index, 2) * 100} className={styles.shot}>
              <Image src={item.photo.src} alt={item.photo.alt} fill placeholder="blur" sizes="(max-width: 899px) 86vw, 62vw" />
            </Reveal>
            <p>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              {item.caption}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
