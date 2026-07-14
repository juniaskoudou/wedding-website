import Image from "next/image"
import styles from "./Rsvp.module.css"

export default function Rsvp({
  text,
  buttonLabel,
  buttonHref,
  venueImage,
  venueAlt,
}: {
  text: string
  buttonLabel: string
  buttonHref: string
  venueImage: string
  venueAlt: string
}) {
  return (
    <section className={styles.section} aria-label="RSVP">
      <div className={styles.intro}>
        <p className={styles.text}>{text}</p>

        <a className={styles.button} href={buttonHref}>
          {buttonLabel}
        </a>
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
