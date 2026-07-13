"use server"

import type { Guest } from "./types"
import {
  fetchGuests,
  insertGuest,
  updateGuest as dbUpdateGuest,
  deleteGuest,
  saveGuestOrder,
} from "./db"
import { requireAuth } from "./auth"

export async function getGuestsAction(): Promise<Guest[]> {
  await requireAuth()
  return fetchGuests()
}

export async function addGuestAction(guest: Guest, sortOrder: number): Promise<void> {
  await requireAuth()
  await insertGuest(guest, sortOrder)
}

export async function removeGuestAction(id: string): Promise<void> {
  await requireAuth()
  await deleteGuest(id)
}

export async function updateGuestAction(
  id: string,
  updates: Partial<Omit<Guest, "id">>
): Promise<void> {
  await requireAuth()
  await dbUpdateGuest(id, updates)
}

export async function saveGuestOrderAction(guests: Guest[]): Promise<void> {
  await requireAuth()
  await saveGuestOrder(guests)
}
