import Image from "next/image";
import { site } from "@/content/site";
import { formatPrice, whatsappUrl } from "@/lib/format";
import styles from "./Specialties.module.css";

export function Specialties() {
  const { title, intro, items } = site.specialties;

  return (
    <section className={`screen ${styles.section}`} id="especialidades" aria-labelledby="especialidades-title">
      <div className="container">
        <div className={styles.head}>
          <h2 id="especialidades-title" className={styles.title}>
            {title}
          </h2>
          <p className={styles.intro}>{intro}</p>
        </div>
        <ul className={styles.grid}>
          {items.map((item) => (
            <li key={item.id} className={styles.tile}>
              <div className={`photo-cover ${styles.photo}`}>
                <Image src={item.photo.src} alt={item.photo.alt} fill placeholder="blur" sizes="(max-width: 899px) 100vw, 33vw" />
              </div>
              <div className={styles.body}>
                <div className={styles.row}>
                  <h3 className={styles.name}>{item.name}</h3>
                  <p className={styles.price}>
                    <span className="visually-hidden">Consulta particular: </span>
                    {formatPrice(item.price)}
                  </p>
                </div>
                <p className={styles.description}>{item.description}</p>
                <a
                  className={styles.link}
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Agendar {item.name.toLowerCase()}
                  <span className="visually-hidden"> pelo WhatsApp (abre em nova aba)</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
