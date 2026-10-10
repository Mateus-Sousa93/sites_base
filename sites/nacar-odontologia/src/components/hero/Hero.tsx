import Image from "next/image";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { WhatsAppIcon } from "../icons";
import styles from "./Hero.module.css";

export function Hero() {
  const { eyebrow, titleLines, titleAccent, lead, cta, secondary, photo, inset, rating, trust } = site.hero;

  return (
    <section id="topo" data-theme="pearl" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media}>
        <div className={styles.photo}>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority
            placeholder="blur"
            sizes="(max-width: 899px) 100vw, 50vw"
          />
        </div>
        <figure className={styles.inset}>
          <Image src={inset.src} alt={inset.alt} fill placeholder="blur" sizes="(max-width: 899px) 36vw, 16vw" />
        </figure>
        <p className={styles.rating}>
          <span className={styles.stars} aria-hidden="true">
            ★★★★★
          </span>
          <strong>{rating.value}</strong>
          <span>{rating.label}</span>
        </p>
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
          <p className={styles.lead}>{lead}</p>
          <div className={styles.actions}>
            <a className="button" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              {cta}
              <span className="visually-hidden"> pelo WhatsApp (abre em nova aba)</span>
            </a>
            <a className="button button--ghost" href={secondary.href}>
              {secondary.label}
            </a>
          </div>
        </div>

        <dl className={styles.trust}>
          {trust.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
