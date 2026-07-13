import "server-only"
import { Resend } from "resend"
import type { Meal, RsvpSubmission } from "./types"

const MEAL_LABELS: Record<Meal, string> = {
  fish: "Poisson",
  chicken: "Poulet",
  meat: "Viande",
}

const NOTIFY_EMAIL = process.env.RSVP_NOTIFY_EMAIL ?? "juniascaroline0@gmail.com"
const FROM_EMAIL = process.env.RESEND_FROM ?? "onboarding@resend.dev"

// Sends a notification to the couple when a new RSVP arrives.
// If RESEND_API_KEY is not configured, this is a no-op (logged) so that the
// RSVP submission itself still succeeds.
export async function sendRsvpNotification(rsvp: RsvpSubmission): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping RSVP notification")
    return
  }

  const resend = new Resend(apiKey)

  const attendingLine = rsvp.attending
    ? `Présence : OUI (${rsvp.attendees.length} personne${rsvp.attendees.length > 1 ? "s" : ""})`
    : "Présence : NON"

  const attendeeLines = rsvp.attendees
    .map((a) => {
      const meal = a.meal ? MEAL_LABELS[a.meal] : "—"
      const diet = a.dietaryNotes ? ` · Régime : ${a.dietaryNotes}` : ""
      const tag = a.isPrimary ? " (principal)" : ""
      return `  • ${a.name}${tag} — Plat : ${meal}${diet}`
    })
    .join("\n")

  const text = [
    `Nouvelle réponse RSVP de ${rsvp.name}`,
    "",
    attendingLine,
    rsvp.email ? `Email : ${rsvp.email}` : null,
    rsvp.attendees.length > 0 ? "\nInvités :" : null,
    rsvp.attendees.length > 0 ? attendeeLines : null,
    rsvp.message ? `\nMessage : ${rsvp.message}` : null,
  ]
    .filter(Boolean)
    .join("\n")

  try {
    await resend.emails.send({
      from: `Mariage RSVP <${FROM_EMAIL}>`,
      to: NOTIFY_EMAIL,
      replyTo: rsvp.email ?? undefined,
      subject: `RSVP : ${rsvp.name} — ${rsvp.attending ? "vient" : "ne vient pas"}`,
      text,
    })
  } catch (err) {
    console.error("[email] Failed to send RSVP notification:", err)
  }
}
