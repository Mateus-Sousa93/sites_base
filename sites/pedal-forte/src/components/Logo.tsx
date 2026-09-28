import styles from "./Logo.module.css";

export function Logo() {
  return (
    <span className={styles.logo}>
      <svg className={styles.mark} viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="12.5" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M16 3.5v25M3.5 16h25" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <circle cx="16" cy="16" r="4" fill="var(--signal)" />
      </svg>
      <span className={styles.word}>Pedal Forte</span>
    </span>
  );
}
