import { site } from "@/content/site";
import styles from "./Marquee.module.css";

// Faixa decorativa com as especialidades. O conteúdo se repete na seção de
// tratamentos, por isso fica fora da leitura de tela.
export function Marquee() {
  return (
    <div className={styles.marquee} data-theme="ink" aria-hidden="true">
      <div className={styles.track}>
        {[0, 1].map((copy) => (
          <ul key={copy}>
            {site.marquee.map((item) => (
              <li key={item}>
                {item}
                <span className={styles.dot} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
