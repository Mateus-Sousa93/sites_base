import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { WhatsAppIcon } from "./icons";
import styles from "./FinalCta.module.css";

export function FinalCta() {
  const { title, text, cta } = site.finalCta;

  return (
    <section className={styles.section} aria-labelledby="cta-title">
      <div className={`container ${styles.inner}`}>
        <h2 id="cta-title" className={styles.title}>
          {title}
        </h2>
        <div className={styles.side}>
          <p className={styles.text}>{text}</p>
          <a
            className="button button--on-dark"
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon />
            {cta}
          </a>
        </div>
      </div>
    </section>
  );
}
