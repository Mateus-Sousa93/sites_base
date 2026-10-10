import { site } from "@/content/site";
import { Reveal } from "@/motion/Reveal";
import styles from "./Team.module.css";

// Equipe. Enquanto não há foto real de cada profissional, o cartão usa um
// medalhão com as iniciais: o site não apresenta rosto de banco de imagem como
// se fosse da equipe.
export function Team() {
  const { label, title, titleAccent, lead, people } = site.team;

  return (
    <section id="equipe" data-theme="pearl" className={styles.section} aria-labelledby="equipe-title">
      <div className={`container ${styles.grid}`}>
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
              <Reveal delay={index * 120} className={styles.card}>
                <span className={styles.medal} aria-hidden="true">
                  {person.initials}
                </span>
                <div>
                  <h3>{person.name}</h3>
                  <p className={styles.role}>{person.role}</p>
                  <p className={styles.bio}>{person.bio}</p>
                  <p className={styles.cro}>{person.cro}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
