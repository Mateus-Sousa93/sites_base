"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { site, treatmentById, type Concern, type Treatment } from "@/content/site";
import { formatPrice, whatsappUrl } from "@/lib/format";
import { ChevronIcon, WhatsAppIcon } from "./icons";
import styles from "./Quiz.module.css";

const list = new Intl.ListFormat("pt-BR", { style: "long", type: "conjunction" });
const TOTAL_QUESTIONS = 3;

type Suggestion = { primary: Treatment; next: Treatment | null };

// O tratamento indicado pela maioria das queixas vem primeiro; em empate,
// vale a ordem em que a pessoa marcou.
function suggest(concerns: Concern[]): Suggestion {
  const counts = new Map<Treatment["id"], number>();
  for (const c of concerns) counts.set(c.treatment, (counts.get(c.treatment) ?? 0) + 1);
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id);
  return {
    primary: treatmentById(ranked[0] ?? "limpeza"),
    next: ranked[1] ? treatmentById(ranked[1]) : null,
  };
}

export function Quiz() {
  const { title, intro, photo, skinTypes, concerns, periods, sensitiveNote, disclaimer } = site.quiz;
  const [step, setStep] = useState(0);
  const [skin, setSkin] = useState<string | null>(null);
  const [picked, setPicked] = useState<Concern[]>([]);
  const [period, setPeriod] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const id = useId();

  // Leva o foco para a pergunta nova, para quem navega por teclado ou leitor de tela.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const done = step >= TOTAL_QUESTIONS;
  const suggestion = done ? suggest(picked) : null;

  function toggleConcern(concern: Concern) {
    setPicked((current) =>
      current.some((c) => c.label === concern.label)
        ? current.filter((c) => c.label !== concern.label)
        : [...current, concern],
    );
  }

  function restart() {
    setSkin(null);
    setPicked([]);
    setPeriod(null);
    setStep(0);
  }

  function message(s: Suggestion): string {
    const lines = [site.whatsapp.greeting];
    if (skin) lines.push(`Minha pele: ${skin.toLowerCase()}.`);
    if (picked.length) lines.push(`O que me incomoda: ${list.format(picked.map((c) => c.label.toLowerCase()))}.`);
    if (period) lines.push(`Melhor período: ${period.toLowerCase()}.`);
    lines.push(`O site sugeriu começar por: ${s.primary.name.toLowerCase()}.`);
    return lines.join("\n");
  }

  const questions = [
    {
      title: "Como você descreveria a sua pele?",
      body: (
        <div className={styles.options}>
          {skinTypes.map((option) => (
            <button
              key={option}
              type="button"
              className={styles.option}
              aria-pressed={skin === option}
              onClick={() => {
                setSkin(option);
                setStep(1);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "O que mais incomoda hoje?",
      hint: "Pode marcar mais de um.",
      body: (
        <>
          <div className={styles.options}>
            {concerns.map((concern) => (
              <button
                key={concern.label}
                type="button"
                className={styles.option}
                aria-pressed={picked.some((c) => c.label === concern.label)}
                onClick={() => toggleConcern(concern)}
              >
                {concern.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className={`button button--on-dark ${styles.next}`}
            disabled={picked.length === 0}
            onClick={() => setStep(2)}
          >
            Continuar
          </button>
        </>
      ),
    },
    {
      title: "Qual período é melhor para você?",
      body: (
        <div className={styles.options}>
          {periods.map((option) => (
            <button
              key={option}
              type="button"
              className={styles.option}
              aria-pressed={period === option}
              onClick={() => {
                setPeriod(option);
                setStep(3);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section className={`screen screen-mobile ${styles.section}`} id="descubra" aria-labelledby={`${id}-title`}>
      <div className={styles.grid}>
        <div className={`photo-cover ${styles.photo}`}>
          <Image src={photo.src} alt={photo.alt} fill placeholder="blur" sizes="(max-width: 899px) 100vw, 40vw" />
        </div>

        <div className={styles.body}>
          <h2 id={`${id}-title`} className={styles.title}>
            {title}
          </h2>
          <p className={styles.intro}>{intro}</p>

          <div className={styles.progress} aria-hidden="true">
            <span style={{ width: `${(Math.min(step, TOTAL_QUESTIONS) / TOTAL_QUESTIONS) * 100}%` }} />
          </div>

          <div className={styles.stage} aria-live="polite">
            {!done ? (
              <div className={styles.question} key={step}>
                <p className={styles.counter}>
                  Pergunta {step + 1} de {TOTAL_QUESTIONS}
                </p>
                <h3 ref={headingRef} tabIndex={-1} className={styles.questionTitle}>
                  {questions[step].title}
                </h3>
                {questions[step].hint ? <p className={styles.hint}>{questions[step].hint}</p> : null}
                {questions[step].body}
                {step > 0 ? (
                  <button type="button" className={styles.back} onClick={() => setStep(step - 1)}>
                    <ChevronIcon direction="left" />
                    Voltar
                  </button>
                ) : null}
              </div>
            ) : suggestion ? (
              <div className={styles.question} key="result">
                <p className={styles.counter}>Por onde começar</p>
                <h3 ref={headingRef} tabIndex={-1} className={styles.resultName}>
                  {suggestion.primary.name}
                </h3>
                <p className={styles.resultMeta}>
                  {suggestion.primary.minutes} minutos, {formatPrice(suggestion.primary.price)} por sessão
                </p>
                <p className={styles.resultText}>
                  Indicado para {suggestion.primary.indication.charAt(0).toLowerCase()}
                  {suggestion.primary.indication.slice(1)}
                  {suggestion.next ? ` Depois, podemos seguir com ${suggestion.next.name.toLowerCase()}.` : ""}
                </p>
                {skin === "Sensível" ? <p className={styles.resultText}>{sensitiveNote}</p> : null}
                <div className={styles.resultActions}>
                  <a
                    className="button button--on-dark"
                    href={whatsappUrl(message(suggestion))}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon />
                    Enviar pelo WhatsApp
                  </a>
                  <button type="button" className={styles.restart} onClick={restart}>
                    Refazer
                  </button>
                </div>
                <p className={styles.disclaimer}>{disclaimer}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
