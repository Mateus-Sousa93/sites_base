import { site } from "@/content/site";
import { formatPrice, whatsappUrl } from "@/lib/format";
import styles from "./Treatments.module.css";

export function Treatments() {
  const { title, intro, items } = site.treatments;

  return (
    <section className={styles.section} id="tratamentos" aria-labelledby="tratamentos-title">
      <div className={`container ${styles.grid}`}>
        <header className={styles.aside}>
          <h2 id="tratamentos-title" className={styles.title}>
            {title}
          </h2>
          <p className={styles.intro}>{intro}</p>
        </header>

        <div className={styles.menu}>
          <div className={styles.columns} aria-hidden="true">
            <span>Tratamento</span>
            <span>Duração</span>
            <span>Valor</span>
          </div>
          <ul>
            {items.map((item) => (
              <li key={item.name} className={styles.item}>
                <h3 className={styles.name}>{item.name}</h3>
                <p className={styles.duration}>
                  <span className="visually-hidden">Duração: </span>
                  {item.minutes} min
                </p>
                <p className={styles.price}>
                  <span className="visually-hidden">Valor por sessão: </span>
                  {formatPrice(item.price)}
                </p>
                <p className={styles.description}>{item.description}</p>
                <a
                  className={styles.ask}
                  href={whatsappUrl(`${site.whatsapp.greeting}\nTenho interesse em: ${item.name.toLowerCase()}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Perguntar sobre {item.name.toLowerCase()}
                  <span className="visually-hidden"> pelo WhatsApp (abre em nova aba)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
