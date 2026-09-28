import { site } from "@/content/site";
import { InstagramIcon } from "./icons";
import styles from "./InstagramStrip.module.css";

export function InstagramStrip() {
  const { handle, url } = site.instagram;

  return (
    <section className={styles.section} aria-labelledby="instagram-title">
      <div className={`container ${styles.head}`}>
        <h2 id="instagram-title" className={styles.title}>
          No Instagram
        </h2>
        <a className="text-link" href={url} target="_blank" rel="noopener noreferrer">
          @{handle}
          <span className="visually-hidden"> (abre em nova aba)</span>
        </a>
      </div>
      <ul className={styles.strip}>
        {site.instagramPosts.map((post) => (
          <li key={post.text} className={styles.item}>
            <a
              className={`${styles.post} ${styles[post.tone]}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.kind}>{post.kind}</span>
              <span className={styles.text}>{post.text}</span>
              <span className={styles.footer}>
                <InstagramIcon className={styles.icon} />
                {handle}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
