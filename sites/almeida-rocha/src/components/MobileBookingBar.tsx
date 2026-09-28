"use client";

import { useEffect, useState } from "react";
import { whatsappUrl } from "@/lib/format";
import { WhatsAppIcon } from "./icons";
import styles from "./MobileBookingBar.module.css";

// Barra fixa só no celular: aparece depois que o topo sai da tela e some
// quando a chamada final já está visível, para não duplicar o botão.
export function MobileBookingBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("topo");
    const finalCta = document.getElementById("cta-title");
    if (!hero) return;

    let heroVisible = true;
    let ctaVisible = false;
    const update = () => setVisible(!heroVisible && !ctaVisible);

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        if (entry.target === finalCta) ctaVisible = entry.isIntersecting;
      }
      update();
    });

    observer.observe(hero);
    if (finalCta) observer.observe(finalCta);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`${styles.bar} ${visible ? styles.visible : ""}`} aria-hidden={!visible}>
      <a
        className="button"
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={visible ? 0 : -1}
      >
        <WhatsAppIcon />
        Falar com um contador
      </a>
    </div>
  );
}
