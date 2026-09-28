import Image from "next/image";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import styles from "./Community.module.css";

export function Community() {
  const { title, text, photo, facts, cta, testimonials } = site.community;

  return (
    <section className={`screen ${styles.section}`} id="pedal" aria-labelledby="pedal-title">
      <Image src={photo.src} alt="" fill placeholder="blur" sizes="100vw" className={styles.bg} />
      <div className={styles.shade} aria-hidden="true" />
      <div className={`container ${styles.grid}`}>
        <div className={styles.body}>
          <h2 id="pedal-title" className={styles.title}>
            {title}
          </h2>
          <p className={styles.text}>{text}</p>
          <dl className={styles.facts}>
            {facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
          <a
            className="button button--ghost"
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            {cta}
            <span className="visually-hidden"> (abre o WhatsApp em nova aba)</span>
          </a>
        </div>
        <ul className={styles.quotes} aria-label="Depoimentos de clientes">
          {testimonials.map((t) => (
            <li key={t.name}>
              <figure className={styles.quote}>
                <p className={styles.stars} aria-label="Cinco estrelas">
                  ★★★★★
                </p>
                <blockquote>
                  <p>{t.quote}</p>
                </blockquote>
                <figcaption>
                  <strong>{t.name}</strong>, {t.place}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
