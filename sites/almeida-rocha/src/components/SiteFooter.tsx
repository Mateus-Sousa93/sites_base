import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { LinkedInIcon, WhatsAppIcon } from "./icons";
import { Logo } from "./Logo";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <Logo tone="light" />
        <p className={styles.address}>
          {site.address.street}, {site.address.district}, {site.address.city} – {site.address.state}
        </p>
        <div className={styles.social}>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (abre em nova aba)">
            <LinkedInIcon />
          </a>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp (abre em nova aba)">
            <WhatsAppIcon />
          </a>
        </div>
      </div>
      <div className={`container ${styles.legal}`}>
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        {site.demo ? <p>Projeto demonstrativo: escritório, CRC, preços, contatos e depoimentos são fictícios.</p> : null}
      </div>
    </footer>
  );
}
