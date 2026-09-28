import Image from "next/image";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/format";
import styles from "./Team.module.css";

function initials(name: string): string {
  const parts = name.replace(/^(Dra?\.)\s+/, "").split(" ");
  return `${parts[0][0]}${parts[parts.length - 1][0]}`;
}

export function Team() {
  const { title, intro, photos, doctors } = site.team;

  return (
    <section className={`screen ${styles.section}`} id="corpo-clinico" aria-labelledby="corpo-clinico-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.photos}>
          {photos.map((photo) => (
            <div key={photo.alt} className={`photo-cover ${styles.photo}`}>
              <Image src={photo.src} alt={photo.alt} fill placeholder="blur" sizes="(max-width: 899px) 50vw, 20vw" />
            </div>
          ))}
        </div>
        <div className={styles.body}>
          <h2 id="corpo-clinico-title" className={styles.title}>
            {title}
          </h2>
          <p className={styles.intro}>{intro}</p>
          <ul className={styles.list}>
            {doctors.map((d) => (
              <li key={d.crm} className={styles.card}>
                <span className={styles.monogram} aria-hidden="true">
                  {initials(d.name)}
                </span>
                <div className={styles.info}>
                  <p className={styles.name}>{d.name}</p>
                  <p className={styles.specialty}>{d.specialty}</p>
                  <p className={styles.meta}>
                    {d.crm}
                    <br />
                    Atende {d.days.toLowerCase()}
                  </p>
                  <a
                    className={styles.link}
                    href={whatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Agendar
                    <span className="visually-hidden"> com {d.name} pelo WhatsApp (abre em nova aba)</span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
