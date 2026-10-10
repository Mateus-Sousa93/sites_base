import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const { tagline, note } = site.footer;

  return (
    <footer data-theme="ink" className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <p className={styles.tagline}>{tagline}</p>
        <nav aria-label="Rodapé">
          <ul className={styles.links}>
            {site.nav.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.contact}>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            WhatsApp {site.whatsapp.display}
            <span className="visually-hidden"> (abre em nova aba)</span>
          </a>
          <p>
            {site.address.street}
            <br />
            {site.address.district}, {site.address.city} – {site.address.state}
          </p>
        </div>
      </div>

      <p className={styles.wordmark} aria-hidden="true">
        {site.brand.mark}
      </p>

      <div className={`container ${styles.bottom}`}>
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        {site.demo && <p className={styles.note}>{note}</p>}
      </div>
    </footer>
  );
}
