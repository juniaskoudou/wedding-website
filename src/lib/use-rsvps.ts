"use client"

import { useState, useEffect, useCallback } from "react"
import type { Rsvp, RsvpSubmission } from "./types"
import {
  getRsvpsAction,
  updateRsvpAction,
  deleteRsvpAction,
} from "./rsvp-actions"

export function useRsvps() {
  const [rsvps, setRsvps] = useState<Rsvp[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    return getRsvpsAction()
      .then(setRsvps)
      .catch((e) => setError(String(e)))
  }, [])

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [load])

  const removeRsvp = useCallback(async (id: string) => {
    setRsvps((prev) => prev.filter((r) => r.id !== id))
    deleteRsvpAction(id).catch(console.error)
  }, [])

  const updateRsvp = useCallback(
    async (id: string, submission: RsvpSubmission) => {
      const res = await updateRsvpAction(id, submission)
      if (res.ok) await load()
      return res
    },
    [load]
  )

  return { rsvps, loading, error, removeRsvp, updateRsvp }
}
