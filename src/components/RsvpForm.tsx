"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, Trash, Check, Heart } from "@phosphor-icons/react"
import type { Dictionary } from "@/lib/i18n"
import type { Locale, Meal, RsvpSubmission } from "@/lib/types"
import { submitRsvpAction } from "@/lib/rsvp-actions"

const MEALS: Meal[] = ["fish", "chicken", "meat"]

type Companion = { name: string; meal: Meal | null; dietaryNotes: string }

function MealPicker({
  value,
  onChange,
  labels,
}: {
  value: Meal | null
  onChange: (m: Meal) => void
  labels: Record<Meal, string>
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {MEALS.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={`border px-3 py-1.5 text-sm transition-colors ${
            value === m
              ? "border-foreground bg-foreground text-background"
              : "border-input text-muted-foreground hover:border-foreground hover:text-foreground"
          }`}
        >
          {labels[m]}
        </button>
      ))}
    </div>
  )
}

export default function RsvpForm({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.rsvp
  const [name, setName] = useState("")
  const [attending, setAttending] = useState<boolean | null>(null)
  const [primaryMeal, setPrimaryMeal] = useState<Meal | null>(null)
  const [primaryDiet, setPrimaryDiet] = useState("")
  const [companions, setCompanions] = useState<Companion[]>([])
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<null | boolean>(null)
  const [pending, startTransition] = useTransition()

  function addCompanion() {
    setCompanions((prev) => [...prev, { name: "", meal: null, dietaryNotes: "" }])
  }
  function updateCompanion(i: number, patch: Partial<Companion>) {
    setCompanions((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)))
  }
  function removeCompanion(i: number) {
    setCompanions((prev) => prev.filter((_, idx) => idx !== i))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!name.trim()) {
      setError(t.errorName)
      return
    }
    if (attending === null) {
      setError(t.errorAttending)
      return
    }

    const attendees: RsvpSubmission["attendees"] = attending
      ? [
          {
            name: name.trim(),
            meal: primaryMeal,
            dietaryNotes: primaryDiet.trim() || null,
            isPrimary: true,
          },
          ...companions
            .filter((c) => c.name.trim())
            .map((c) => ({
              name: c.name.trim(),
              meal: c.meal,
              dietaryNotes: c.dietaryNotes.trim() || null,
              isPrimary: false,
            })),
        ]
      : []

    const submission: RsvpSubmission = {
      name: name.trim(),
      email: email.trim() || null,
      attending,
      message: message.trim() || null,
      locale,
      attendees,
    }

    startTransition(async () => {
      const res = await submitRsvpAction(submission)
      if (res.ok) {
        setDone(attending)
      } else if (res.error === "name") {
        setError(t.errorName)
      } else if (res.error === "attending") {
        setError(t.errorAttending)
      } else {
        setError(t.errorGeneric)
      }
    })
  }

  if (done !== null) {
    return (
      <div className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-5 px-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted">
          {done ? (
            <Check weight="bold" className="size-6 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Heart weight="fill" className="size-6 text-muted-foreground" />
          )}
        </div>
        <h1 className="font-display text-3xl font-normal">{t.confirmTitle}</h1>
        <p className="text-sm text-muted-foreground">
          {done ? t.confirmAttending : t.confirmDeclined}
        </p>
        <Button asChild variant="outline" size="sm" className="mt-2">
          <Link href="/">{t.backHome}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-2 text-center">
        <h1 className="font-display text-4xl font-normal">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-6">
        {/* Name */}
        <div className="grid gap-2">
          <Label htmlFor="rsvp-name">{t.nameLabel}</Label>
          <Input
            id="rsvp-name"
            placeholder={t.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        {/* Attending */}
        <div className="grid gap-2">
          <Label>{t.attendingLabel}</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setAttending(true)}
              className={`border px-4 py-3 text-sm transition-colors ${
                attending === true
                  ? "border-foreground bg-foreground text-background"
                  : "border-input text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {t.yes}
            </button>
            <button
              type="button"
              onClick={() => setAttending(false)}
              className={`border px-4 py-3 text-sm transition-colors ${
                attending === false
                  ? "border-foreground bg-foreground text-background"
                  : "border-input text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {t.no}
            </button>
          </div>
        </div>

        {/* Attending details */}
        {attending === true && (
          <>
            <div className="grid gap-2">
              <Label>{t.mealLabel}</Label>
              <MealPicker value={primaryMeal} onChange={setPrimaryMeal} labels={t.meals} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="rsvp-diet">{t.dietaryLabel}</Label>
              <Input
                id="rsvp-diet"
                placeholder={t.dietaryPlaceholder}
                value={primaryDiet}
                onChange={(e) => setPrimaryDiet(e.target.value)}
              />
            </div>

            {/* Companions */}
            <div className="grid gap-3">
              <div>
                <Label>{t.companionsLabel}</Label>
                <p className="mt-1 text-xs text-muted-foreground">{t.companionsHint}</p>
              </div>

              {companions.map((c, i) => (
                <div key={i} className="grid gap-3 border border-border p-3">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder={t.companionNamePlaceholder}
                      value={c.name}
                      onChange={(e) => updateCompanion(i, { name: e.target.value })}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeCompanion(i)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label={t.remove}
                    >
                      <Trash weight="bold" />
                    </Button>
                  </div>
                  <MealPicker
                    value={c.meal}
                    onChange={(m) => updateCompanion(i, { meal: m })}
                    labels={t.meals}
                  />
                  <Input
                    placeholder={t.dietaryPlaceholder}
                    value={c.dietaryNotes}
                    onChange={(e) => updateCompanion(i, { dietaryNotes: e.target.value })}
                  />
                </div>
              ))}

              <Button type="button" variant="outline" size="sm" onClick={addCompanion} className="w-fit">
                <Plus weight="bold" data-icon="inline-start" />
                {t.addCompanion}
              </Button>
            </div>
          </>
        )}

        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="rsvp-email">{t.emailLabel}</Label>
          <Input
            id="rsvp-email"
            type="email"
            placeholder={t.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Message */}
        <div className="grid gap-2">
          <Label htmlFor="rsvp-message">{t.messageLabel}</Label>
          <Textarea
            id="rsvp-message"
            placeholder={t.messagePlaceholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? t.sending : t.submit}
        </Button>
      </form>
    </div>
  )
}
