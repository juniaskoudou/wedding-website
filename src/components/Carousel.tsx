"use client"

import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { carouselPhotos } from "@/data/photos"
import styles from "./Carousel.module.css"

const START_INDEX = Math.floor(carouselPhotos.length / 2)

export default function Carousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: false,
    startIndex: START_INDEX,
  })

  return (
    <section className={styles.section} aria-label="Photo gallery">
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
    </section>
  )
}
