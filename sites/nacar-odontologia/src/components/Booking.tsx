"use client";

import { useState } from "react";
import { fullAddress, site, type Choice } from "@/content/site";
import { bookingMessage } from "@/lib/booking";
import { whatsappUrl } from "@/lib/format";
import { Reveal } from "@/motion/Reveal";
import { WhatsAppIcon } from "./icons";
import styles from "./Booking.module.css";

type GroupProps = {
  legend: string;
  options: Choice[];
  value: string | null;
  onChange: (id: string | null) => void;
};

// Grupo de escolha única. Clicar de novo na opção marcada desmarca.
function ChoiceGroup({ legend, options, value, onChange }: GroupProps) {
  return (
    <fieldset className={styles.group}>
      <legend>{legend}</legend>
      <div className={styles.options}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={styles.option}
            aria-pressed={value === option.id}
            onClick={() => onChange(value === option.id ? null : option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

// Agendamento: as escolhas montam a mensagem do WhatsApp. Ao lado, endereço,
// horários e mapa.
export function Booking() {
  const { label, title, titleAccent, lead, goalsLabel, goals, periodsLabel, periods, cta, visitTitle, mapsLabel } =
    site.booking;
  const [goal, setGoal] = useState<string | null>(null);
  const [period, setPeriod] = useState<string | null>(null);

  const query = encodeURIComponent(fullAddress);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const embedUrl = `https://maps.google.com/maps?q=${query}&z=15&output=embed`;

  return (
    <section id="agendar" data-theme="pearl" className="screen" aria-labelledby="agendar-title">
      <div className={`container ${styles.grid}`}>
        <div>
          <Reveal className={styles.head}>
            <p className="eyebrow">{label}</p>
            <h2 id="agendar-title" className="section-title">
              {title} <em>{titleAccent}</em>
            </h2>
            <p className="section-lead">{lead}</p>
          </Reveal>

          <Reveal delay={120} className={styles.choices}>
            <ChoiceGroup legend={goalsLabel} options={goals} value={goal} onChange={setGoal} />
            <ChoiceGroup legend={periodsLabel} options={periods} value={period} onChange={setPeriod} />
            <a
              className={`button ${styles.cta}`}
              href={whatsappUrl(bookingMessage(goal, period))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon />
              {cta}
              <span className="visually-hidden"> (abre em nova aba)</span>
            </a>
          </Reveal>
        </div>

        <Reveal delay={200} className={styles.visit}>
          <div className={styles.info}>
            <h3>{visitTitle}</h3>
            <address>
              {site.address.street}
              <br />
              {site.address.district}, {site.address.city} – {site.address.state}
              <br />
              CEP {site.address.postalCode}
            </address>
            <ul className={styles.hours}>
              {site.hours.map((entry) => (
                <li key={entry.days}>
                  <span>{entry.days}</span>
                  <span>{entry.hours}</span>
                </li>
              ))}
            </ul>
            <div className={styles.links}>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                {mapsLabel}
                <span className="visually-hidden"> pelo Google Maps (abre em nova aba)</span>
              </a>
              <a href={`tel:+${site.whatsapp.number}`}>{site.whatsapp.display}</a>
            </div>
          </div>
          <iframe
            className={styles.map}
            title={`Mapa com a localização da ${site.name}`}
            src={embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </div>
    </section>
  );
}
