"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, Trash } from "@phosphor-icons/react"
import type { Meal, Rsvp, RsvpSubmission } from "@/lib/types"

const MEALS: Meal[] = ["fish", "chicken", "meat"]
const MEAL_LABELS: Record<Meal, string> = {
  fish: "Poisson",
  chicken: "Poulet",
  meat: "Viande",
}

type Companion = { name: string; meal: Meal | null; dietaryNotes: string }

function MealPicker({
  value,
  onChange,
}: {
  value: Meal | null
  onChange: (m: Meal) => void
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
          {MEAL_LABELS[m]}
        </button>
      ))}
    </div>
  )
}

export default function RsvpEditDialog({
  rsvp,
  open,
  onOpenChange,
  onSubmit,
}: {
  rsvp: Rsvp
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (submission: RsvpSubmission) => Promise<{ ok: boolean; error?: string }>
}) {
  const primary = rsvp.attendees.find((a) => a.isPrimary)
  const [name, setName] = useState(rsvp.name)
  const [email, setEmail] = useState(rsvp.email ?? "")
  const [attending, setAttending] = useState(rsvp.attending)
  const [message, setMessage] = useState(rsvp.message ?? "")
  const [primaryMeal, setPrimaryMeal] = useState<Meal | null>(primary?.meal ?? null)
  const [primaryDiet, setPrimaryDiet] = useState(primary?.dietaryNotes ?? "")
  const [companions, setCompanions] = useState<Companion[]>(
    rsvp.attendees
      .filter((a) => !a.isPrimary)
      .map((a) => ({ name: a.name, meal: a.meal, dietaryNotes: a.dietaryNotes ?? "" }))
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function addCompanion() {
    setCompanions((prev) => [...prev, { name: "", meal: null, dietaryNotes: "" }])
  }
  function updateCompanion(i: number, patch: Partial<Companion>) {
    setCompanions((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)))
  }
  function removeCompanion(i: number) {
    setCompanions((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!name.trim()) {
      setError("Veuillez indiquer le nom.")
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
      locale: rsvp.locale,
      attendees,
    }

    setSaving(true)
    const res = await onSubmit(submission)
    setSaving(false)
    if (res.ok) {
      onOpenChange(false)
    } else {
      setError("Une erreur est survenue. Veuillez réessayer.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier la réponse</DialogTitle>
          <DialogDescription>Modifiez les informations de cette réponse RSVP.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Nom</Label>
            <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Présence</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAttending(true)}
                className={`border px-4 py-2.5 text-sm transition-colors ${
                  attending
                    ? "border-foreground bg-foreground text-background"
                    : "border-input text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                Vient
              </button>
              <button
                type="button"
                onClick={() => setAttending(false)}
                className={`border px-4 py-2.5 text-sm transition-colors ${
                  !attending
                    ? "border-foreground bg-foreground text-background"
                    : "border-input text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                Absent
              </button>
            </div>
          </div>

          {attending && (
            <>
              <div className="grid gap-2">
                <Label>Plat (invité principal)</Label>
                <MealPicker value={primaryMeal} onChange={setPrimaryMeal} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-diet">Allergies / régime (optionnel)</Label>
                <Input
                  id="edit-diet"
                  value={primaryDiet}
                  onChange={(e) => setPrimaryDiet(e.target.value)}
                />
              </div>

              <div className="grid gap-3">
                <Label>Accompagnants</Label>
                {companions.map((c, i) => (
                  <div key={i} className="grid gap-3 border border-border p-3">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Nom de l'accompagnant"
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
                        aria-label="Retirer"
                      >
                        <Trash weight="bold" />
                      </Button>
                    </div>
                    <MealPicker value={c.meal} onChange={(m) => updateCompanion(i, { meal: m })} />
                    <Input
                      placeholder="Allergies / régime (optionnel)"
                      value={c.dietaryNotes}
                      onChange={(e) => updateCompanion(i, { dietaryNotes: e.target.value })}
                    />
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addCompanion} className="w-fit">
                  <Plus weight="bold" data-icon="inline-start" />
                  Ajouter un accompagnant
                </Button>
              </div>
            </>
          )}

          <div className="grid gap-2">
            <Label htmlFor="edit-email">Email (optionnel)</Label>
            <Input
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-message">Message (optionnel)</Label>
            <Textarea
              id="edit-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={saving || !name.trim()}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
