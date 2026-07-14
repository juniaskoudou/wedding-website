"use client"

import { useEffect } from "react"

/**
 * Dependency-free eased wheel scrolling. Intercepts wheel input and animates
 * the real window scroll position toward a target with a low lerp factor, so
 * the page glides to a stop instead of snapping. Because it drives the native
 * scroll position, scroll-driven sections (Expect pin, IntersectionObserver)
 * keep working unchanged.
 *
 * Only active on fine pointers (mouse/trackpad). Touch devices keep their
 * native momentum scrolling, and users who prefer reduced motion are left on
 * the default behavior.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (!finePointer || reduceMotion) return

    // Lower = slower / smoother catch-up.
    const EASE = 0.08

    let target = window.scrollY
    let current = window.scrollY
    let running = false
    let rafId: number | null = null

    const maxScroll = () =>
      document.documentElement.scrollHeight - window.innerHeight
    const clamp = (v: number) => Math.max(0, Math.min(v, maxScroll()))

    const loop = () => {
      current += (target - current) * EASE
      if (Math.abs(target - current) < 0.4) {
        current = target
        window.scrollTo(0, current)
        running = false
        rafId = null
        return
      }
      window.scrollTo(0, current)
      rafId = requestAnimationFrame(loop)
    }

    const start = () => {
      if (running) return
      running = true
      rafId = requestAnimationFrame(loop)
    }

    const onWheel = (e: WheelEvent) => {
      // Let pinch-zoom and horizontal gestures behave natively.
      if (e.ctrlKey) return
      e.preventDefault()
      // Normalize line/page delta modes to pixels.
      const factor =
        e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1
      target = clamp(target + e.deltaY * factor)
      start()
    }

    // When the user scrolls by other means (keyboard, scrollbar, anchor jump)
    // resync so the next wheel gesture starts from the right place.
    const onScroll = () => {
      if (!running) {
        target = window.scrollY
        current = window.scrollY
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("scroll", onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  return null
}
