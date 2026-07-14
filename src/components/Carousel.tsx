"use client"

import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import type { Photo } from "@/data/photos"
import styles from "./Carousel.module.css"

export default function Carousel({ photos }: { photos: Photo[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: false,
    startIndex: Math.floor(photos.length / 2),
  })

  return (
    <section className={styles.section} aria-label="Photo gallery">
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          {photos.map((photo, i) => (
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
