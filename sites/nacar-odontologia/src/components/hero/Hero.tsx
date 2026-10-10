import { Fragment } from "react";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { ArrowIcon } from "../icons";
import styles from "./Hero.module.css";

export function Hero() {
  const { titleLines, titleAccent, lead, cta, caption, trust } = site.hero;

  return (
    <section id="topo" data-theme="ink" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.stage}>
        <div className={`container ${styles.layout}`}>
          <div className={styles.copy}>
            {/* Cada linha é um bloco; o espaço entre elas mantém a frase inteira no texto do DOM. */}
            <h1 id="hero-title" className={styles.title}>
              {titleLines.map((line) => (
                <Fragment key={line}>
                  <span className={styles.line}>{line}</span>{" "}
                </Fragment>
              ))}
              <em className={`${styles.line} ${styles.accent}`}>{titleAccent}</em>
            </h1>
            <p className={styles.lead}>{lead}</p>
            <a className={`button ${styles.cta}`} href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              {cta}
              <span className="visually-hidden"> pelo WhatsApp (abre em nova aba)</span>
              <ArrowIcon />
            </a>
          </div>

          {/* Lugar do objeto do hero: à direita no desktop, acima do título no celular.
              Por enquanto é ocupado pela lente desenhada em CSS. */}
          <div className={styles.object} aria-hidden="true">
            <div className={styles.lensFallback} data-lens-fallback />
            <p className={styles.caption}>{caption}</p>
          </div>

          <dl className={styles.trust}>
            {trust.map((item) => (
              <div key={item.label} className={styles.trustItem}>
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
