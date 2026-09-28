import Image from "next/image";
import { site } from "@/content/site";
import styles from "./Steps.module.css";

export function Steps() {
  const { title, photo, items } = site.steps;

  return (
    <section className={`screen ${styles.section}`} id="como-funciona" aria-labelledby="como-funciona-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.body}>
          <h2 id="como-funciona-title" className={styles.title}>
            {title}
          </h2>
          <ol className={styles.list}>
            {items.map((item, index) => (
              <li key={item.title} className={styles.step}>
                <span className={styles.number} aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3 className={styles.stepTitle}>{item.title}</h3>
                  <p className={styles.stepText}>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className={`photo-cover ${styles.photo}`}>
          <Image src={photo.src} alt={photo.alt} fill placeholder="blur" sizes="(max-width: 899px) 100vw, 45vw" />
        </div>
      </div>
    </section>
  );
}
