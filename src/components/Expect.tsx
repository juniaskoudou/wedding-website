"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./Expect.module.css"

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n))

type Heading = { before: string; highlight: string; after: string }
type Card = { title: string; body: string }

export default function Expect({
  heading,
  cards,
}: {
  heading: Heading
  cards: Card[]
}) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const stickyRef = useRef<HTMLDivElement | null>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const rowRef = useRef<HTMLDivElement | null>(null)

  // Max horizontal pan distance (px). Kept in a ref because the scroll handler
  // needs the freshest value without re-subscribing.
  const maxTranslate = useRef(0)

  const [sectionHeight, setSectionHeight] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [translate, setTranslate] = useState(0)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const sticky = stickyRef.current
    const viewport = viewportRef.current
    const row = rowRef.current
    if (!section || !sticky || !viewport || !row) return

    const measure = () => {
      const max = Math.max(0, row.scrollWidth - viewport.clientWidth)
      maxTranslate.current = max
      // The extra vertical scroll room = horizontal distance to pan through.
      setSectionHeight(sticky.offsetHeight + max)
    }

    let ticking = false
    const update = () => {
      ticking = false
      const max = maxTranslate.current
      const rect = section.getBoundingClientRect()
      const p = max > 0 ? clamp(-rect.top / max, 0, 1) : 0
      setProgress(p)
      setTranslate(-p * max)
      setActive(Math.round(p * (cards.length - 1)))
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    measure()
    update()

    const ro = new ResizeObserver(() => {
      measure()
      update()
    })
    ro.observe(row)
    ro.observe(viewport)

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", measure)
    }
  }, [cards.length])

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      style={sectionHeight ? { height: sectionHeight } : undefined}
      aria-label="What to expect"
    >
      <div ref={stickyRef} className={styles.sticky}>
        <h2 className={styles.heading}>
          {heading.before}
          <em className={styles.highlight}>{heading.highlight}</em>
          {heading.after}
        </h2>

        <div className={styles.content}>
          <div ref={viewportRef} className={styles.viewport}>
            <div
              ref={rowRef}
              className={styles.container}
              style={{ transform: `translate3d(${translate}px, 0, 0)` }}
            >
              {cards.map((card, i) => (
                <article
                  key={card.title}
                  className={`${styles.card}${i === active ? ` ${styles.active}` : ""}`}
                  aria-current={i === active}
                >
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardBody}>{card.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.track} aria-hidden>
            <span
              className={styles.fill}
              style={{ transform: `scaleX(${progress})` }}
            />
            <span
              className={styles.dot}
              style={{ left: `calc(${progress} * (100% - 9px))` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
