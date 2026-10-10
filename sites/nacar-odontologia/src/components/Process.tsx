import Image from "next/image";
import { site } from "@/content/site";
import { Reveal } from "@/motion/Reveal";
import styles from "./Process.module.css";

// Como funciona: as quatro etapas do planejamento, ao lado de uma foto do consultório.
export function Process() {
  const { label, title, titleAccent, lead, photo, card, steps } = site.process;

  return (
    <section id="planejamento" data-theme="pearl" className={styles.section} aria-labelledby="planejamento-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.media}>
          <Reveal kind="image" className={styles.photo}>
            <Image src={photo.src} alt={photo.alt} fill placeholder="blur" sizes="(max-width: 899px) 100vw, 44vw" />
          </Reveal>
          <Reveal delay={260} className={styles.card}>
            <strong>{card.value}</strong>
            <span>{card.label}</span>
          </Reveal>
        </div>

        <div className={styles.copy}>
          <Reveal className={styles.head}>
            <p className="eyebrow">{label}</p>
            <h2 id="planejamento-title" className="section-title">
              {title} <em>{titleAccent}</em>
            </h2>
            <p className="section-lead">{lead}</p>
          </Reveal>

          <ol className={styles.steps}>
            {steps.map((step, index) => (
              <li key={step.title}>
                <Reveal delay={index * 80} className={styles.step}>
                  <span className={styles.number} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
