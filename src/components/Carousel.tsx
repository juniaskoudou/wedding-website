"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import type { Photo } from "@/data/photos"
import styles from "./Carousel.module.css"

export default function Carousel({ photos }: { photos: Photo[] }) {
  const startIndex = Math.floor(photos.length / 2)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: false,
    startIndex,
  })

  const [revealed, setRevealed] = useState(false)
  // Per-slide ripple step (ms). Zeroed for reduced motion so the fade is flat.
  const [stagger, setStagger] = useState(60)
  const sectionRef = useRef<HTMLElement | null>(null)

  // One-shot entrance: the centered photo appears first and its neighbours
  // ripple outward once the gallery scrolls into view. Reduced-motion users
  // skip straight to the shown state.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (reduceMotion) {
      setStagger(0)
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

  return (
    <section
      ref={sectionRef}
      className={`${styles.section}${revealed ? ` ${styles.revealed}` : ""}`}
      aria-label="Photo gallery"
    >
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          {photos.map((photo, i) => (
            <div
              key={photo.src}
              className={styles.slide}
              onClick={() => emblaApi?.scrollTo(i)}
              style={{ transitionDelay: `${Math.abs(i - startIndex) * stagger}ms` }}
            >
              <div className={styles.frame}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 640px"
                  className={styles.img}
                  draggable={false}
                />
                {(photo.date || photo.location) && (
                  <figcaption className={styles.caption}>
                    {photo.date && (
                      <span className={styles.captionLine}>{photo.date}</span>
                    )}
                    {photo.location && (
                      <span className={styles.captionLine}>{photo.location}</span>
                    )}
                  </figcaption>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
