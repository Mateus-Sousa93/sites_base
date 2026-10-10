import { Fragment, type CSSProperties } from "react";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { ArrowIcon } from "../icons";
import styles from "./Hero.module.css";

// Posição do elemento na entrada escalonada (ver "Entrada" no CSS).
const order = (index: number) => ({ "--i": index }) as CSSProperties;

export function Hero() {
  const { titleLines, titleAccent, lead, cta, caption, trust } = site.hero;

  return (
    <section id="topo" data-theme="ink" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.stage}>
        <div className={`container ${styles.layout}`}>
          <div className={styles.copy}>
            {/* Cada linha é um bloco com o texto num bloco interno: o de fora é a
                máscara, o de dentro sobe na entrada. O espaço entre as linhas
                mantém a frase inteira no texto do DOM. */}
            <h1 id="hero-title" className={styles.title}>
              {titleLines.map((line, index) => (
                <Fragment key={line}>
                  <span className={styles.line}>
                    <span className={styles.lineText} style={order(index)}>
                      {line}
                    </span>
                  </span>{" "}
                </Fragment>
              ))}
              <span className={styles.line}>
                <em className={`${styles.lineText} ${styles.accent}`} style={order(titleLines.length)}>
                  {titleAccent}
                </em>
              </span>
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
            {trust.map((item, index) => (
              <div key={item.label} className={styles.trustItem} style={order(index)}>
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
