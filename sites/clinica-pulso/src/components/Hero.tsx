"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { PauseIcon, PlayIcon, WhatsAppIcon } from "./icons";
import styles from "./Hero.module.css";

const dayNames: Record<string, string> = {
  Seg: "segunda",
  Ter: "terça",
  Qua: "quarta",
  Qui: "quinta",
  Sex: "sexta",
};

export function Hero() {
  const { video, title, lead, trust } = site.hero;
  const specialties = site.specialties.items;
  const [specialtyId, setSpecialtyId] = useState(specialties[1].id);
  const [slotIndex, setSlotIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const specialty = specialties.find((s) => s.id === specialtyId) ?? specialties[0];
  const slot = slotIndex === null ? null : specialty.slots[slotIndex];

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.pause();
      setPlaying(false);
      return;
    }
    el.play().catch(() => setPlaying(false));
  }, []);

  function toggleVideo() {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  const message = slot
    ? `${site.whatsapp.greeting}\nQuero agendar ${specialty.name.toLowerCase()} com ${specialty.doctor} na ${dayNames[slot.day]} às ${slot.time}.`
    : `${site.whatsapp.greeting}\nQuero agendar uma consulta de ${specialty.name.toLowerCase()}.`;

  return (
    <section className={`screen screen-mobile ${styles.hero}`} id="topo" aria-labelledby="hero-title">
      <div className={styles.grid}>
        <div className={styles.copy}>
          <h1 id="hero-title" className={styles.title}>
            {title}
          </h1>
          <p className={styles.lead}>{lead}</p>
          <dl className={styles.trust}>
            {trust.map((t) => (
              <div key={t.label}>
                <dt>{t.label}</dt>
                <dd>{t.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={styles.media}>
          <div className={styles.videoWrap}>
            <video
              ref={videoRef}
              className={styles.video}
              src={video.src}
              poster={video.poster}
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
            />
            <button
              type="button"
              className={styles.toggle}
              onClick={toggleVideo}
              aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
          </div>

          <div className={styles.booking} role="group" aria-labelledby="agenda-title">
            <p id="agenda-title" className={styles.bookingTitle}>
              Próximos horários
            </p>
            <label className={styles.selectLabel}>
              <span className="visually-hidden">Especialidade</span>
              <select
                className={styles.select}
                value={specialtyId}
                onChange={(e) => {
                  setSpecialtyId(e.target.value);
                  setSlotIndex(null);
                }}
              >
                {specialties.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <p className={styles.doctor}>com {specialty.doctor}</p>
            <div className={styles.slots} role="radiogroup" aria-label="Horários disponíveis">
              {specialty.slots.map((s, index) => (
                <button
                  key={`${s.day}-${s.time}`}
                  type="button"
                  role="radio"
                  aria-checked={slotIndex === index}
                  className={styles.slot}
                  onClick={() => setSlotIndex(index)}
                >
                  <span>{s.day}</span>
                  <strong>{s.time}</strong>
                </button>
              ))}
            </div>
            <a className={`button ${styles.bookingCta}`} href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              {slot ? `Agendar ${slot.day.toLowerCase()} às ${slot.time}` : "Agendar pelo WhatsApp"}
              <span className="visually-hidden"> (abre em nova aba)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
