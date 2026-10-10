"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { WhatsAppIcon } from "./icons";
import styles from "./MobileBookingBar.module.css";

// Barra fixa só no celular: aparece depois que o hero sai da tela e some quando
// a seção de agendamento já está visível, para não duplicar o botão.
export function MobileBookingBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("topo");
    const booking = document.getElementById("agendar");
    if (!hero) return;

    let heroVisible = true;
    let bookingVisible = false;

    // O hero só conta como fora da tela quando some atrás do cabeçalho fixo.
    const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === hero) heroVisible = entry.isIntersecting;
          if (entry.target === booking) bookingVisible = entry.isIntersecting;
        }
        setVisible(!heroVisible && !bookingVisible);
      },
      { rootMargin: `-${headerHeight}px 0px 0px 0px` },
    );

    observer.observe(hero);
    if (booking) observer.observe(booking);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`${styles.bar} ${visible ? styles.visible : ""}`} inert={!visible}>
      <a className="button" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon />
        {site.hero.cta}
        <span className="visually-hidden"> pelo WhatsApp (abre em nova aba)</span>
      </a>
    </div>
  );
}
