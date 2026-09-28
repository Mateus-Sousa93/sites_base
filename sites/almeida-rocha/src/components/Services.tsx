"use client";

import Image from "next/image";
import { useState } from "react";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import styles from "./Services.module.css";

export function Services() {
  const { title, items } = site.services;
  const [active, setActive] = useState(0);
  const current = items[active];

  return (
    <section className={`screen ${styles.section}`} id="servicos" aria-labelledby="servicos-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.list}>
          <h2 id="servicos-title" className={styles.title}>
            {title}
          </h2>
          <ul>
            {items.map((item, index) => {
              const open = index === active;
              return (
                <li key={item.name} className={`${styles.item} ${open ? styles.open : ""}`}>
                  <button
                    type="button"
                    className={styles.trigger}
                    aria-expanded={open}
                    onClick={() => setActive(index)}
                    onMouseEnter={() => setActive(index)}
                  >
                    <span className={styles.name}>{item.name}</span>
                    <span className={styles.plus} aria-hidden="true" />
                  </button>
                  <div className={styles.panel} hidden={!open}>
                    <p>{item.text}</p>
                    <p className={styles.detail}>{item.detail}</p>
                    <a
                      className={styles.link}
                      href={whatsappUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Quero saber mais
                      <span className="visually-hidden"> sobre {item.name} pelo WhatsApp (abre em nova aba)</span>
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.media}>
          {items.map((item, index) => (
            <div key={item.name} className={`photo-cover ${styles.photo} ${index === active ? styles.shown : ""}`} aria-hidden={index !== active}>
              <Image src={item.photo.src} alt={index === active ? item.photo.alt : ""} fill placeholder="blur" sizes="(max-width: 899px) 100vw, 50vw" />
            </div>
          ))}
          <p className={styles.caption} key={current.name}>
            {current.detail}
          </p>
        </div>
      </div>
    </section>
  );
}
