"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { site } from "@/content/site";
import { formatPrice, whatsappUrl } from "@/lib/format";
import { WhatsAppIcon } from "./icons";
import styles from "./TreatmentsShowcase.module.css";

export function TreatmentsShowcase() {
  const { title, intro, items } = site.treatments;
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();
  const current = items[active];

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys: Record<string, number> = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
    };
    const step = keys[event.key];
    if (step === undefined) return;
    event.preventDefault();
    const next = (active + step + items.length) % items.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <section className={`screen ${styles.section}`} id="tratamentos" aria-labelledby="tratamentos-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.menu}>
          <h2 id="tratamentos-title" className={styles.title}>
            {title}
          </h2>
          <p className={styles.intro}>{intro}</p>

          <div
            className={styles.tabs}
            role="tablist"
            aria-label="Escolha um tratamento"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
          >
            {items.map((item, index) => {
              const selected = index === active;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    tabs.current[index] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${id}-tab-${item.id}`}
                  aria-selected={selected}
                  aria-controls={`${id}-panel`}
                  tabIndex={selected ? 0 : -1}
                  className={styles.tab}
                  onClick={() => setActive(index)}
                >
                  <span className={styles.tabName}>{item.name}</span>
                  <span className={styles.tabMeta}>
                    <span className={styles.tabMinutes}>{item.minutes} min</span>
                    <span className={styles.tabPrice}>{formatPrice(item.price)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={styles.panel}
          role="tabpanel"
          id={`${id}-panel`}
          aria-labelledby={`${id}-tab-${current.id}`}
        >
          <div className={`photo-cover ${styles.photos}`}>
            {items.map((item, index) => (
              <Image
                key={item.id}
                src={item.photo.src}
                alt={index === active ? item.photo.alt : ""}
                aria-hidden={index !== active}
                fill
                placeholder="blur"
                sizes="(max-width: 899px) 100vw, 56vw"
                className={index === active ? styles.visible : styles.hidden}
              />
            ))}
          </div>
          <div className={styles.details} key={current.id}>
            <p className={styles.detailsName}>{current.name}</p>
            <p className={styles.detailsMeta}>
              {current.minutes} minutos, {formatPrice(current.price)} por sessão
            </p>
            <p className={styles.detailsText}>{current.description}</p>
            <p className={styles.detailsIndication}>
              <strong>Indicado para:</strong> {current.indication}
            </p>
            <a
              className="button"
              href={whatsappUrl(`${site.whatsapp.greeting}\nTenho interesse em: ${current.name.toLowerCase()}.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon />
              Agendar {current.name.toLowerCase()}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
