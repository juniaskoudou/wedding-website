import FlowerMark from "@/components/FlowerMark"
import Carousel from "@/components/Carousel"
import Milestones from "@/components/Milestones"
import Expect from "@/components/Expect"
import Rsvp from "@/components/Rsvp"
import LocaleSwitcher from "@/components/LocaleSwitcher"
import { getLocale } from "@/lib/locale"
import { getDictionary } from "@/lib/i18n"
import { photoSources } from "@/data/photos"
import { milestoneVisuals } from "@/data/milestones"
import { expectVisuals, closingAssets } from "@/data/expect"
import styles from "./page.module.css"

export default async function PublicPage() {
  const locale = await getLocale()
  const { landing } = getDictionary(locale)

  const photos = photoSources.map((asset, i) => ({
    ...asset,
    ...landing.photos[i],
  }))

  const milestones = milestoneVisuals.map((visual, i) => ({
    ...visual,
    ...landing.story.milestones[i],
  }))

  const expectCards = expectVisuals.map((visual, i) => ({
    ...visual,
    ...landing.expect.cards[i],
  }))

  return (
    <main className={styles.hero}>
      <div className={styles.langSwitch}>
        <LocaleSwitcher current={locale} />
      </div>

      <section className={styles.content} aria-labelledby="couple-names">
        <FlowerMark className={styles.rose} />
        <div className={styles.copy}>
          <h1 id="couple-names">
            <span className={styles.initial}>C</span>aroline &amp;{" "}
            <span className={styles.initial}>J</span>unias
          </h1>
          <div className={styles.details}>
            <p>{landing.hero.venue}</p>
            <p>{landing.hero.date}</p>
          </div>
        </div>
      </section>

      <Carousel photos={photos} />
      <Milestones milestones={milestones} intro={landing.story.intro} />
      <Expect heading={landing.expect.heading} cards={expectCards} />
      <Rsvp
        intro={landing.closing.intro}
        venue={landing.hero.venue}
        date={landing.hero.date}
        buttonLabel={landing.closing.buttonLabel}
        buttonHref={closingAssets.buttonHref}
        venueImage={closingAssets.venueImage}
        venueAlt={landing.closing.venueAlt}
      />
    </main>
  )
}
