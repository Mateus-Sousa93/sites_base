"use client";

import Image from "next/image";
import { useState } from "react";
import { site } from "@/content/site";
import { formatPrice, installment, pixPrice, whatsappUrl } from "@/lib/format";
import styles from "./Products.module.css";

type FilterId = (typeof site.products.filters)[number]["id"];

export function Products() {
  const { title, filters, items } = site.products;
  const [filter, setFilter] = useState<FilterId>("todos");
  const visible = filter === "todos" ? items : items.filter((p) => p.kind === filter);

  return (
    <section className={`screen ${styles.section}`} id="loja" aria-labelledby="loja-title">
      <div className="container">
        <div className={styles.head}>
          <h2 id="loja-title" className={styles.title}>
            {title}
          </h2>
          <div className={styles.filters} role="group" aria-label="Filtrar produtos">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                className={styles.filter}
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <ul className={styles.grid} aria-live="polite">
          {visible.map((product) => (
            <li key={product.name} className={styles.card}>
              <div className={`photo-cover ${styles.photo}`}>
                <Image
                  src={product.photo.src}
                  alt={product.photo.alt}
                  fill
                  placeholder="blur"
                  sizes="(max-width: 899px) 50vw, 30vw"
                  style={product.photo.position ? { objectPosition: product.photo.position } : undefined}
                />
                {product.tag ? <span className={styles.tag}>{product.tag}</span> : null}
              </div>
              <div className={styles.info}>
                <div>
                  <h3 className={styles.name}>{product.name}</h3>
                  <p className={styles.detail}>{product.detail}</p>
                </div>
                <div className={styles.priceRow}>
                  <div className={styles.price}>
                    <span className={styles.value}>{formatPrice(product.price)}</span>
                    <span className={styles.terms}>
                      {installment(product.price)} ou {pixPrice(product.price)} no PIX
                    </span>
                  </div>
                  <a
                    className={styles.buy}
                    href={whatsappUrl(`${site.whatsapp.greeting}\nTenho interesse em: ${product.name} (${formatPrice(product.price)}).`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Comprar ${product.name} pelo WhatsApp (abre em nova aba)`}
                  >
                    Comprar
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
