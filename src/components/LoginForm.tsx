"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LockSimple } from "@phosphor-icons/react"
import { loginAction } from "@/lib/auth-actions"

export default function LoginForm() {
  const router = useRouter()
  const [value, setValue] = useState("")
  const [error, setError] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const res = await loginAction(value)
      if (res.ok) {
        router.refresh()
      } else {
        setError(true)
        setValue("")
      }
    })
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <LockSimple weight="bold" className="size-5 text-muted-foreground" />
          </div>
          <h1 className="font-display text-xl font-normal">Accès backoffice</h1>
          <p className="text-sm text-muted-foreground">Entrez le mot de passe pour continuer.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="password"
            placeholder="Mot de passe"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false) }}
            autoFocus
            className={error ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {error && (
            <p className="text-xs text-destructive">Mot de passe incorrect.</p>
          )}
          <Button type="submit" className="w-full" disabled={!value || pending}>
            {pending ? "Vérification…" : "Accéder"}
          </Button>
        </form>
      </div>
    </div>
  )
}
