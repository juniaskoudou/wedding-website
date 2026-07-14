import "server-only"
import { neon } from "@neondatabase/serverless"
import type { Meal, Rsvp, RsvpAttendee, RsvpSubmission, Locale } from "./types"

const sql = neon(process.env.DATABASE_URL!)

type RsvpRow = {
  id: string
  created_at: string
  name: string
  email: string | null
  attending: boolean
  message: string | null
  locale: string
}

type AttendeeRow = {
  id: string
  rsvp_id: string
  name: string
  meal: string | null
  dietary_notes: string | null
  is_primary: boolean
}

function rowToAttendee(row: AttendeeRow): RsvpAttendee {
  return {
    id: row.id,
    name: row.name,
    meal: (row.meal as Meal | null) ?? null,
    dietaryNotes: row.dietary_notes,
    isPrimary: row.is_primary,
  }
}

export async function insertRsvp(submission: RsvpSubmission): Promise<string> {
  const id = crypto.randomUUID()
  await sql`
    INSERT INTO rsvps (id, name, email, attending, message, locale)
    VALUES (
      ${id},
      ${submission.name},
      ${submission.email},
      ${submission.attending},
      ${submission.message},
      ${submission.locale}
    )
  `

  for (const a of submission.attendees) {
    await sql`
      INSERT INTO rsvp_attendees (id, rsvp_id, name, meal, dietary_notes, is_primary)
      VALUES (
        ${crypto.randomUUID()},
        ${id},
        ${a.name},
        ${a.meal},
        ${a.dietaryNotes},
        ${a.isPrimary}
      )
    `
  }

  return id
}

export async function updateRsvp(id: string, submission: RsvpSubmission): Promise<void> {
  await sql`
    UPDATE rsvps
    SET name = ${submission.name},
        email = ${submission.email},
        attending = ${submission.attending},
        message = ${submission.message},
        locale = ${submission.locale}
    WHERE id = ${id}
  `

  // Replace attendees wholesale — simplest correct approach for edits.
  await sql`DELETE FROM rsvp_attendees WHERE rsvp_id = ${id}`
  for (const a of submission.attendees) {
    await sql`
      INSERT INTO rsvp_attendees (id, rsvp_id, name, meal, dietary_notes, is_primary)
      VALUES (
        ${crypto.randomUUID()},
        ${id},
        ${a.name},
        ${a.meal},
        ${a.dietaryNotes},
        ${a.isPrimary}
      )
    `
  }
}

export async function deleteRsvp(id: string): Promise<void> {
  await sql`DELETE FROM rsvps WHERE id = ${id}`
}

export async function fetchRsvps(): Promise<Rsvp[]> {
  const rsvpRows = (await sql`
    SELECT id, created_at, name, email, attending, message, locale
    FROM rsvps
    ORDER BY created_at DESC
  `) as RsvpRow[]

  if (rsvpRows.length === 0) return []

  const attendeeRows = (await sql`
    SELECT id, rsvp_id, name, meal, dietary_notes, is_primary
    FROM rsvp_attendees
  `) as AttendeeRow[]

  const byRsvp = new Map<string, RsvpAttendee[]>()
  for (const row of attendeeRows) {
    const arr = byRsvp.get(row.rsvp_id) ?? []
    arr.push(rowToAttendee(row))
    byRsvp.set(row.rsvp_id, arr)
  }

  return rsvpRows.map((r) => ({
    id: r.id,
    createdAt: r.created_at,
    name: r.name,
    email: r.email,
    attending: r.attending,
    message: r.message,
    locale: (r.locale as Locale) ?? "fr",
    attendees: (byRsvp.get(r.id) ?? []).sort(
      (a, b) => Number(b.isPrimary) - Number(a.isPrimary)
    ),
  }))
}
