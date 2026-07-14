import FlowerMark from "@/components/FlowerMark"
import Carousel from "@/components/Carousel"
import Milestones from "@/components/Milestones"
import Expect from "@/components/Expect"
import Rsvp from "@/components/Rsvp"
import styles from "./page.module.css"

export default function PublicPage() {
  return (
    <main className={styles.hero}>
      <section className={styles.content} aria-labelledby="couple-names">
        <FlowerMark className={styles.rose} />
        <div className={styles.copy}>
          <h1 id="couple-names"><span className={styles.initial}>C</span>aroline &amp; <span className={styles.initial}>J</span>unias</h1>
          <div className={styles.details}>
            <p>Manoir de Villefermoy</p>
            <p>April 15, 2027</p>
          </div>
        </div>
      </section>
      <Carousel />
      <Milestones />
      <Expect />
      <Rsvp />
    </main>
  )
}
