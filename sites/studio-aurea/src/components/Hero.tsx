import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { AssessmentCard } from "./AssessmentCard";
import { WhatsAppIcon } from "./icons";
import styles from "./Hero.module.css";

export function Hero() {
  const { title, lead, cta } = site.hero;

  return (
    <section className={styles.hero} id="topo" aria-labelledby="hero-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <h1 id="hero-title" className={styles.title}>
            {title.map((line, index) => (
              <span className={styles.line} key={line}>
                <span className={styles.lineInner} style={{ animationDelay: `${index * 90}ms` }}>
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
            <a className="text-link" href="#tratamentos">
              Ver tratamentos e valores
            </a>
          </div>
        </div>
        <div className={styles.card}>
          <AssessmentCard />
        </div>
      </div>
    </section>
  );
}
