import Image from "next/image"
import styles from "./Rsvp.module.css"
import RsvpDrawer from "./RsvpDrawer"
import type { Dictionary } from "@/lib/i18n"
import type { Locale } from "@/lib/types"

export default function Rsvp({
  intro,
  venue,
  date,
  buttonLabel,
  venueImage,
  venueAlt,
  dict,
  locale,
}: {
  intro: { before: string; highlight: string }
  venue: string
  date: string
  buttonLabel: string
  venueImage: string
  venueAlt: string
  dict: Dictionary
  locale: Locale
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

          <RsvpDrawer
            dict={dict}
            locale={locale}
            triggerLabel={buttonLabel}
            triggerClassName={styles.button}
          />
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
