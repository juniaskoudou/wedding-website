"use client"

import { useState, useEffect } from "react"
import type { Rsvp } from "./types"
import { getRsvpsAction } from "./rsvp-actions"

export function useRsvps() {
  const [rsvps, setRsvps] = useState<Rsvp[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getRsvpsAction()
      .then(setRsvps)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  return { rsvps, loading, error }
}
