"use server"

import type { Rsvp, RsvpSubmission, Meal } from "./types"
import { insertRsvp, fetchRsvps } from "./rsvp-db"
import { sendRsvpNotification } from "./email"
import { requireAuth } from "./auth"

const VALID_MEALS: Meal[] = ["fish", "chicken", "meat"]

function sanitizeMeal(meal: unknown): Meal | null {
  return VALID_MEALS.includes(meal as Meal) ? (meal as Meal) : null
}

// Public action — no auth. Validates and stores an RSVP, then notifies.
export async function submitRsvpAction(
  input: RsvpSubmission
): Promise<{ ok: boolean; error?: string }> {
  const name = input.name?.trim()
  if (!name) {
    return { ok: false, error: "name" }
  }
  if (typeof input.attending !== "boolean") {
    return { ok: false, error: "attending" }
  }

  const locale = input.locale === "en" ? "en" : "fr"

  // Only keep attendees when the guest is attending; always include the primary.
  const attendees = input.attending
    ? input.attendees
        .map((a) => ({
          name: a.name?.trim() || name,
          meal: sanitizeMeal(a.meal),
          dietaryNotes: a.dietaryNotes?.trim() || null,
          isPrimary: !!a.isPrimary,
        }))
        .filter((a) => a.name.length > 0)
    : []

  const submission: RsvpSubmission = {
    name,
    email: input.email?.trim() || null,
    attending: input.attending,
    message: input.message?.trim() || null,
    locale,
    attendees,
  }

  try {
    await insertRsvp(submission)
  } catch (err) {
    console.error("[rsvp] insert failed:", err)
    return { ok: false, error: "generic" }
  }

  // Fire notification but don't fail the RSVP if email errors.
  await sendRsvpNotification(submission)

  return { ok: true }
}

// Admin action — requires auth.
export async function getRsvpsAction(): Promise<Rsvp[]> {
  await requireAuth()
  return fetchRsvps()
}
