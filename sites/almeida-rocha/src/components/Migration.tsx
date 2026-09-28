import Image from "next/image";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import styles from "./Migration.module.css";

export function Migration() {
  const { title, text, photo, steps } = site.migration;

  return (
    <section className={`screen ${styles.section}`} id="migracao" aria-labelledby="migracao-title">
      <div className={styles.grid}>
        <div className={`photo-cover ${styles.photo}`}>
          <Image src={photo.src} alt={photo.alt} fill placeholder="blur" sizes="(max-width: 899px) 100vw, 45vw" />
          <p className={styles.badge}>
            <strong>30</strong>
            dias para a troca completa
          </p>
        </div>
        <div className={styles.body}>
          <h2 id="migracao-title" className={styles.title}>
            {title}
          </h2>
          <p className={styles.text}>{text}</p>
          <ol className={styles.steps}>
            {steps.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.week} aria-hidden="true">
                  Semana {index + 1}
                </span>
                <div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepText}>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <a
            className="button button--ink"
            href={whatsappUrl(`${site.whatsapp.greeting}\nQuero trocar de contador.`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Quero trocar de contador
            <span className="visually-hidden"> (abre o WhatsApp em nova aba)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
