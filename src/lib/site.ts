import type { Locale } from "./types"

/**
 * Resolve the canonical site URL. Priority:
 *  1. NEXT_PUBLIC_SITE_URL (set this in your env / Vercel project for production)
 *  2. Vercel-provided deployment URL
 *  3. localhost fallback for dev
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, "")

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  if (vercel) return `https://${vercel}`

  return "http://localhost:3000"
}

export const siteUrl = resolveSiteUrl()

/** Localized site copy used across metadata (Open Graph, Twitter, etc.). */
export const siteMeta: Record<Locale, { title: string; description: string; ogAlt: string }> = {
  fr: {
    title: "Caroline & Junias — Notre mariage",
    description:
      "Caroline & Junias se marient le 15 Avril 2027 au Manoir de Villefermoy. Découvrez notre histoire et confirmez votre présence.",
    ogAlt: "Caroline & Junias — 15 Avril 2027, Manoir de Villefermoy",
  },
  en: {
    title: "Caroline & Junias — Our wedding",
    description:
      "Caroline & Junias are getting married on April 15, 2027 at Manoir de Villefermoy. Discover our story and RSVP.",
    ogAlt: "Caroline & Junias — April 15, 2027, Manoir de Villefermoy",
  },
}

/** Path (relative to /public) of the social share image. Design it at 1200×630. */
export const ogImagePath = "/og.jpg"
export const ogImageWidth = 1200
export const ogImageHeight = 630
