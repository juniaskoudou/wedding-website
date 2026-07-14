"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { carouselPhotos } from "@/data/photos"
import styles from "./Carousel.module.css"

const START_INDEX = Math.floor(carouselPhotos.length / 2)

// Slide sizing at the two ends of the scroll effect.
const BASIS_MIN = 74 // % — peeking neighbours visible
const BASIS_MAX = 100 // % — centre photo edge-to-edge
const PAD_MIN = 1 // px — half of the 2px gap (expanded)
const PAD_MAX = 4 // px — half of the 8px gap (collapsed)
const MOBILE_MAX_PX = 767 // scroll-expand effect only applies at/below this width

export default function Carousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: false,
    startIndex: START_INDEX,
  })
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!emblaApi) return
    const section = sectionRef.current
    if (!section) return

    // The scroll-driven expand effect is mobile-only.
    const mql = window.matchMedia(`(max-width: ${MOBILE_MAX_PX}px)`)
    let raf = 0
    let lastProgress = -1

    const apply = () => {
      raf = 0
      const vh = window.innerHeight
      const rect = section.getBoundingClientRect()
      // Section is taller than the viewport and its inner content is sticky.
      // Progress tracks how far we've scrolled through that extra height.
      const scrollable = rect.height - vh
      const progress =
        scrollable > 0
          ? Math.min(1, Math.max(0, -rect.top / scrollable))
          : 0
      if (Math.abs(progress - lastProgress) < 0.001) return
      lastProgress = progress

      const basis = BASIS_MIN + (BASIS_MAX - BASIS_MIN) * progress
      const pad = PAD_MAX + (PAD_MIN - PAD_MAX) * progress
      section.style.setProperty("--slide-basis", `${basis}%`)
      section.style.setProperty("--slide-pad", `${pad}px`)
      // Keep the centred slide centred as the slide sizes change.
      emblaApi.reInit()
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }

    const enable = () => {
      apply()
      window.addEventListener("scroll", onScroll, { passive: true })
      window.addEventListener("resize", onScroll)
    }

    const disable = () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
      lastProgress = -1
      // Reset to the static (peeking) layout for non-mobile viewports.
      section.style.removeProperty("--slide-basis")
      section.style.removeProperty("--slide-pad")
      emblaApi.reInit()
    }

    const sync = () => (mql.matches ? enable() : disable())

    sync()
    mql.addEventListener("change", sync)
    return () => {
      mql.removeEventListener("change", sync)
      disable()
    }
  }, [emblaApi])

  return (
    <section className={styles.section} aria-label="Photo gallery" ref={sectionRef}>
      <div className={styles.sticky}>
        <div className={styles.viewport} ref={emblaRef}>
          <div className={styles.container}>
            {carouselPhotos.map((photo, i) => (
              <div
                key={photo.src}
                className={styles.slide}
                onClick={() => emblaApi?.scrollTo(i)}
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
