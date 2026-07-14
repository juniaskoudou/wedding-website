"use client"

import { useEffect, useRef, useState } from "react"
import Polaroid from "./Polaroid"
import { milestones, milestonesIntro } from "@/data/milestones"
import styles from "./Milestones.module.css"

export default function Milestones() {
  const [active, setActive] = useState(0)
  const itemRefs = useRef<Array<HTMLLIElement | null>>([])

  useEffect(() => {
    const items = itemRefs.current.filter(Boolean) as HTMLLIElement[]
    if (!items.length) return

    // A thin trigger band across the middle of the viewport. Whichever
    // milestone crosses it (closest to centre) becomes active; if none is in
    // the band we keep the current one.
    const observer = new IntersectionObserver(
      (entries) => {
        const mid = window.innerHeight / 2
        let best: number | null = null
        let bestDist = Infinity
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const i = items.indexOf(entry.target as HTMLLIElement)
          const r = entry.boundingClientRect
          const center = r.top + r.height / 2
          const dist = Math.abs(center - mid)
          if (dist < bestDist) {
            bestDist = dist
            best = i
          }
        }
        if (best !== null) setActive(best)
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    )

    items.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const current = milestones[active]

  return (
    <section className={styles.section} aria-label="Our story">
      <p className={styles.intro}>
        {milestonesIntro.before}
        <em className={styles.highlight}>{milestonesIntro.highlight}</em>
        {milestonesIntro.afterLine1}
        <br />
        {milestonesIntro.line2}
      </p>

      <div className={styles.body}>
        <ol className={styles.list}>
          {milestones.map((m, i) => (
            <li
              key={m.title}
              ref={(el) => {
                itemRefs.current[i] = el
              }}
              className={`${styles.item}${i === active ? ` ${styles.active}` : ""}`}
              aria-current={i === active}
            >
              <h3 className={styles.title}>{m.title}</h3>
              <p className={styles.meta}>
                {m.date}
                <br />
                {m.location}
              </p>
            </li>
          ))}
        </ol>

        <div className={styles.polaroidCol}>
          <Polaroid
            color={current.color}
            image={current.image}
            imageAlt={current.imageAlt}
          />
        </div>
      </div>
    </section>
  )
}
