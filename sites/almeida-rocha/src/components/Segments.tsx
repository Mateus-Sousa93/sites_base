import Image from "next/image";
import { site } from "@/content/site";
import styles from "./Segments.module.css";

export function Segments() {
  const { title, items } = site.segments;

  return (
    <section className={`screen ${styles.section}`} id="segmentos" aria-labelledby="segmentos-title">
      <div className="container">
        <h2 id="segmentos-title" className={styles.title}>
          {title}
        </h2>
        <ul className={styles.grid}>
          {items.map((item) => (
            <li key={item.name} className={styles.tile}>
              <div className={`photo-cover ${styles.photo}`}>
                <Image src={item.photo.src} alt={item.photo.alt} fill placeholder="blur" sizes="(max-width: 899px) 50vw, 25vw" />
              </div>
              <div className={styles.body}>
                <h3 className={styles.name}>{item.name}</h3>
                <p className={styles.text}>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
