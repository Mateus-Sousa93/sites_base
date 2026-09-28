"use client";

import { useId, useMemo, useState } from "react";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import { WhatsAppIcon } from "./icons";
import styles from "./AssessmentCard.module.css";

const list = new Intl.ListFormat("pt-BR", { style: "long", type: "conjunction" });

function buildMessage(skin: string | null, concerns: string[], period: string | null): string {
  const lines: string[] = [site.whatsapp.greeting];
  if (skin) lines.push(`Minha pele: ${skin.toLowerCase()}.`);
  if (concerns.length > 0) {
    lines.push(`O que mais me incomoda: ${list.format(concerns.map((c) => c.toLowerCase()))}.`);
  }
  if (period) lines.push(`Melhor período para mim: ${period.toLowerCase()}.`);
  return lines.join("\n");
}

export function AssessmentCard() {
  const { title, intro, skinTypes, concerns, periods, submit, note } = site.assessment;
  const [skin, setSkin] = useState<string | null>(null);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [period, setPeriod] = useState<string | null>(null);
  const id = useId();

  const href = useMemo(
    () => whatsappUrl(buildMessage(skin, selectedConcerns, period)),
    [skin, selectedConcerns, period],
  );

  const answered = Number(skin !== null) + Number(selectedConcerns.length > 0) + Number(period !== null);

  function toggleConcern(value: string) {
    setSelectedConcerns((current) =>
      current.includes(value) ? current.filter((c) => c !== value) : [...current, value],
    );
  }

  return (
    <form
      className={styles.card}
      aria-labelledby={`${id}-title`}
      onSubmit={(event) => event.preventDefault()}
    >
      <p className={styles.kicker}>Ficha de avaliação</p>
      <h2 id={`${id}-title`} className={styles.title}>
        {title}
      </h2>
      <p className={styles.intro}>{intro}</p>

      <fieldset className={styles.group}>
        <legend>Como você descreveria a sua pele?</legend>
        <div className={styles.options}>
          {skinTypes.map((option) => (
            <label key={option} className={styles.option}>
              <input
                type="radio"
                name={`${id}-skin`}
                value={option}
                checked={skin === option}
                onChange={() => setSkin(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend>
          O que mais incomoda hoje? <span className={styles.hint}>pode marcar mais de um</span>
        </legend>
        <div className={styles.options}>
          {concerns.map((option) => (
            <label key={option} className={styles.option}>
              <input
                type="checkbox"
                value={option}
                checked={selectedConcerns.includes(option)}
                onChange={() => toggleConcern(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend>Qual período é melhor para você?</legend>
        <div className={styles.options}>
          {periods.map((option) => (
            <label key={option} className={styles.option}>
              <input
                type="radio"
                name={`${id}-period`}
                value={option}
                checked={period === option}
                onChange={() => setPeriod(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <a className={`button ${styles.submit}`} href={href} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon />
        {submit}
      </a>
      <p className={styles.status} aria-live="polite">
        {answered === 0
          ? "Se preferir, envie sem marcar nada."
          : `${answered} de 3 respostas vão junto na mensagem.`}
      </p>
      <p className={styles.note}>{note}</p>
    </form>
  );
}
