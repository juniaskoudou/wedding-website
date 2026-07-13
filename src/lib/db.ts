import "server-only"
import { neon } from "@neondatabase/serverless"
import type { Guest, InvitationStatus, Spouse } from "./types"

const sql = neon(process.env.DATABASE_URL!)

type DbRow = {
  id: string
  name: string
  plus_one: boolean
  spouse: Spouse
  status: InvitationStatus
  sort_order: number
  group_id: string | null
}

function rowToGuest(row: DbRow): Guest {
  return {
    id: row.id,
    name: row.name,
    plusOne: row.plus_one,
    spouse: row.spouse,
    status: row.status,
    groupId: row.group_id ?? null,
  }
}

export async function fetchGuests(): Promise<Guest[]> {
  const rows = await sql`
    SELECT id, name, plus_one, spouse, status, sort_order, group_id
    FROM guests
    ORDER BY sort_order ASC
  ` as DbRow[]
  return rows.map(rowToGuest)
}

export async function insertGuest(guest: Guest, sortOrder: number): Promise<void> {
  await sql`
    INSERT INTO guests (id, name, plus_one, spouse, status, sort_order, group_id)
    VALUES (
      ${guest.id},
      ${guest.name},
      ${guest.plusOne},
      ${guest.spouse},
      ${guest.status},
      ${sortOrder},
      ${guest.groupId}
    )
  `
}

export async function updateGuest(id: string, updates: Partial<Omit<Guest, "id">>): Promise<void> {
  if (updates.name !== undefined) {
    await sql`UPDATE guests SET name = ${updates.name} WHERE id = ${id}`
  }
  if (updates.plusOne !== undefined) {
    await sql`UPDATE guests SET plus_one = ${updates.plusOne} WHERE id = ${id}`
  }
  if (updates.spouse !== undefined) {
    await sql`UPDATE guests SET spouse = ${updates.spouse} WHERE id = ${id}`
  }
  if (updates.status !== undefined) {
    await sql`UPDATE guests SET status = ${updates.status} WHERE id = ${id}`
  }
  if (updates.groupId !== undefined) {
    await sql`UPDATE guests SET group_id = ${updates.groupId} WHERE id = ${id}`
  }
}

export async function deleteGuest(id: string): Promise<void> {
  await sql`DELETE FROM guests WHERE id = ${id}`
}

export async function saveGuestOrder(guests: Guest[]): Promise<void> {
  await Promise.all(
    guests.map((g, i) =>
      sql`UPDATE guests SET sort_order = ${i} WHERE id = ${g.id}`
    )
  )
}
