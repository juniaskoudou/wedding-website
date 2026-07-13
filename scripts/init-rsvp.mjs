import { neon } from "@neondatabase/serverless"
import { readFileSync } from "node:fs"

// Load DATABASE_URL from .env
const env = readFileSync(new URL("../.env", import.meta.url), "utf8")
const match = env.match(/^DATABASE_URL=(.+)$/m)
if (!match) {
  console.error("DATABASE_URL not found in .env")
  process.exit(1)
}
const sql = neon(match[1].trim())

await sql`
  CREATE TABLE IF NOT EXISTS rsvps (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    email TEXT,
    attending BOOLEAN NOT NULL,
    message TEXT,
    locale TEXT NOT NULL DEFAULT 'fr'
  )
`
await sql`
  CREATE TABLE IF NOT EXISTS rsvp_attendees (
    id TEXT PRIMARY KEY,
    rsvp_id TEXT NOT NULL REFERENCES rsvps(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    meal TEXT,
    dietary_notes TEXT,
    is_primary BOOLEAN NOT NULL DEFAULT false
  )
`
await sql`CREATE INDEX IF NOT EXISTS idx_rsvp_attendees_rsvp_id ON rsvp_attendees(rsvp_id)`
await sql`CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps(created_at DESC)`

console.log("RSVP tables ready.")
