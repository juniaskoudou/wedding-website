"use client"

import { useEffect, useRef, useState } from "react"
import Polaroid from "./Polaroid"
import type { Milestone } from "@/data/milestones"
import styles from "./Milestones.module.css"

type Intro = {
  before: string
  highlight: string
  afterLine1: string
  line2: string
}

export default function Milestones({
  milestones,
  intro,
}: {
  milestones: Milestone[]
  intro: Intro
}) {
  const [active, setActive] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const sectionRef = useRef<HTMLElement | null>(null)
  const itemRefs = useRef<Array<HTMLLIElement | null>>([])

  // One-shot entrance: reveal (and stagger) the section the first time it
  // scrolls into view. Reduced-motion users skip straight to the shown state.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (reduceMotion) {
      setRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            observer.disconnect()
            break
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

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

  return (
    <section
      ref={sectionRef}
      className={`${styles.section}${revealed ? ` ${styles.revealed}` : ""}`}
      aria-label="Our story"
    >
      <p className={styles.intro}>
        {intro.before}
        <em className={styles.highlight}>{intro.highlight}</em>
        {intro.afterLine1}
        <br />
        {intro.line2}
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
              <button
                type="button"
                className={styles.itemButton}
                onClick={() => setActive(i)}
                aria-label={`${m.title} — ${m.date}, ${m.location}`}
              >
                <h3 className={styles.title}>{m.title}</h3>
                <p className={styles.meta}>
                  {m.date}
                  <br />
                  {m.location}
                </p>
              </button>
            </li>
          ))}
        </ol>

        <div className={styles.polaroidCol}>
          <Polaroid layers={milestones} activeIndex={active} />
        </div>
      </div>
    </section>
  )
}
