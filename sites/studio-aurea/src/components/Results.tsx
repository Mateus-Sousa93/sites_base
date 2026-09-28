"use client";

import Image from "next/image";
import { useState } from "react";
import { site } from "@/content/site";
import { ChevronIcon } from "./icons";
import styles from "./Results.module.css";

export function Results() {
  const { title, photo, stats, testimonials } = site.results;
  const [index, setIndex] = useState(0);
  const current = testimonials[index];
  const go = (step: number) => setIndex((i) => (i + step + testimonials.length) % testimonials.length);

  return (
    <section className={`screen ${styles.section}`} id="depoimentos" aria-labelledby="depoimentos-title">
      <div className={styles.grid}>
        <div className={`photo-cover ${styles.photo}`}>
          <Image src={photo.src} alt={photo.alt} fill placeholder="blur" sizes="(max-width: 899px) 100vw, 38vw" />
        </div>

        <div className={styles.body}>
          <h2 id="depoimentos-title" className={styles.title}>
            {title}
          </h2>

          <dl className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>

          <figure className={styles.quote} aria-roledescription="carrossel" aria-label="Depoimentos de clientes">
            <div className={styles.stars} aria-label="Avaliação cinco estrelas" role="img">
              ★★★★★
            </div>
            <blockquote key={current.name} className={styles.text}>
              <p>{current.quote}</p>
            </blockquote>
            <figcaption className={styles.caption}>
              <span className={styles.name}>{current.name}</span>
              <span className={styles.treatment}>{current.treatment}</span>
            </figcaption>
          </figure>

          <div className={styles.controls}>
            <button type="button" className={styles.arrow} onClick={() => go(-1)} aria-label="Depoimento anterior">
              <ChevronIcon direction="left" />
            </button>
            <p className={styles.position} aria-live="polite">
              {index + 1} de {testimonials.length}
            </p>
            <button type="button" className={styles.arrow} onClick={() => go(1)} aria-label="Próximo depoimento">
              <ChevronIcon />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
