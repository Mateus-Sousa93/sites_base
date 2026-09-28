import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./icons";
import styles from "./SiteHeader.module.css";

const links = [
  { href: "#especialidades", label: "Especialidades" },
  { href: "#exames", label: "Exames" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#corpo-clinico", label: "Corpo clínico" },
  { href: "#localizacao", label: "Localização" },
];

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href="#topo" className={styles.brand} aria-label={`${site.name}, voltar ao início`}>
          <Logo />
        </a>
        <nav aria-label="Seções" className={styles.nav}>
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a className={`button ${styles.cta}`} href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon />
          Agendar
          <span className="visually-hidden"> consulta pelo WhatsApp (abre em nova aba)</span>
        </a>
      </div>
    </header>
  );
}
