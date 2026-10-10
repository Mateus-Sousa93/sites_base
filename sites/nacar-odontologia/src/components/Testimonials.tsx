import Image from "next/image";
import { site } from "@/content/site";
import { Reveal } from "@/motion/Reveal";
import styles from "./Testimonials.module.css";

export function Testimonials() {
  const { label, title, titleAccent, rating, photo, items } = site.testimonials;

  return (
    <section id="depoimentos" data-theme="ink" className={styles.section} aria-labelledby="depoimentos-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.side}>
          <Reveal className={styles.head}>
            <p className="eyebrow">{label}</p>
            <h2 id="depoimentos-title" className="section-title">
              {title} <em>{titleAccent}</em>
            </h2>
          </Reveal>
          <Reveal kind="image" className={styles.photo}>
            <Image src={photo.src} alt={photo.alt} fill placeholder="blur" sizes="(max-width: 899px) 100vw, 38vw" />
            <p className={styles.rating}>
              <span className={styles.stars} aria-hidden="true">
                ★★★★★
              </span>
              <strong>{rating.value}</strong>
              <span>{rating.label}</span>
            </p>
          </Reveal>
        </div>

        <ul className={styles.list}>
          {items.map((item, index) => (
            <li key={item.author}>
              <Reveal delay={index * 100}>
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
