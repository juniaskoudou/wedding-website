import Image from "next/image"
import { closing } from "@/data/expect"
import styles from "./Rsvp.module.css"

export default function Rsvp() {
  return (
    <section className={styles.section} aria-label="RSVP">
      <p className={styles.text}>{closing.text}</p>

      <a className={styles.button} href={closing.buttonHref}>
        {closing.buttonLabel}
      </a>

      <div className={styles.venue}>
        <Image
          src={closing.venueImage}
          alt={closing.venueAlt}
          width={890}
          height={420}
          className={styles.venueImg}
          unoptimized
          priority={false}
        />
      </div>
    </section>
  )
}
