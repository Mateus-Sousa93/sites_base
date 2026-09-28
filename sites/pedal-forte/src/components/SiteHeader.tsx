"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { formatPrice, whatsappUrl } from "@/lib/format";
import { Logo } from "./Logo";
import { CloseIcon, MenuIcon, WhatsAppIcon } from "./icons";
import styles from "./SiteHeader.module.css";

const links = [
  { href: "#bikes", label: "Bikes", hint: `${site.categories.items.length} linhas` },
  { href: "#eletricas", label: "Elétricas", hint: `a partir de ${formatPrice(site.ebike.from)}` },
  { href: "#loja", label: "Mais vendidos", hint: `${site.products.items.length} produtos` },
  { href: "#oficina", label: "Oficina", hint: "pronta em 48h" },
  { href: "#pedal", label: "Pedal de sábado", hint: site.community.facts[1].value },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 960) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`${styles.header} ${open ? styles.isOpen : ""}`}>
      <div className={`container ${styles.inner}`}>
        <a href="#topo" className={styles.brand} aria-label={`${site.name}, voltar ao início`} onClick={() => setOpen(false)}>
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
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
          <span className="visually-hidden">{open ? "Fechar menu" : "Abrir menu"}</span>
        </button>
      </div>

      <div id="menu-mobile" className={styles.menu} inert={!open}>
        <nav aria-label="Seções">
          <ul className={styles.menuList}>
            {links.map((link, index) => (
              <li key={link.href} style={{ transitionDelay: open ? `${80 + index * 45}ms` : "0ms" }}>
                <a href={link.href} onClick={() => setOpen(false)}>
                  <span className={styles.menuLabel}>{link.label}</span>
                  <span className={styles.menuHint}>{link.hint}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.menuFoot}>
          <p className={styles.menuInfo}>
            {site.address.street}, {site.address.district}
            <br />
            {site.hours.map((h) => `${h.days}, ${h.hours}`).join(" · ")}
          </p>
          <a className="button button--whatsapp" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            Chamar no WhatsApp
            <span className="visually-hidden"> (abre em nova aba)</span>
          </a>
        </div>
      </div>
    </header>
  );
}
