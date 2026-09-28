import styles from "./Logo.module.css";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span className={`${styles.logo} ${tone === "light" ? styles.light : ""}`}>
      <span className={styles.mark} aria-hidden="true">
        A<span>&amp;</span>R
      </span>
      <span className={styles.word}>
        Almeida &amp; Rocha
        <small>Contabilidade</small>
      </span>
    </span>
  );
}
