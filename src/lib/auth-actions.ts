"use server"

import { cookies } from "next/headers"
import { AUTH_COOKIE } from "./auth"

export async function loginAction(password: string): Promise<{ ok: boolean }> {
  const expected = process.env.ADMIN_PASSWORD ?? ""
  if (!password || password !== expected) {
    return { ok: false }
  }
  const store = await cookies()
  store.set(AUTH_COOKIE, expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
  return { ok: true }
}

export async function logoutAction(): Promise<void> {
  const store = await cookies()
  store.delete(AUTH_COOKIE)
}
