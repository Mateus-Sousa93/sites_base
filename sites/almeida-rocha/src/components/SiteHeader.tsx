import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./icons";
import styles from "./SiteHeader.module.css";

const links = [
  { href: "#servicos", label: "Serviços" },
  { href: "#plano", label: "Planos" },
  { href: "#segmentos", label: "Quem atendemos" },
  { href: "#migracao", label: "Trocar de contador" },
  { href: "#contato", label: "Contato" },
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
        <a className={`button button--ink ${styles.cta}`} href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon />
          <span className={styles.ctaLabel}>Fale conosco</span>
          <span className="visually-hidden"> pelo WhatsApp (abre em nova aba)</span>
        </a>
      </div>
    </header>
  );
}
