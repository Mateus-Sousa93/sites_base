import { site, fullAddress } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import styles from "./Visit.module.css";

export function Visit() {
  const { title, text } = site.visit;
  const query = encodeURIComponent(fullAddress);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const embedUrl = `https://maps.google.com/maps?q=${query}&z=16&output=embed`;

  return (
    <section className={styles.section} id="visite" aria-labelledby="visite-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.info}>
          <h2 id="visite-title" className={styles.title}>
            {title}
          </h2>
          <p className={styles.text}>{text}</p>

          <dl className={styles.details}>
            <div className={styles.row}>
              <dt>Endereço</dt>
              <dd>
                <address>
                  {site.address.street}
                  <br />
                  {site.address.district}, {site.address.city} – {site.address.state}
                  <br />
                  CEP {site.address.postalCode}
                </address>
                <a className="text-link" href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  Abrir no Google Maps
                  <span className="visually-hidden"> (abre em nova aba)</span>
                </a>
              </dd>
            </div>
            <div className={styles.row}>
              <dt>Horários</dt>
              <dd>
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
              </dd>
            </div>
            <div className={styles.row}>
              <dt>WhatsApp</dt>
              <dd>
                <a className="text-link" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                  {site.whatsapp.display}
                  <span className="visually-hidden"> (abre em nova aba)</span>
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className={styles.map}>
          <iframe
            title={`Mapa com a localização do ${site.name}`}
            src={embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
