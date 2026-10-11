import Image from "next/image";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { ArrowIcon } from "../icons";
import styles from "./Hero.module.css";

// Abertura: uma fotografia de tela cheia, com o título embaixo à esquerda.
export function Hero() {
  const { eyebrow, titleLines, titleAccent, lead, cta, secondary, photo, meta } = site.hero;

  return (
    <section id="topo" data-theme="ink" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.photo}>
        <Image src={photo.src} alt={photo.alt} fill priority placeholder="blur" sizes="100vw" />
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={`eyebrow ${styles.eyebrow}`}>{eyebrow}</p>
          <h1 id="hero-title" className={styles.title}>
            {titleLines.map((line) => (
              <span key={line} className={styles.line}>
                <span>{line}</span>{" "}
              </span>
            ))}
            <span className={`${styles.line} ${styles.accent}`}>
              <span>{titleAccent}</span>
            </span>
          </h1>
        </div>

        <div className={styles.foot}>
          <div className={styles.pitch}>
            <p className={styles.lead}>{lead}</p>
            <div className={styles.actions}>
              <a className="button" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                {cta}
                <span className="visually-hidden"> pelo WhatsApp (abre em nova aba)</span>
                <ArrowIcon />
              </a>
              <a className={styles.more} href={secondary.href}>
                {secondary.label}
              </a>
            </div>
          </div>

          <dl className={styles.meta}>
            {meta.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
