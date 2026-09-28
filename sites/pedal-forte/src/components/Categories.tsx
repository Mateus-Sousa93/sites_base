"use client";

import Image from "next/image";
import { useState } from "react";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import styles from "./Categories.module.css";

export function Categories() {
  const { title, items } = site.categories;
  const [active, setActive] = useState(0);

  return (
    <section className={`screen ${styles.section}`} id="bikes" aria-labelledby="bikes-title">
      <div className={`container ${styles.head}`}>
        <h2 id="bikes-title" className={styles.title}>
          {title}
        </h2>
        <p className={styles.intro}>Mais de 400 itens em estoque na loja física. Passe o mouse ou toque para ver cada linha.</p>
      </div>

      <ul className={`container ${styles.panels}`}>
        {items.map((item, index) => {
          const open = index === active;
          return (
            <li
              key={item.name}
              className={`${styles.panel} ${open ? styles.open : ""}`}
              onMouseEnter={() => setActive(index)}
            >
              <button
                type="button"
                className={styles.trigger}
                aria-expanded={open}
                onClick={() => setActive(index)}
                onFocus={() => setActive(index)}
              >
                <span className="visually-hidden">Mostrar </span>
                {item.name}
              </button>
              <div className={`photo-cover ${styles.photo}`}>
                <Image src={item.photo.src} alt={item.photo.alt} fill placeholder="blur" sizes="(max-width: 899px) 80vw, 45vw" />
              </div>
              <div className={styles.label} aria-hidden={!open}>
                <span className={styles.count}>{item.count} modelos</span>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.detail}>{item.detail}</span>
                <a
                  className={`button button--signal ${styles.link}`}
                  href={whatsappUrl(`${site.whatsapp.greeting}\nQuero ver opções de ${item.name.toLowerCase()}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={open ? 0 : -1}
                >
                  Ver modelos
                  <span className="visually-hidden"> de {item.name} no WhatsApp (abre em nova aba)</span>
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
