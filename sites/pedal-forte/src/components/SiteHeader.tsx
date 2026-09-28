import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./icons";
import styles from "./SiteHeader.module.css";

const links = [
  { href: "#bikes", label: "Bikes" },
  { href: "#eletricas", label: "Elétricas" },
  { href: "#loja", label: "Mais vendidos" },
  { href: "#oficina", label: "Oficina" },
  { href: "#pedal", label: "Pedal de sábado" },
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
        <a className={styles.cta} href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon />
          <span>WhatsApp</span>
          <span className="visually-hidden"> (abre em nova aba)</span>
        </a>
      </div>
    </header>
  );
}
