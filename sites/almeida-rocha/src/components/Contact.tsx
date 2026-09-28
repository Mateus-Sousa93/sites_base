import Image from "next/image";
import { fullAddress, site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { PinIcon, WhatsAppIcon } from "./icons";
import styles from "./Contact.module.css";

export function Contact() {
  const { title, text, photo, crc } = site.finalCta;
  const query = encodeURIComponent(fullAddress);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const embedUrl = `https://maps.google.com/maps?q=${query}&z=16&output=embed`;

  return (
    <section className={`screen ${styles.section}`} id="contato" aria-labelledby="cta-title">
      <div className={styles.cta}>
        <Image src={photo.src} alt="" fill placeholder="blur" sizes="100vw" className={styles.ctaBg} />
        <div className={styles.ctaShade} aria-hidden="true" />
        <div className={`container ${styles.ctaInner}`}>
          <h2 id="cta-title" className={styles.ctaTitle}>
            {title}
          </h2>
          <div className={styles.ctaSide}>
            <p>{text}</p>
            <a className="button" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              Agendar conversa
              <span className="visually-hidden"> pelo WhatsApp (abre em nova aba)</span>
            </a>
          </div>
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.details}>
          <h3 className={styles.detailsTitle}>Escritório</h3>
          <address className={styles.address}>
            <PinIcon />
            <span>
              {site.address.street}
              <br />
              {site.address.district}, {site.address.city} – {site.address.state}, CEP {site.address.postalCode}
            </span>
          </address>
          <ul className={styles.hours}>
            {site.hours.map((h) => (
              <li key={h.days}>
                <span>{h.days}</span>
                <span>{h.hours}</span>
              </li>
            ))}
          </ul>
          <p className={styles.crc}>{crc}</p>
          <div className={styles.links}>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              Como chegar
              <span className="visually-hidden"> pelo Google Maps (abre em nova aba)</span>
            </a>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              {site.whatsapp.display}
              <span className="visually-hidden"> no WhatsApp (abre em nova aba)</span>
            </a>
          </div>
        </div>
        <iframe
          className={styles.map}
          title={`Mapa com a localização do escritório ${site.shortName}`}
          src={embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
