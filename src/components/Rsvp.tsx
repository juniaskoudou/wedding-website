import Image from "next/image"
import styles from "./Rsvp.module.css"

export default function Rsvp({
  intro,
  venue,
  date,
  buttonLabel,
  buttonHref,
  venueImage,
  venueAlt,
}: {
  intro: { before: string; highlight: string }
  venue: string
  date: string
  buttonLabel: string
  buttonHref: string
  venueImage: string
  venueAlt: string
}) {
  return (
    <section className={styles.section} aria-label="RSVP">
      <p className={styles.intro}>
        {intro.before}{" "}
        <em className={styles.highlight}>{intro.highlight}</em>
      </p>

      <div className={styles.main}>
        <div className={styles.headline}>
          <h2 className={styles.names}>
            <span className={styles.initial}>C</span>aroline &amp;{" "}
            <span className={styles.initial}>J</span>unias
          </h2>

          <div className={styles.details}>
            <p>{venue}</p>
            <p>{date}</p>
          </div>

          <a className={styles.button} href={buttonHref}>
            {buttonLabel}
          </a>
        </div>
      </div>

      <div className={styles.venue}>
        <Image
          src={venueImage}
          alt={venueAlt}
          width={1741}
          height={700}
          className={styles.venueImg}
          unoptimized
          priority={false}
        />
      </div>
    </section>
  )
}
