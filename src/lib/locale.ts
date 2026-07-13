import "server-only"
import { cookies, headers } from "next/headers"
import type { Locale } from "./types"
import { resolveLocale } from "./i18n"

export const LOCALE_COOKIE = "locale"

// Resolve the active locale: explicit cookie override wins, otherwise fall back
// to the device's Accept-Language header, defaulting to English.
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value
  if (cookieLocale === "fr" || cookieLocale === "en") {
    return cookieLocale
  }

  const headerStore = await headers()
  const acceptLanguage = headerStore.get("accept-language")
  return resolveLocale(acceptLanguage)
}
