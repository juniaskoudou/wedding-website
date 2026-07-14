"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./Expect.module.css"

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n))

// Small head-start so the bar reads as "started" on the first item instead of
// looking empty at progress 0.
const BAR_MIN = 0.06

type Heading = { before: string; highlight: string; after: string }
type Card = { title: string; body: string; icon: string }

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
  // Overlap distance (px) = the extra viewport during which the footer rises.
  const overlapDist = useRef(0)

  const [sectionHeight, setSectionHeight] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [translate, setTranslate] = useState(0)
  const [active, setActive] = useState(0)
  // 0 while panning, ramps 0→1 during the overlap so the frame fades as the
  // footer covers it.
  const [fade, setFade] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const sticky = stickyRef.current
    const viewport = viewportRef.current
    const row = rowRef.current
    if (!section || !sticky || !viewport || !row) return

    const measure = () => {
      // scrollWidth drops the flex container's trailing padding-right, so the
      // last card would stop flush against the edge. Add it back so the final
      // card ends with the same inset the first card starts with.
      const padRight = parseFloat(getComputedStyle(row).paddingRight) || 0
      const max = Math.max(0, row.scrollWidth + padRight - viewport.clientWidth)
      maxTranslate.current = max
      const pinned = sticky.offsetHeight
      overlapDist.current = pinned
      // The footer overlaps the pinned frame by pulling itself up. It must pull
      // by *exactly* the extra viewport we reserve below, otherwise the reserved
      // scroll and the footer's travel diverge (this is the mobile bug where the
      // reserved px height != CSS 100svh, leaving dead scroll past the footer).
      // Publish the measured pin height so the footer pulls by the same px value.
      document.documentElement.style.setProperty("--expect-overlap", `${pinned}px`)
      // Section height = pinned viewport + horizontal pan distance + one extra
      // viewport. During that last viewport the cards are done (progress stays
      // at 1) and the last frame stays pinned while the footer scrolls up over
      // it (see the negative margin-top on the footer).
      setSectionHeight(pinned * 2 + max)
    }

    let ticking = false
    const update = () => {
      ticking = false
      const max = maxTranslate.current
      const overlap = overlapDist.current
      const rect = section.getBoundingClientRect()
      const scrolled = -rect.top
      const p = max > 0 ? clamp(scrolled / max, 0, 1) : 0
      setProgress(p)
      setTranslate(-p * max)
      setActive(Math.round(p * (cards.length - 1)))
      // Fade the frame fully out by ~35% of the overlap, so it hits 0 opacity
      // while the footer is still rising.
      setFade(overlap > 0 ? clamp((scrolled - max) / (overlap * 0.35), 0, 1) : 0)
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
      <div
        ref={stickyRef}
        className={styles.sticky}
        style={{ opacity: 1 - fade }}
      >
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
                  <span
                    className={styles.icon}
                    style={{ maskImage: `url(${card.icon})`, WebkitMaskImage: `url(${card.icon})` }}
                    aria-hidden
                  />
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardBody}>{card.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.track} aria-hidden>
            <span
              className={styles.fill}
              style={{ transform: `scaleX(${BAR_MIN + progress * (1 - BAR_MIN)})` }}
            />
            <span
              className={styles.dot}
              style={{
                left: `calc(${BAR_MIN + progress * (1 - BAR_MIN)} * (100% - 9px))`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
