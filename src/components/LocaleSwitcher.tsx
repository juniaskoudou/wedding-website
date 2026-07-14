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
    <div className="inline-flex items-center gap-2 text-xs">
      {ORDER.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => setLocale(loc)}
          className={
            loc === current
              ? "font-medium text-ink"
              : "text-ink/50 transition-colors hover:text-ink"
          }
          aria-current={loc === current}
        >
          {LABELS[loc]}
        </button>
      ))}
    </div>
  )
}
