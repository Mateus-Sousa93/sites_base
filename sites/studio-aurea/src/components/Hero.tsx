import Image from "next/image";
import { site } from "@/content/site";
import { formatPrice, whatsappUrl } from "@/lib/format";
import { CheckIcon, WhatsAppIcon } from "./icons";
import styles from "./Hero.module.css";

export function Hero() {
  const { title, lead, cta, photo, highlight, trust } = site.hero;

  return (
    <section className={`screen screen-mobile ${styles.hero}`} id="topo" aria-labelledby="hero-title">
      <div className={styles.grid}>
        <div className={styles.copy}>
          <h1 id="hero-title" className={styles.title}>
            {title.map((line, index) => (
              <span className={styles.line} key={line}>
                <span className={styles.lineInner} style={{ animationDelay: `${120 + index * 90}ms` }}>
                  {line}
                </span>{" "}
              </span>
            ))}
          </h1>
          <p className={styles.lead}>{lead}</p>
          <div className={styles.actions}>
            <a className="button" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              {cta}
            </a>
            <a className="text-link" href="#descubra">
              Descobrir meu tratamento
            </a>
          </div>
          <ul className={styles.trust}>
            {trust.map((item) => (
              <li key={item}>
                <CheckIcon />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.media}>
          <div className={`photo-cover ${styles.photo}`}>
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              priority
              placeholder="blur"
              sizes="(max-width: 899px) 100vw, 46vw"
            />
          </div>
          <a className={styles.chip} href="#tratamentos">
            <span className={styles.chipLabel}>{highlight.label}</span>
            <span className={styles.chipMeta}>{highlight.minutes} min, a partir de</span>
            <span className={styles.chipPrice}>{formatPrice(highlight.from)}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
