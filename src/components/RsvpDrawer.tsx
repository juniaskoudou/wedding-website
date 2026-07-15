"use client"

import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Plus, Trash, Heart } from "@phosphor-icons/react"
import FlowerMark from "@/components/FlowerMark"
import FabricSwatch from "@/components/FabricSwatch"
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
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
            value === m
              ? "border-ink bg-ink text-white"
              : "border-input text-muted-foreground hover:border-ink hover:text-foreground"
          }`}
        >
          {labels[m]}
        </button>
      ))}
    </div>
  )
}

export default function RsvpDrawer({
  dict,
  locale,
  triggerLabel,
  triggerClassName,
}: {
  dict: Dictionary
  locale: Locale
  triggerLabel: string
  triggerClassName?: string
}) {
  const t = dict.rsvp
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [name, setName] = useState("")
  const [attending, setAttending] = useState<boolean | null>(null)
  const [primaryMeal, setPrimaryMeal] = useState<Meal | null>(null)
  const [primaryDiet, setPrimaryDiet] = useState("")
  const [companions, setCompanions] = useState<Companion[]>([])
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<null | boolean>(null)
  const [pending, startTransition] = useTransition()

  function resetForm() {
    setStep(0)
    setName("")
    setAttending(null)
    setPrimaryMeal(null)
    setPrimaryDiet("")
    setCompanions([])
    setMessage("")
    setError(null)
    setDone(null)
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      // Reset once the closing animation is unlikely to be visible.
      setTimeout(resetForm, 200)
    }
  }

  function addCompanion() {
    setCompanions((prev) =>
      prev.length >= 2 ? prev : [...prev, { name: "", meal: null, dietaryNotes: "" }]
    )
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

    // Attending guests get a second step for the people joining them.
    if (attending && step === 0) {
      setStep(1)
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
      email: null,
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

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <button type="button" className={triggerClassName}>
          {triggerLabel}
        </button>
      </DrawerTrigger>

      <DrawerContent className="mx-auto h-[94svh] max-w-md">
        {done !== null ? (
          <>
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
              {done ? (
                <FlowerMark className="h-20 w-auto" />
              ) : (
                <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                  <Heart weight="fill" className="size-6 text-muted-foreground" />
                </div>
              )}
              <DrawerTitle className="font-display text-3xl font-normal tracking-normal normal-case">
                {t.confirmTitle}
              </DrawerTitle>
              <DrawerDescription className="mx-auto max-w-sm text-balance">
                {done ? `${t.confirmAttending} ${t.dressCodeHint}` : t.confirmDeclined}
              </DrawerDescription>

              {done && (
                <ul className="mt-3 flex flex-wrap justify-center gap-5">
                  {t.dressColors.map((color) => (
                    <li key={color.hex} className="flex flex-col items-center gap-2">
                      <FabricSwatch
                        color={color.hex}
                        className="size-14 rounded-full ring-1 ring-foreground/10"
                      />
                      <span className="text-xs text-muted-foreground">{color.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline" className="h-[46px] w-full rounded-full">
                  {t.backHome}
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <DrawerHeader>
              <DrawerTitle className="font-display text-3xl font-normal tracking-normal normal-case">
                {step === 0 ? t.title : t.companionsTitle}
              </DrawerTitle>
              {step === 1 && (
                <DrawerDescription className="text-center text-balance">
                  {t.companionsHint}
                </DrawerDescription>
              )}
            </DrawerHeader>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-8 pb-4">
              {step === 0 ? (
                <div className="grid gap-8">
                  {/* Name */}
                  <div className="grid gap-2">
                    <Label htmlFor="rsvp-name">{t.nameLabel}</Label>
                    <Input
                      id="rsvp-name"
                      placeholder={t.namePlaceholder}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {/* Attending */}
                  <div className="grid gap-2">
                    <Label>{t.attendingLabel}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAttending(true)}
                        className={`rounded-full border px-4 py-3 text-sm transition-colors ${
                          attending === true
                            ? "border-ink bg-ink text-white"
                            : "border-input text-muted-foreground hover:border-ink hover:text-foreground"
                        }`}
                      >
                        {t.yes}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAttending(false)}
                        className={`rounded-full border px-4 py-3 text-sm transition-colors ${
                          attending === false
                            ? "border-ink bg-ink text-white"
                            : "border-input text-muted-foreground hover:border-ink hover:text-foreground"
                        }`}
                      >
                        {t.no}
                      </button>
                    </div>
                  </div>

                  {/* Primary guest details */}
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
                    </>
                  )}

                  {/* Message */}
                  <div className="grid gap-2">
                    <Label htmlFor="rsvp-message">{t.messageLabel}</Label>
                    <Textarea
                      id="rsvp-message"
                      placeholder={t.messagePlaceholder}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="rounded-[8px]"
                    />
                  </div>
                </div>
              ) : (
                /* Step 2 — additional people */
                <div className="grid gap-5">
                  {companions.map((c, i) => (
                    <div key={i} className="grid gap-6">
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <Label htmlFor={`companion-name-${i}`}>{t.companionNameLabel}</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removeCompanion(i)}
                            className="-mr-2 -my-2 text-muted-foreground hover:text-destructive"
                            aria-label={t.remove}
                          >
                            <Trash weight="bold" />
                          </Button>
                        </div>
                        <Input
                          id={`companion-name-${i}`}
                          placeholder={t.namePlaceholder}
                          value={c.name}
                          onChange={(e) => updateCompanion(i, { name: e.target.value })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>{t.companionMealLabel}</Label>
                        <MealPicker
                          value={c.meal}
                          onChange={(m) => updateCompanion(i, { meal: m })}
                          labels={t.meals}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`companion-diet-${i}`}>{t.dietaryLabel}</Label>
                        <Input
                          id={`companion-diet-${i}`}
                          placeholder={t.dietaryPlaceholder}
                          value={c.dietaryNotes}
                          onChange={(e) => updateCompanion(i, { dietaryNotes: e.target.value })}
                        />
                      </div>
                    </div>
                  ))}

                  {companions.length < 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={addCompanion}
                      className="w-fit justify-self-center gap-3 rounded-full"
                    >
                      <Plus weight="bold" data-icon="inline-start" className="size-4" />
                      {t.addCompanion}
                    </Button>
                  )}
                </div>
              )}
            </div>

            <DrawerFooter>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex gap-2">
                {step === 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setError(null)
                      setStep(0)
                    }}
                    className="h-[46px] rounded-full"
                  >
                    {t.back}
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={pending}
                  className="h-[46px] w-full flex-1 rounded-full bg-ink text-white hover:bg-ink/90"
                >
                  {pending
                    ? t.sending
                    : attending === true && step === 0
                      ? t.next
                      : t.submit}
                </Button>
              </div>
            </DrawerFooter>
          </form>
        )}
      </DrawerContent>
    </Drawer>
  )
}
