"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import type { Locale } from "@/lib/types"

const LABELS: Record<Locale, string> = { fr: "FR", en: "EN" }
const ORDER: Locale[] = ["fr", "en"]

export default function LocaleSwitcher({ current }: { current: Locale }) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  function setLocale(locale: Locale) {
    if (locale === current) return
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`
    startTransition(() => router.refresh())
  }

  return (
    <div className="inline-flex items-center gap-1 text-xs">
      {ORDER.map((loc, i) => (
        <span key={loc} className="inline-flex items-center gap-1">
          {i > 0 && <span className="text-muted-foreground/40">/</span>}
          <button
            type="button"
            onClick={() => setLocale(loc)}
            className={
              loc === current
                ? "font-medium text-foreground"
                : "text-muted-foreground transition-colors hover:text-foreground"
            }
            aria-current={loc === current}
          >
            {LABELS[loc]}
          </button>
        </span>
      ))}
    </div>
  )
}
