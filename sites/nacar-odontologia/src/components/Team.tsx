import Image from "next/image";
import { site } from "@/content/site";
import { Reveal } from "@/motion/Reveal";
import styles from "./Team.module.css";

// Equipe: foto do atendimento à direita; à esquerda, os profissionais. Enquanto
// não há retrato real de cada um, a linha usa um medalhão com as iniciais: o
// site não apresenta rosto de banco de imagem como se fosse o dentista.
export function Team() {
  const { label, title, titleAccent, lead, photo, people } = site.team;

  return (
    <section id="equipe" data-theme="pearl" className={`screen ${styles.section}`} aria-labelledby="equipe-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <Reveal className={styles.head}>
            <p className="eyebrow">{label}</p>
            <h2 id="equipe-title" className="section-title">
              {title} <em>{titleAccent}</em>
            </h2>
            <p className="section-lead">{lead}</p>
          </Reveal>

          <ul className={styles.people}>
            {people.map((person, index) => (
              <li key={person.name} data-person>
                <Reveal delay={index * 90} className={styles.person}>
                  <span className={styles.medal} aria-hidden="true">
                    {person.initials}
                  </span>
                  <div>
                    <h3>{person.name}</h3>
                    <p className={styles.role}>{person.role}</p>
                    <p className={styles.bio}>{person.bio}</p>
                  </div>
                  <p className={styles.cro}>{person.cro}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <Reveal kind="image" className={styles.photo}>
          <Image src={photo.src} alt={photo.alt} fill placeholder="blur" sizes="(max-width: 899px) 100vw, 40vw" />
        </Reveal>
      </div>
    </section>
  );
}
