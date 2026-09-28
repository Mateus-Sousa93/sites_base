import Image from "next/image";
import { site } from "@/content/site";
import { InstagramIcon } from "./icons";
import styles from "./Gallery.module.css";

export function Gallery() {
  const { title, photos } = site.gallery;
  const { handle, url } = site.instagram;

  return (
    <section className={`screen ${styles.section}`} aria-labelledby="galeria-title">
      <div className="container">
        <div className={styles.head}>
          <h2 id="galeria-title" className={styles.title}>
            {title}
          </h2>
          <a className={styles.follow} href={url} target="_blank" rel="noopener noreferrer">
            <InstagramIcon />
            Seguir @{handle}
            <span className="visually-hidden"> no Instagram (abre em nova aba)</span>
          </a>
        </div>
        <ul className={styles.grid}>
          {photos.map((photo, index) => (
            <li key={photo.alt} className={`${styles.item} ${styles[`i${index}`]}`}>
              <a href={url} target="_blank" rel="noopener noreferrer" className={`photo-cover ${styles.link}`}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  placeholder="blur"
                  sizes="(max-width: 899px) 50vw, 25vw"
                />
                <span className={styles.overlay} aria-hidden="true">
                  <InstagramIcon />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
