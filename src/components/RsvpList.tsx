"use client"

import { useState, useMemo } from "react"
import { useRsvps } from "@/lib/use-rsvps"
import type { Meal, Rsvp, RsvpSubmission } from "@/lib/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import RsvpEditDialog from "@/components/RsvpEditDialog"
import { exportRsvpListPdf } from "@/lib/export-pdf"
import {
  CheckCircle,
  XCircle,
  CaretDown,
  CaretRight,
  Users,
  EnvelopeSimple,
  ChatCircle,
  PencilSimple,
  Trash,
  FilePdf,
} from "@phosphor-icons/react"

const MEAL_LABELS: Record<Meal, string> = {
  fish: "Poisson",
  chicken: "Poulet",
  meat: "Viande",
}

function StatCard({ label, value, sublabel }: { label: string; value: number; sublabel?: string }) {
  return (
    <div className="flex flex-col gap-1 border border-border bg-card px-4 py-3">
      <p className="text-2xl font-semibold leading-none tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground">
        {label}
        {sublabel && <span className="ml-1 text-[0.625rem] opacity-70">({sublabel})</span>}
      </p>
    </div>
  )
}

function RsvpRow({
  rsvp,
  onEdit,
  onDelete,
}: {
  rsvp: Rsvp
  onEdit: () => void
  onDelete: () => void
}) {
  const [open, setOpen] = useState(false)
  const peopleCount = rsvp.attendees.length
  const date = new Date(rsvp.createdAt).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  return (
    <>
      <TableRow className="cursor-pointer" onClick={() => setOpen((o) => !o)}>
        <TableCell className="w-8 px-1 text-muted-foreground">
          {rsvp.attending && peopleCount > 0 ? (
            open ? <CaretDown weight="bold" className="size-3.5" /> : <CaretRight weight="bold" className="size-3.5" />
          ) : null}
        </TableCell>
        <TableCell className="font-medium">{rsvp.name}</TableCell>
        <TableCell>
          {rsvp.attending ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle weight="fill" className="size-3.5" />
              Vient
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500 dark:text-red-400">
              <XCircle weight="fill" className="size-3.5" />
              Absent
            </span>
          )}
        </TableCell>
        <TableCell>
          {rsvp.attending ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Users weight="bold" className="size-3.5" />
              {peopleCount}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground/40">—</span>
          )}
        </TableCell>
        <TableCell className="text-xs text-muted-foreground">{date}</TableCell>
        <TableCell>
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onEdit}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Modifier"
            >
              <PencilSimple weight="bold" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onDelete}
              className="text-muted-foreground hover:text-destructive"
              aria-label="Supprimer"
            >
              <Trash weight="bold" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {open && (
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          <TableCell />
          <TableCell colSpan={5} className="py-3">
            <div className="flex flex-col gap-3 text-sm">
              {rsvp.attending && rsvp.attendees.length > 0 && (
                <ul className="flex flex-col gap-1.5">
                  {rsvp.attendees.map((a) => (
                    <li key={a.id} className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="font-medium">{a.name}</span>
                      {a.isPrimary && (
                        <span className="text-[0.625rem] uppercase tracking-wide text-muted-foreground">
                          principal
                        </span>
                      )}
                      <span className="text-muted-foreground">
                        · {a.meal ? MEAL_LABELS[a.meal] : "Plat non précisé"}
                      </span>
                      {a.dietaryNotes && (
                        <span className="text-amber-600 dark:text-amber-400">
                          · {a.dietaryNotes}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {rsvp.email && (
                <p className="flex items-center gap-1.5 text-muted-foreground">
                  <EnvelopeSimple className="size-3.5" />
                  <a href={`mailto:${rsvp.email}`} className="hover:text-foreground">
                    {rsvp.email}
                  </a>
                </p>
              )}
              {rsvp.message && (
                <p className="flex items-start gap-1.5 text-muted-foreground">
                  <ChatCircle className="mt-0.5 size-3.5 shrink-0" />
                  <span className="italic">“{rsvp.message}”</span>
                </p>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

export default function RsvpList() {
  const { rsvps, loading, error, removeRsvp, updateRsvp } = useRsvps()
  const [editing, setEditing] = useState<Rsvp | null>(null)
  const [deleting, setDeleting] = useState<Rsvp | null>(null)

  const stats = useMemo(() => {
    const total = rsvps.length
    const attendingRsvps = rsvps.filter((r) => r.attending)
    const declined = total - attendingRsvps.length
    const people = attendingRsvps.reduce((acc, r) => acc + r.attendees.length, 0)
    return { total, attending: attendingRsvps.length, declined, people }
  }, [rsvps])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <p className="text-sm text-muted-foreground">Chargement…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <p className="text-sm text-destructive">Erreur de chargement des réponses.</p>
        <p className="text-xs text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Réponses" value={stats.total} sublabel={`${stats.declined} absents`} />
        <StatCard label="Confirmés" value={stats.attending} />
        <StatCard label="Personnes attendues" value={stats.people} />
      </div>

      <div className="flex justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={() => exportRsvpListPdf(rsvps)}
          disabled={rsvps.length === 0}
        >
          <FilePdf weight="bold" data-icon="inline-start" />
          Exporter PDF
        </Button>
      </div>

      {rsvps.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
          <ChatCircle className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">Aucune réponse pour le moment.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 px-1" />
              <TableHead>Nom</TableHead>
              <TableHead>Présence</TableHead>
              <TableHead>Personnes</TableHead>
              <TableHead>Reçu le</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rsvps.map((r) => (
              <RsvpRow
                key={r.id}
                rsvp={r}
                onEdit={() => setEditing(r)}
                onDelete={() => setDeleting(r)}
              />
            ))}
          </TableBody>
        </Table>
      )}

      {editing && (
        <RsvpEditDialog
          key={editing.id}
          rsvp={editing}
          open={true}
          onOpenChange={(open) => { if (!open) setEditing(null) }}
          onSubmit={(submission: RsvpSubmission) => updateRsvp(editing.id, submission)}
        />
      )}

      <Dialog open={!!deleting} onOpenChange={(open) => { if (!open) setDeleting(null) }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Supprimer la réponse</DialogTitle>
            <DialogDescription>
              Voulez-vous vraiment supprimer la réponse de {deleting?.name} ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleting) removeRsvp(deleting.id)
                setDeleting(null)
              }}
            >
              <Trash weight="bold" data-icon="inline-start" />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
