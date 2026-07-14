"use server"

import type { Rsvp, RsvpSubmission, Meal } from "./types"
import { insertRsvp, fetchRsvps, updateRsvp, deleteRsvp } from "./rsvp-db"
import { sendRsvpNotification } from "./email"
import { requireAuth } from "./auth"

const VALID_MEALS: Meal[] = ["fish", "chicken", "meat"]

function sanitizeMeal(meal: unknown): Meal | null {
  return VALID_MEALS.includes(meal as Meal) ? (meal as Meal) : null
}

type NormalizeResult =
  | { ok: true; submission: RsvpSubmission }
  | { ok: false; error: string }

function normalizeSubmission(input: RsvpSubmission): NormalizeResult {
  const name = input.name?.trim()
  if (!name) return { ok: false, error: "name" }
  if (typeof input.attending !== "boolean") return { ok: false, error: "attending" }

  const locale = input.locale === "en" ? "en" : "fr"

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

  return {
    ok: true,
    submission: {
      name,
      email: input.email?.trim() || null,
      attending: input.attending,
      message: input.message?.trim() || null,
      locale,
      attendees,
    },
  }
}

// Public action — no auth. Validates and stores an RSVP, then notifies.
export async function submitRsvpAction(
  input: RsvpSubmission
): Promise<{ ok: boolean; error?: string }> {
  const result = normalizeSubmission(input)
  if (!result.ok) return { ok: false, error: result.error }

  try {
    await insertRsvp(result.submission)
  } catch (err) {
    console.error("[rsvp] insert failed:", err)
    return { ok: false, error: "generic" }
  }

  // Fire notification but don't fail the RSVP if email errors.
  await sendRsvpNotification(result.submission)

  return { ok: true }
}

// Admin action — requires auth.
export async function getRsvpsAction(): Promise<Rsvp[]> {
  await requireAuth()
  return fetchRsvps()
}

// Admin action — edit an existing RSVP.
export async function updateRsvpAction(
  id: string,
  input: RsvpSubmission
): Promise<{ ok: boolean; error?: string }> {
  await requireAuth()
  const result = normalizeSubmission(input)
  if (!result.ok) return { ok: false, error: result.error }

  try {
    await updateRsvp(id, result.submission)
  } catch (err) {
    console.error("[rsvp] update failed:", err)
    return { ok: false, error: "generic" }
  }
  return { ok: true }
}

// Admin action — delete an RSVP.
export async function deleteRsvpAction(id: string): Promise<void> {
  await requireAuth()
  await deleteRsvp(id)
}
