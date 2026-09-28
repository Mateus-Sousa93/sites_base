import Image from "next/image";
import { site } from "@/content/site";
import { formatPrice, installment, pixPrice, whatsappUrl } from "@/lib/format";
import styles from "./Ebike.module.css";

export function Ebike() {
  const { title, text, photo, specs, from, cta } = site.ebike;

  return (
    <section className={`screen ${styles.section}`} id="eletricas" aria-labelledby="eletricas-title">
      <div className={styles.grid}>
        <div className={`photo-cover ${styles.photo}`}>
          <Image src={photo.src} alt={photo.alt} fill placeholder="blur" sizes="(max-width: 899px) 100vw, 55vw" />
        </div>
        <div className={styles.body}>
          <h2 id="eletricas-title" className={styles.title}>
            {title.map((line) => (
              <span key={line}>{line} </span>
            ))}
          </h2>
          <p className={styles.text}>{text}</p>

          <dl className={styles.specs}>
            {specs.map((spec) => (
              <div key={spec.label} className={styles.spec}>
                <dt>{spec.label}</dt>
                <dd>
                  {spec.value}
                  <span>{spec.unit}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className={styles.buy}>
            <div className={styles.price}>
              <span className={styles.from}>A partir de</span>
              <span className={styles.value}>{formatPrice(from)}</span>
              <span className={styles.terms}>
                {installment(from)} sem juros ou {pixPrice(from)} no PIX
              </span>
            </div>
            <a
              className="button button--ghost"
              href={whatsappUrl(`${site.whatsapp.greeting}\nQuero agendar um test ride de bike elétrica.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {cta}
              <span className="visually-hidden"> pelo WhatsApp (abre em nova aba)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
