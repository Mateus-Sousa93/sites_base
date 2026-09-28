import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { Logotype } from "./Logotype";
import styles from "./SiteHeader.module.css";

const links = [
  { href: "#tratamentos", label: "Tratamentos" },
  { href: "#studio", label: "O studio" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#visite", label: "Como chegar" },
];

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href="#topo" className={styles.brand} aria-label={`${site.name}, voltar ao início`}>
          <Logotype />
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
          Agendar
          <span className="visually-hidden"> avaliação pelo WhatsApp (abre em nova aba)</span>
        </a>
      </div>
    </header>
  );
}
