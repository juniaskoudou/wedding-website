import Link from "next/link"
import { MapPin, CalendarBlank, Clock } from "@phosphor-icons/react/dist/ssr"
import { getLocale } from "@/lib/locale"
import { getDictionary } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import LocaleSwitcher from "@/components/LocaleSwitcher"

export default async function PublicPage() {
  const locale = await getLocale()
  const dict = getDictionary(locale)

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">

      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <LocaleSwitcher current={locale} />
      </div>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {dict.hero.invitedTo}
        </p>
        <h1 className="font-display text-5xl font-normal leading-tight sm:text-7xl">
          Junias<br />&amp;<br />Caroline
        </h1>
        <div className="mt-2 h-px w-16 bg-border" />
        <div className="flex flex-col items-center gap-1">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarBlank className="size-4" weight="light" />
            {dict.hero.date}
          </span>
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4" weight="light" />
            {dict.hero.location}
          </span>
        </div>
        <Button asChild size="lg" className="mt-6">
          <Link href="/rsvp">{dict.cta.rsvp}</Link>
        </Button>
      </section>

      {/* Schedule */}
      <section className="border-t border-border px-6 py-16">
        <div className="mx-auto max-w-lg">
          <h2 className="font-display mb-8 text-center text-2xl font-normal">
            {dict.programme.title}
          </h2>
          <ol className="space-y-5">
            {dict.programme.schedule.map((item) => (
              <li key={item.label} className="flex items-baseline gap-4">
                <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" weight="light" />
                  {item.time}
                </span>
                <div className="flex-1 border-t border-dashed border-border" />
                <span className="text-sm">{item.label}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6 text-center">
        <p className="text-xs text-muted-foreground/50">
          {dict.footer.tagline}
          {" · "}
          <Link href="/admin" className="transition-colors hover:text-muted-foreground">
            ·
          </Link>
        </p>
      </footer>

    </div>
  )
}
