import Image from "next/image";
import { fullAddress, site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { PinIcon, WhatsAppIcon } from "./icons";
import styles from "./VisitCta.module.css";

export function VisitCta() {
  const { title, text } = site.visit;
  const cta = site.finalCta;
  const query = encodeURIComponent(fullAddress);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const embedUrl = `https://maps.google.com/maps?q=${query}&z=16&output=embed`;

  return (
    <section className={`screen ${styles.section}`} id="visite" aria-labelledby="visite-title">
      <div className={styles.mapArea}>
        <iframe
          className={styles.map}
          title={`Mapa com a localização do ${site.name}`}
          src={embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className={`container ${styles.cardWrap}`}>
          <div className={styles.card}>
            <h2 id="visite-title" className={styles.title}>
              {title}
            </h2>
            <p className={styles.text}>{text}</p>
            <address className={styles.address}>
              <PinIcon />
              <span>
                {site.address.street}
                <br />
                {site.address.district}, {site.address.city} – {site.address.state}
                <br />
                CEP {site.address.postalCode}
              </span>
            </address>
            <ul className={styles.hours}>
              {site.hours.map((h) => (
                <li key={h.days}>
                  <span>{h.days}</span>
                  <span>{h.hours}</span>
                </li>
              ))}
              <li>
                <span>Domingo e feriados</span>
                <span>Fechado</span>
              </li>
            </ul>
            <div className={styles.links}>
              <a className="text-link" href={mapsUrl} target="_blank" rel="noopener noreferrer">
                Como chegar
                <span className="visually-hidden"> pelo Google Maps (abre em nova aba)</span>
              </a>
              <a className="text-link" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                {site.whatsapp.display}
                <span className="visually-hidden"> no WhatsApp (abre em nova aba)</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.cta}>
        <Image src={cta.photo.src} alt="" fill placeholder="blur" sizes="100vw" className={styles.ctaPhoto} />
        <div className={`container ${styles.ctaInner}`}>
          <h2 id="cta-title" className={styles.ctaTitle}>
            {cta.title}
          </h2>
          <div className={styles.ctaSide}>
            <p>{cta.text}</p>
            <a className="button button--on-dark" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              {cta.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
