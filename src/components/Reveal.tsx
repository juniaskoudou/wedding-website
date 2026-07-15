"use client"

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react"
import styles from "./Reveal.module.css"

/**
 * Reveals its children on first scroll into view with a soft rise-and-fade.
 * Dependency-free (IntersectionObserver + CSS transition) and motion-safe:
 * users who prefer reduced motion see the content immediately.
 *
 * Note: the revealed state resolves to `transform: none`, so this wrapper is
 * safe to place around most sections — but avoid wrapping elements that rely
 * on `position: sticky` scroll math (e.g. the Expect pin), because the
 * transform mid-transition would create a containing block.
 */
export default function Reveal({
  children,
  as,
  delay = 0,
  className,
}: {
  children: ReactNode
  as?: ElementType
  delay?: number
  className?: string
}) {
  const Tag = as ?? "div"
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (reduceMotion) {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true)
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
    <Tag
      ref={ref}
      className={`${styles.reveal}${shown ? ` ${styles.shown}` : ""}${
        className ? ` ${className}` : ""
      }`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
