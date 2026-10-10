import { site } from "@/content/site";
import styles from "./Manifesto.module.css";

export function Manifesto() {
  const { label, text, accent, stats } = site.manifesto;
  // O trecho de destaque vai em serifa itálica; o resto do parágrafo fica intacto.
  const [before, ...rest] = text.split(accent);
  const after = rest.join(accent);

  return (
    <section id="manifesto" data-theme="pearl" className={styles.manifesto} aria-labelledby="manifesto-title">
      <div className={`container ${styles.grid}`}>
        <h2 id="manifesto-title" className={`eyebrow ${styles.label}`}>
          {label}
        </h2>
        <p className={styles.text}>
          {before}
          {rest.length > 0 && <em>{accent}</em>}
          {after}
        </p>
        <dl className={styles.stats}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
