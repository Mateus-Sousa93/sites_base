"use client";

import Image from "next/image";
import { useState } from "react";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { Reveal } from "@/motion/Reveal";
import { ArrowIcon } from "./icons";
import styles from "./Treatments.module.css";

const pad = (value: number) => String(value).padStart(2, "0");

// Lista de tratamentos: o item aberto mostra o resumo e troca a foto ao lado.
export function Treatments() {
  const { label, title, titleAccent, items } = site.treatments;
  const [active, setActive] = useState(0);

  return (
    <section id="tratamentos" data-theme="pearl" className={`screen ${styles.section}`} aria-labelledby="tratamentos-title">
      <div className={`container ${styles.grid}`}>
        <Reveal kind="image" className={styles.stage}>
          {items.map((item, index) => (
            <div key={item.id} className={styles.frame} data-active={index === active}>
              <Image
                src={item.photo.src}
                alt={index === active ? item.photo.alt : ""}
                fill
                placeholder="blur"
                sizes="(max-width: 899px) 100vw, 42vw"
                style={item.photo.focus ? { objectPosition: item.photo.focus } : undefined}
              />
            </div>
          ))}
          <span className={styles.counter} aria-hidden="true">
            {pad(active + 1)} / {pad(items.length)}
          </span>
        </Reveal>

        <div className={styles.copy}>
          <Reveal className={styles.head}>
            <p className="eyebrow">{label}</p>
            <h2 id="tratamentos-title" className="section-title">
              {title} <em>{titleAccent}</em>
            </h2>
          </Reveal>

          <ol className={styles.list}>
          {items.map((item, index) => {
            const open = index === active;
            return (
              <li key={item.id} className={styles.item} data-active={open}>
                <h3 className={styles.heading}>
                  <button
                    type="button"
                    className={styles.trigger}
                    aria-expanded={open}
                    aria-controls={`tratamento-${item.id}`}
                    onClick={() => setActive(index)}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                  >
                    <span className={styles.index} aria-hidden="true">
                      {pad(index + 1)}
                    </span>
                    <span className={styles.name}>{item.name}</span>
                    <span className={styles.mark} aria-hidden="true" />
                  </button>
                </h3>
                <div id={`tratamento-${item.id}`} className={styles.panel} inert={!open}>
                  <div className={styles.panelInner}>
                    <p>{item.summary}</p>
                    <ul className={styles.facts}>
                      {item.facts.map((fact) => (
                        <li key={fact}>{fact}</li>
                      ))}
                    </ul>
                    <a
                      className={styles.link}
                      href={whatsappUrl(`${site.whatsapp.greeting}\nQuero saber mais sobre ${item.name.toLowerCase()}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {site.hero.cta}
                      <span className="visually-hidden"> de {item.name.toLowerCase()} pelo WhatsApp (abre em nova aba)</span>
                      <ArrowIcon />
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
          </ol>
        </div>
      </div>
    </section>
  );
}
