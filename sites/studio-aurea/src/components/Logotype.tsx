import { site } from "@/content/site";
import styles from "./Logotype.module.css";

export function Logotype({ tone = "plum" }: { tone?: "plum" | "porcelain" }) {
  return (
    <span className={`${styles.logo} ${tone === "porcelain" ? styles.onDark : ""}`}>
      <span className={styles.name}>{site.shortName}</span>
      <span className={styles.descriptor}>{site.descriptor}</span>
    </span>
  );
}
