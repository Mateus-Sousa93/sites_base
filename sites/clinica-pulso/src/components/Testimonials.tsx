import { site } from "@/content/site";
import styles from "./Testimonials.module.css";

export function Testimonials() {
  const { title, rating, ratingLabel, items } = site.testimonials;

  return (
    <section className={`screen ${styles.section}`} aria-labelledby="depoimentos-title">
      <svg className={styles.pulse} viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 60h520l30-40 40 90 36-110 34 90 24-30h756" />
      </svg>
      <div className={`container ${styles.grid}`}>
        <div className={styles.head}>
          <h2 id="depoimentos-title" className={styles.title}>
            {title}
          </h2>
          <p className={styles.rating}>
            <span className={styles.ratingValue}>{rating}</span>
            <span className={styles.stars} aria-hidden="true">
              ★★★★★
            </span>
            <span className={styles.ratingLabel}>{ratingLabel}</span>
          </p>
        </div>
        <ul className={styles.list}>
          {items.map((t) => (
            <li key={t.name}>
              <figure className={styles.quote}>
                <blockquote>
                  <p>{t.quote}</p>
                </blockquote>
                <figcaption>
                  <strong>{t.name}</strong>
                  <span>{t.specialty}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
