import styles from "./Logo.module.css";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span className={`${styles.logo} ${tone === "light" ? styles.light : ""}`}>
      <svg className={styles.mark} viewBox="0 0 40 40" aria-hidden="true">
        <rect width="40" height="40" rx="12" className={styles.tile} />
        <path
          d="M7 21h7l3-8 5 15 3-9 2 2h6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={styles.word}>
        Clínica <em>Pulso</em>
      </span>
    </span>
  );
}
