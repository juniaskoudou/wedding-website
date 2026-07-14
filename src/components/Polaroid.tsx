import Image from "next/image"
import styles from "./Polaroid.module.css"

type Layer = {
  color: string
  image?: string
  imageAlt?: string
}

type PolaroidProps = {
  layers: Layer[]
  activeIndex: number
  className?: string
}

// Pixel-perfect polaroid: 152×213 card, 8px border on top/left/right and a
// 42px lip at the bottom, with the crumpled tape holding it at the top.
// All layers are stacked and cross-fade via opacity as the active one changes.
export default function Polaroid({ layers, activeIndex, className }: PolaroidProps) {
  return (
    <figure className={`${styles.polaroid}${className ? ` ${className}` : ""}`}>
      <div className={styles.window}>
        {layers.map((layer, i) => {
          const isActive = i === activeIndex
          return (
            <div
              key={layer.image ?? i}
              className={styles.layer}
              style={{ opacity: isActive ? 1 : 0 }}
              aria-hidden={!isActive}
            >
              {layer.image ? (
                <Image
                  src={layer.image}
                  alt={isActive ? layer.imageAlt ?? "" : ""}
                  fill
                  sizes="136px"
                  className={styles.img}
                  draggable={false}
                />
              ) : (
                <div
                  className={styles.fill}
                  style={{ backgroundColor: layer.color }}
                />
              )}
            </div>
          )
        })}
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
