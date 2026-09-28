import Image from "next/image";
import { site } from "@/content/site";
import { formatPrice, whatsappUrl } from "@/lib/format";
import styles from "./Workshop.module.css";

export function Workshop() {
  const { title, text, photo, detail, services, cta } = site.workshop;

  return (
    <section className={`screen ${styles.section}`} id="oficina" aria-labelledby="oficina-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.body}>
          <h2 id="oficina-title" className={styles.title}>
            {title}
          </h2>
          <p className={styles.text}>{text}</p>
          <ul className={styles.list}>
            {services.map((s) => (
              <li key={s.name} className={styles.item}>
                <div>
                  <p className={styles.name}>{s.name}</p>
                  <p className={styles.detail}>{s.detail}</p>
                </div>
                <p className={styles.price}>{formatPrice(s.price)}</p>
              </li>
            ))}
          </ul>
          <a
            className={`button button--ghost ${styles.cta}`}
            href={whatsappUrl(`${site.whatsapp.greeting}\nQuero agendar uma revisão na oficina.`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {cta}
            <span className="visually-hidden"> pelo WhatsApp (abre em nova aba)</span>
          </a>
        </div>
        <div className={styles.media}>
          <div className={`photo-cover ${styles.photo}`}>
            <Image src={photo.src} alt={photo.alt} fill placeholder="blur" sizes="(max-width: 899px) 100vw, 45vw" />
          </div>
          <div className={`photo-cover ${styles.detailPhoto}`}>
            <Image src={detail.src} alt={detail.alt} fill placeholder="blur" sizes="240px" />
          </div>
          <p className={styles.badge}>
            <span>48h</span>
            prazo de entrega
          </p>
        </div>
      </div>
    </section>
  );
}
