import Image from "next/image"
import styles from "./Polaroid.module.css"

type PolaroidProps = {
  color: string
  image?: string
  imageAlt?: string
  className?: string
}

// Pixel-perfect polaroid: 152×213 card, 8px border on top/left/right and a
// 42px lip at the bottom, with the crumpled tape holding it at the top.
export default function Polaroid({ color, image, imageAlt, className }: PolaroidProps) {
  return (
    <figure className={`${styles.polaroid}${className ? ` ${className}` : ""}`}>
      <div className={styles.window}>
        {image ? (
          <Image
            src={image}
            alt={imageAlt ?? ""}
            fill
            sizes="136px"
            className={styles.img}
            draggable={false}
          />
        ) : (
          <div
            className={styles.fill}
            style={{ backgroundColor: color }}
          />
        )}
      </div>
      {/* Tape overlays the top edge; decorative only. */}
      <img
        src="/polaroid/tape.png"
        alt=""
        aria-hidden
        className={styles.tape}
        draggable={false}
      />
    </figure>
  )
}
