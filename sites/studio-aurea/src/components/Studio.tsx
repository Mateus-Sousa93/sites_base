import { site } from "@/content/site";
import styles from "./Studio.module.css";

export function Studio() {
  const { title, text, commitments } = site.studio;

  return (
    <section className={styles.section} id="studio" aria-labelledby="studio-title">
      <div className={`container ${styles.grid}`}>
        <h2 id="studio-title" className={styles.title}>
          {title}
        </h2>
        <div className={styles.body}>
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
      </div>
    </section>
  );
}
