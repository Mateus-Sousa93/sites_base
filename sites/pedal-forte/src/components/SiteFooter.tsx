import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { InstagramIcon, WhatsAppIcon } from "./icons";
import { Logo } from "./Logo";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <Logo />
        <p className={styles.address}>
          {site.address.street}, {site.address.district}, {site.address.city} – {site.address.state}
        </p>
        <div className={styles.social}>
          <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram (abre em nova aba)">
            <InstagramIcon />
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
        {site.demo ? <p>Projeto demonstrativo: marca, produtos, preços, contatos e depoimentos são fictícios.</p> : null}
      </div>
    </footer>
  );
}
