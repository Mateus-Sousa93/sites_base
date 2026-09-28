"use client";

import { useEffect, useId, useRef, useState } from "react";
import { site } from "@/content/site";
import { formatPrice, whatsappUrl } from "@/lib/format";
import { WhatsAppIcon } from "./icons";
import styles from "./Simulator.module.css";

export function Simulator() {
  const { title, intro, video, regimes, perEmployee, maxEmployees, bpoPrice, includes, note } = site.simulator;
  const [regimeId, setRegimeId] = useState(regimes[1].id);
  const [employees, setEmployees] = useState(5);
  const [bpo, setBpo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const id = useId();

  const regime = regimes.find((r) => r.id === regimeId) ?? regimes[0];
  const isMei = regime.id === "mei";
  // MEI pode ter no máximo um funcionário.
  const staff = isMei ? Math.min(employees, 1) : employees;
  const total = regime.base + staff * perEmployee + (bpo ? bpoPrice : 0);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!el.src) el.src = video.src;
          el.play().catch(() => undefined);
        } else {
          el.pause();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [video.src]);

  const message = `${site.whatsapp.greeting}\nSimulei um plano no site:\nRegime: ${regime.label}\nFuncionários: ${staff}\nBPO financeiro: ${bpo ? "sim" : "não"}\nValor estimado: ${formatPrice(total)} por mês.`;

  return (
    <section className={`screen ${styles.section}`} id="plano" aria-labelledby={`${id}-title`}>
      <video ref={videoRef} className={styles.video} poster={video.poster} muted loop playsInline preload="none" aria-hidden="true" />
      <div className={styles.shade} aria-hidden="true" />

      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <h2 id={`${id}-title`} className={styles.title}>
            {title}
          </h2>
          <p className={styles.intro}>{intro}</p>
          <ul className={styles.includes}>
            {includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className={styles.card}>
          <fieldset className={styles.field}>
            <legend>Regime tributário</legend>
            <div className={styles.regimes}>
              {regimes.map((r) => (
                <label key={r.id} className={styles.regime}>
                  <input type="radio" name={`${id}-regime`} value={r.id} checked={r.id === regimeId} onChange={() => setRegimeId(r.id)} />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
            <p className={styles.hint}>{regime.hint}</p>
          </fieldset>

          <div className={styles.field}>
            <label htmlFor={`${id}-staff`} className={styles.label}>
              Funcionários <strong>{staff}</strong>
            </label>
            <input
              id={`${id}-staff`}
              className={styles.range}
              type="range"
              min={0}
              max={isMei ? 1 : maxEmployees}
              value={staff}
              onChange={(e) => setEmployees(Number(e.target.value))}
              style={{ "--fill": `${(staff / (isMei ? 1 : maxEmployees)) * 100}%` } as React.CSSProperties}
            />
          </div>

          <label className={styles.toggle}>
            <input type="checkbox" checked={bpo} onChange={(e) => setBpo(e.target.checked)} />
            <span className={styles.switch} aria-hidden="true" />
            <span>
              Incluir BPO financeiro <small>+ {formatPrice(bpoPrice)}</small>
            </span>
          </label>

          <div className={styles.total} aria-live="polite">
            <span className={styles.totalLabel}>Estimativa mensal</span>
            <span className={styles.totalValue}>{formatPrice(total)}</span>
          </div>

          <a className={`button ${styles.cta}`} href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            Receber proposta
            <span className="visually-hidden"> pelo WhatsApp (abre em nova aba)</span>
          </a>
          <p className={styles.note}>{note}</p>
        </div>
      </div>
    </section>
  );
}
