"use client"

import { useState, useEffect, useCallback } from "react"
import type { Guest } from "./types"
import {
  getGuestsAction,
  addGuestAction,
  updateGuestAction as dbUpdateGuest,
  removeGuestAction,
  saveGuestOrderAction,
} from "./guest-actions"

export function useGuests() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getGuestsAction()
      .then(setGuests)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  const addGuest = useCallback(async (guest: Omit<Guest, "id">) => {
    const newGuest: Guest = { ...guest, id: crypto.randomUUID() }
    setGuests((prev) => {
      const next = [...prev, newGuest]
      addGuestAction(newGuest, next.length - 1).catch(console.error)
      return next
    })
  }, [])

  const removeGuest = useCallback(async (id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id))
    removeGuestAction(id).catch(console.error)
  }, [])

  const updateGuest = useCallback(async (id: string, updates: Partial<Omit<Guest, "id">>) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    )
    dbUpdateGuest(id, updates).catch(console.error)
  }, [])

  const setGuestOrder = useCallback((reordered: Guest[]) => {
    setGuests(reordered)
    saveGuestOrderAction(reordered).catch(console.error)
  }, [])

  return { guests, loading, error, addGuest, removeGuest, updateGuest, setGuestOrder }
}
