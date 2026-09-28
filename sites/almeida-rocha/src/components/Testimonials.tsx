"use client";

import Image from "next/image";
import { useState } from "react";
import { site } from "@/content/site";
import { ChevronIcon } from "./icons";
import styles from "./Testimonials.module.css";

export function Testimonials() {
  const { title, photo, items } = site.testimonials;
  const [index, setIndex] = useState(0);
  const current = items[index];
  const go = (step: number) => setIndex((i) => (i + step + items.length) % items.length);

  return (
    <section className={`screen ${styles.section}`} aria-labelledby="depoimentos-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.body}>
          <h2 id="depoimentos-title" className={styles.title}>
            {title}
          </h2>
          <figure className={styles.quote}>
            <blockquote key={current.name}>
              <p>{current.quote}</p>
            </blockquote>
            <figcaption>
              <strong>{current.name}</strong>
              <span>{current.company}</span>
            </figcaption>
          </figure>
          <div className={styles.controls}>
            <button type="button" className={styles.arrow} onClick={() => go(-1)} aria-label="Depoimento anterior">
              <ChevronIcon direction="left" />
            </button>
            <p aria-live="polite" className={styles.position}>
              {index + 1} de {items.length}
            </p>
            <button type="button" className={styles.arrow} onClick={() => go(1)} aria-label="Próximo depoimento">
              <ChevronIcon />
            </button>
          </div>
        </div>
        <div className={`photo-cover ${styles.photo}`}>
          <Image src={photo.src} alt={photo.alt} fill placeholder="blur" sizes="(max-width: 899px) 100vw, 40vw" />
        </div>
      </div>
    </section>
  );
}
