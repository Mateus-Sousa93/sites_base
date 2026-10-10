"use client";

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { ArrowIcon, WhatsAppIcon } from "./icons";
import styles from "./SiteHeader.module.css";

// Largura a partir da qual a navegação cabe na barra (a mesma do CSS).
const DESKTOP_QUERY = "(min-width: 900px)";

type Theme = "ink" | "pearl";

// Duração da troca de tema da barra, em milissegundos. O CSS a recebe em --swap.
const THEME_SWAP = 320;

// O que há sob a barra:
// - theme: o tema da seção que cruza a borda de baixo dela. Quando uma seção
//   encosta na barra, a barra já assume as cores dela;
// - crossing: a barra ainda cobre o fim da seção anterior, de outro tema;
// - swapping: a troca de cores está em andamento.
// Não é movimento: vale também com movimento reduzido.
function useThemeUnder(headerRef: RefObject<HTMLElement | null>) {
  const [under, setUnder] = useState({ theme: "ink" as Theme, crossing: false, swapping: false });

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let frame = 0;
    let swapTimer = 0;
    let shown: Theme = "ink";

    const read = () => {
      frame = 0;
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-theme]"), (section) => {
        const { top, bottom } = section.getBoundingClientRect();
        return { theme: section.dataset.theme === "pearl" ? "pearl" : "ink", top, bottom } as const;
      });
      // A última que contém a linha: numa seção dentro de outra, vale a de dentro.
      const themeAt = (y: number) => {
        let theme: Theme | undefined;
        for (const section of sections) if (section.top <= y && section.bottom > y) theme = section.theme;
        return theme;
      };

      const theme = themeAt(header.getBoundingClientRect().bottom + 1);
      if (!theme) return;
      const crossing = (themeAt(1) ?? theme) !== theme;
      const swapped = theme !== shown;
      shown = theme;

      setUnder((prev) =>
        prev.theme === theme && prev.crossing === crossing
          ? prev
          : { theme, crossing, swapping: prev.swapping || swapped },
      );
      if (swapped) {
        window.clearTimeout(swapTimer);
        swapTimer = window.setTimeout(() => setUnder((prev) => ({ ...prev, swapping: false })), THEME_SWAP + 60);
      }
    };

    // No máximo uma leitura por quadro, seja qual for a origem da mudança.
    const schedule = () => {
      frame ||= requestAnimationFrame(read);
    };

    // Uma seção pode trocar de tema sem a página rolar (a virada do hero).
    const themes = new MutationObserver(schedule);
    themes.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      themes.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      window.clearTimeout(swapTimer);
    };
  }, [headerRef]);

  return under;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { theme, crossing, swapping } = useThemeUnder(headerRef);

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
    // O menu aberto cobre a página e é sempre escuro; a barra o acompanha.
    <header
      ref={headerRef}
      className={`${styles.header} ${open ? styles.isOpen : ""}`}
      data-header-theme={open ? "ink" : theme}
      data-header-crossing={crossing && !open ? "" : undefined}
      data-header-swapping={swapping ? "" : undefined}
      style={{ "--swap": `${THEME_SWAP}ms` } as CSSProperties}
    >
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
