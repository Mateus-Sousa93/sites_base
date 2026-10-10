"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { ArrowIcon, WhatsAppIcon } from "./icons";
import styles from "./SiteHeader.module.css";

// Largura a partir da qual a navegação cabe na barra (a mesma do CSS).
const DESKTOP_QUERY = "(min-width: 900px)";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const header = headerRef.current;
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const close = () => setOpen(false);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !header) return;

      // Com o menu aberto, o foco circula só entre a barra e o menu.
      const focusable = Array.from(header.querySelectorAll<HTMLElement>("a[href], button")).filter(
        (el) => el.getClientRects().length > 0,
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (!header.contains(active) || (!event.shiftKey && active === last)) {
        event.preventDefault();
        first?.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last?.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", close);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", close);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header ref={headerRef} className={`${styles.header} ${open ? styles.isOpen : ""}`}>
      <div className={`container ${styles.bar}`}>
        <a
          href="#topo"
          className={styles.brand}
          aria-label={`${site.name}, voltar ao início`}
          onClick={() => setOpen(false)}
        >
          <span className={styles.mark}>{site.brand.mark}</span>
          <span className={styles.descriptor}>{site.brand.descriptor}</span>
        </a>

        <nav aria-label="Seções" className={styles.nav}>
          <ul>
            {site.nav.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a
            className={`button button--ghost ${styles.cta}`}
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            {site.header.cta}
            <span className="visually-hidden"> pelo WhatsApp (abre em nova aba)</span>
            <ArrowIcon />
          </a>
          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((value) => !value)}
          >
            <span className={styles.toggleIcon} aria-hidden="true" />
            <span className="visually-hidden">{open ? "Fechar menu" : "Abrir menu"}</span>
          </button>
        </div>
      </div>

      <div id="menu-mobile" className={styles.menu} inert={!open}>
        <nav aria-label="Menu">
          <ol className={styles.menuList}>
            {site.nav.map((link, index) => (
              <li key={link.href} style={{ transitionDelay: open ? `${90 + index * 45}ms` : "0ms" }}>
                <a href={link.href} onClick={() => setOpen(false)}>
                  <span className={styles.menuIndex} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.menuLabel}>{link.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className={styles.menuFoot}>
          <p className={styles.menuInfo}>
            {site.address.street}, {site.address.district}
            <br />
            {site.hours.map((h) => `${h.days}, ${h.hours}`).join(" · ")}
          </p>
          <a className="button" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            {site.hero.cta}
            <span className="visually-hidden"> pelo WhatsApp (abre em nova aba)</span>
          </a>
        </div>
      </div>
    </header>
  );
}
