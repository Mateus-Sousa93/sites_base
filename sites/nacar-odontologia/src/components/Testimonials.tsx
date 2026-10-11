import { site } from "@/content/site";
import { Reveal } from "@/motion/Reveal";
import styles from "./Testimonials.module.css";

export function Testimonials() {
  const { label, title, titleAccent, rating, items } = site.testimonials;

  return (
    <section id="depoimentos" data-theme="ink" className="screen" aria-labelledby="depoimentos-title">
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.head}>
          <div className={styles.heading}>
            <p className="eyebrow">{label}</p>
            <h2 id="depoimentos-title" className="section-title">
              {title} <em>{titleAccent}</em>
            </h2>
          </div>
          <p className={styles.rating}>
            <strong>{rating.value}</strong>
            <span>
              <span className={styles.stars} aria-hidden="true">
                ★★★★★
              </span>
              {rating.label}
            </span>
          </p>
        </Reveal>

        <ul className={styles.list}>
          {items.map((item, index) => (
            <li key={item.author}>
              <Reveal delay={index * 100} className={styles.reveal}>
                <figure className={styles.quote}>
                  <blockquote>
                    <p>{item.quote}</p>
                  </blockquote>
                  <figcaption>
                    <strong>{item.author}</strong>
                    <span>{item.context}</span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
