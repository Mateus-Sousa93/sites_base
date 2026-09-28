import { site } from "@/content/site";
import styles from "./Testimonials.module.css";

export function Testimonials() {
  const { title, items } = site.testimonials;
  const [featured, ...rest] = items;

  return (
    <section className={styles.section} id="depoimentos" aria-labelledby="depoimentos-title">
      <div className="container">
        <h2 id="depoimentos-title" className={styles.title}>
          {title}
        </h2>
        <div className={styles.grid}>
          <figure className={`${styles.quote} ${styles.featured}`}>
            <blockquote>
              <p>{featured.quote}</p>
            </blockquote>
            <figcaption>
              <span className={styles.name}>{featured.name}</span>
              <span className={styles.treatment}>{featured.treatment}</span>
            </figcaption>
          </figure>
          <div className={styles.stack}>
            {rest.map((item) => (
              <figure key={item.name} className={styles.quote}>
                <blockquote>
                  <p>{item.quote}</p>
                </blockquote>
                <figcaption>
                  <span className={styles.name}>{item.name}</span>
                  <span className={styles.treatment}>{item.treatment}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
