import Image from "next/image";
import { site } from "@/content/site";
import { Reveal } from "@/motion/Reveal";
import { SplitReveal } from "@/motion/SplitReveal";
import styles from "./Manifesto.module.css";

// Como trabalhamos: retrato à esquerda; à direita, o parágrafo e três números.
export function Manifesto() {
  const { label, text, accent, photo, stats } = site.manifesto;
  // O trecho de destaque vai em itálico; o resto do parágrafo fica intacto.
  const [before, ...rest] = text.split(accent);
  const after = rest.join(accent);

  return (
    <section id="manifesto" data-theme="pearl" className="screen" aria-labelledby="manifesto-title">
      <div className={`container ${styles.grid}`}>
        <Reveal kind="image" className={styles.photo}>
          <Image src={photo.src} alt={photo.alt} fill placeholder="blur" sizes="(max-width: 899px) 100vw, 34vw" />
        </Reveal>

        <div className={styles.copy}>
          <h2 id="manifesto-title" className={`eyebrow ${styles.label}`}>
            {label}
          </h2>
          {/* As palavras acendem conforme o parágrafo atravessa a tela. */}
          <SplitReveal as="p" mode="words-scrub" className={styles.text}>
            {before}
            {rest.length > 0 && <em>{accent}</em>}
            {after}
          </SplitReveal>
          <dl className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
