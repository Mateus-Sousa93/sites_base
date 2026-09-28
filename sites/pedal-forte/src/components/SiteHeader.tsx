"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { Logo } from "./Logo";
import { CloseIcon, MenuIcon, WhatsAppIcon } from "./icons";
import styles from "./SiteHeader.module.css";

const links = [
  { href: "#bikes", label: "Bikes" },
  { href: "#eletricas", label: "Elétricas" },
  { href: "#loja", label: "Mais vendidos" },
  { href: "#oficina", label: "Oficina" },
  { href: "#pedal", label: "Pedal de sábado" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

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
        <div className={styles.actions}>
          <a className={styles.cta} href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            <span>WhatsApp</span>
            <span className="visually-hidden"> (abre em nova aba)</span>
          </a>
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
      </div>

      <nav
        id="menu-mobile"
        aria-label="Seções (celular)"
        className={`${styles.mobileNav} ${open ? styles.mobileNavOpen : ""}`}
      >
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
