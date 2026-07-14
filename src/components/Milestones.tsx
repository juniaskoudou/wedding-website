"use client"

import { useEffect, useRef, useState } from "react"
import Polaroid from "./Polaroid"
import { milestones, milestonesIntro } from "@/data/milestones"
import styles from "./Milestones.module.css"

export default function Milestones() {
  const [active, setActive] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper = scrollRef.current
    if (!wrapper) return
    const count = milestones.length
    let raf = 0
    let last = -1

    const apply = () => {
      raf = 0
      const rect = wrapper.getBoundingClientRect()
      const travel = wrapper.offsetHeight - window.innerHeight
      if (travel <= 0) return
      const scrolled = Math.min(Math.max(-rect.top, 0), travel)
      const progress = scrolled / travel
      // Equal segment per milestone; the pin only releases once the last one
      // has been reached.
      const idx = Math.min(count - 1, Math.floor(progress * count))
      if (idx !== last) {
        last = idx
        setActive(idx)
      }
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }

    apply()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const current = milestones[active]

  return (
    <section className={styles.scroll} ref={scrollRef} aria-label="Our story">
      <div className={styles.sticky}>
        <p className={styles.intro}>
          {milestonesIntro.before}
          <em className={styles.highlight}>{milestonesIntro.highlight}</em>
          {milestonesIntro.after}
        </p>

        <div className={styles.body}>
          <ol className={styles.list}>
            {milestones.map((m, i) => (
              <li
                key={m.title}
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
      </div>
    </section>
  )
}
