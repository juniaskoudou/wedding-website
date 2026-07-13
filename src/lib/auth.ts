import "server-only"
import { cookies } from "next/headers"

export const AUTH_COOKIE = "admin_auth"

// A simple shared-secret token stored in the cookie. Since this is a private
// app with a single password, we store a constant marker and rely on the
// httpOnly cookie being unforgeable without the password.
function authToken(): string {
  return process.env.ADMIN_PASSWORD ?? ""
}

export async function isAuthed(): Promise<boolean> {
  const store = await cookies()
  const value = store.get(AUTH_COOKIE)?.value
  return !!value && value === authToken()
}

export async function requireAuth(): Promise<void> {
  if (!(await isAuthed())) {
    throw new Error("Non autorisé")
  }
}
