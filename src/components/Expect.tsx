"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { expectHeading, expectCards } from "@/data/expect"
import styles from "./Expect.module.css"

export default function Expect() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
  })
  const [selected, setSelected] = useState(0)
  const [progress, setProgress] = useState(0)

  const onScroll = useCallback((api: NonNullable<typeof emblaApi>) => {
    setProgress(Math.max(0, Math.min(1, api.scrollProgress())))
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap())
    const handleScroll = () => onScroll(emblaApi)
    onSelect()
    handleScroll()
    emblaApi.on("select", onSelect)
    emblaApi.on("scroll", handleScroll)
    emblaApi.on("reInit", onSelect)
    emblaApi.on("reInit", handleScroll)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("scroll", handleScroll)
      emblaApi.off("reInit", onSelect)
      emblaApi.off("reInit", handleScroll)
    }
  }, [emblaApi, onScroll])

  return (
    <section className={styles.section} aria-label="What to expect">
      <h2 className={styles.heading}>
        {expectHeading.before}
        <em className={styles.highlight}>{expectHeading.highlight}</em>
        {expectHeading.after}
      </h2>

      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          {expectCards.map((card, i) => (
            <article
              key={card.title}
              className={`${styles.card}${i === selected ? ` ${styles.active}` : ""}`}
              aria-current={i === selected}
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
    </section>
  )
}
