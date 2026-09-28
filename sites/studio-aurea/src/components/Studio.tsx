import Image from "next/image";
import { site } from "@/content/site";
import styles from "./Studio.module.css";

export function Studio() {
  const { title, text, photos, commitments } = site.studio;
  const [main, ...side] = photos;

  return (
    <section className={`screen ${styles.section}`} id="studio" aria-labelledby="studio-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <h2 id="studio-title" className={styles.title}>
            {title}
          </h2>
          <p className={styles.text}>{text}</p>
          <dl className={styles.list}>
            {commitments.map((item) => (
              <div key={item.title} className={styles.row}>
                <dt>{item.title}</dt>
                <dd>{item.text}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={`photo-cover ${styles.main}`}>
          <Image src={main.src} alt={main.alt} fill placeholder="blur" sizes="(max-width: 899px) 100vw, 36vw" />
        </div>
        {side.map((photo, index) => (
          <div key={photo.alt} className={`photo-cover ${styles.side} ${index === 0 ? styles.sideTop : styles.sideBottom}`}>
            <Image src={photo.src} alt={photo.alt} fill placeholder="blur" sizes="(max-width: 899px) 50vw, 22vw" />
          </div>
        ))}
      </div>
    </section>
  );
}
