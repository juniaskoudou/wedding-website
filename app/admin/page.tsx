"use client"

import { useState, useMemo } from "react"
import { useGuests } from "@/lib/use-guests"
import { exportGuestListPdf } from "@/lib/export-pdf"
import type { Guest, Spouse, InvitationStatus } from "@/lib/types"
import { DragDropProvider } from "@dnd-kit/react"
import { useSortable, isSortable } from "@dnd-kit/react/sortable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import RsvpList from "@/components/RsvpList"
import {
  Plus,
  Trash,
  Users,
  UserPlus,
  CheckCircle,
  Clock,
  XCircle,
  PencilSimple,
  CaretUp,
  CaretDown,
  DotsSixVertical,
  FilePdf,
  LinkSimple,
} from "@phosphor-icons/react"

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<InvitationStatus, string> = {
  en_attente: "text-amber-600 dark:text-amber-400",
  confirme: "text-emerald-600 dark:text-emerald-400",
  decline: "text-red-500 dark:text-red-400",
}

const STATUS_ICONS: Record<InvitationStatus, typeof Clock> = {
  en_attente: Clock,
  confirme: CheckCircle,
  decline: XCircle,
}

const STATUS_ORDER: Record<InvitationStatus, number> = {
  confirme: 0,
  en_attente: 1,
  decline: 2,
}

const SPOUSE_LABELS: Record<Spouse, string> = {
  epoux: "Junias",
  epouse: "Caroline",
}

// group_id IS the color key — guests sharing the same color are in the same group
const GROUP_COLORS: Record<string, string> = {
  violet:  "bg-violet-500",
  sky:     "bg-sky-500",
  rose:    "bg-rose-500",
  amber:   "bg-amber-500",
  emerald: "bg-emerald-500",
  orange:  "bg-orange-500",
  pink:    "bg-pink-500",
  teal:    "bg-teal-500",
  indigo:  "bg-indigo-500",
  lime:    "bg-lime-500",
}
const GROUP_COLOR_KEYS = Object.keys(GROUP_COLORS)

type SortKey = "name" | "spouse" | "plusOne" | "status" | "group"
type SortDir = "asc" | "desc"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sortGuests(guests: Guest[], key: SortKey | null, dir: SortDir): Guest[] {
  if (!key) return guests
  return [...guests].sort((a, b) => {
    let cmp = 0
    switch (key) {
      case "name": cmp = a.name.localeCompare(b.name, "fr"); break
      case "spouse": cmp = a.spouse.localeCompare(b.spouse); break
      case "plusOne": cmp = Number(a.plusOne) - Number(b.plusOne); break
      case "status": cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]; break
      case "group": cmp = (a.groupId ?? "").localeCompare(b.groupId ?? "", "fr"); break
    }
    return dir === "asc" ? cmp : -cmp
  })
}

function groupColorClass(groupId: string | null): string | null {
  if (!groupId) return null
  return GROUP_COLORS[groupId] ?? null
}

// ─── Small components ─────────────────────────────────────────────────────────

function SortableHead({ label, sortKey, currentKey, currentDir, onSort }: {
  label: string; sortKey: SortKey; currentKey: SortKey | null
  currentDir: SortDir; onSort: (key: SortKey) => void
}) {
  const active = currentKey === sortKey
  return (
    <TableHead className="cursor-pointer select-none hover:text-foreground" onClick={() => onSort(sortKey)}>
      <span className="inline-flex items-center gap-1">
        {label}
        <span className="inline-flex flex-col leading-none">
          <CaretUp weight="fill" className={`size-2.5 ${active && currentDir === "asc" ? "text-foreground" : "text-muted-foreground/30"}`} />
          <CaretDown weight="fill" className={`-mt-0.5 size-2.5 ${active && currentDir === "desc" ? "text-foreground" : "text-muted-foreground/30"}`} />
        </span>
      </span>
    </TableHead>
  )
}

function StatusBadge({ status, onChange }: { status: InvitationStatus; onChange: (s: InvitationStatus) => void }) {
  const Icon = STATUS_ICONS[status]
  return (
    <Select value={status} onValueChange={(v) => onChange(v as InvitationStatus)}>
      <SelectTrigger className="h-8 w-fit gap-1.5 border-0 px-0 text-xs font-medium tracking-normal normal-case">
        <Icon weight="fill" className={`size-3.5 ${STATUS_COLORS[status]}`} />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en_attente">En attente</SelectItem>
        <SelectItem value="confirme">Confirmé</SelectItem>
        <SelectItem value="decline">Décliné</SelectItem>
      </SelectContent>
    </Select>
  )
}

function GroupDot({ colorClass, title }: { colorClass: string; title?: string }) {
  return (
    <span
      title={title}
      className={`inline-block size-2.5 shrink-0 rounded-full ${colorClass}`}
    />
  )
}

function StatCard({ icon: Icon, label, value, sublabel }: {
  icon: typeof Users; label: string; value: number; sublabel?: string
}) {
  return (
    <div className="flex items-center gap-3 border border-border bg-card px-4 py-3">
      <div className="flex size-9 items-center justify-center bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-2xl font-semibold leading-none tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {label}
          {sublabel && <span className="ml-1 text-[0.625rem] opacity-70">({sublabel})</span>}
        </p>
      </div>
    </div>
  )
}

// ─── Sortable row ─────────────────────────────────────────────────────────────

function SortableGuestRow({ guest, index, canDrag, groupColor, onEdit, onRemove, onStatusChange }: {
  guest: Guest; index: number; canDrag: boolean; groupColor: string | null
  onEdit: () => void; onRemove: () => void; onStatusChange: (s: InvitationStatus) => void
}) {
  const { ref, handleRef, isDragging } = useSortable({
    id: guest.id, index, group: "guests", disabled: !canDrag,
  })

  return (
    <TableRow ref={ref} className={isDragging ? "opacity-50" : ""}>
      <TableCell className="w-8 px-1">
        {canDrag ? (
          <button ref={handleRef} className="flex cursor-grab items-center justify-center active:cursor-grabbing" aria-label="Réordonner">
            <DotsSixVertical weight="bold" className="size-4 text-muted-foreground/50" />
          </button>
        ) : <span className="block size-4" />}
      </TableCell>
      <TableCell>
        <span className="inline-flex items-center gap-2 font-medium">
          {guest.name}
          {groupColor && <GroupDot colorClass={groupColor} />}
        </span>
      </TableCell>
      <TableCell>
        <span className="text-xs text-muted-foreground">{SPOUSE_LABELS[guest.spouse]}</span>
      </TableCell>
      <TableCell>
        {guest.plusOne ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <UserPlus weight="bold" className="size-3.5" />Oui
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Non</span>
        )}
      </TableCell>
      <TableCell>
        <StatusBadge status={guest.status} onChange={onStatusChange} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-xs" onClick={onEdit} className="text-muted-foreground hover:text-foreground">
            <PencilSimple weight="bold" />
          </Button>
          <Button variant="ghost" size="icon-xs" onClick={onRemove} className="text-muted-foreground hover:text-destructive">
            <Trash weight="bold" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

// ─── Guest dialog ─────────────────────────────────────────────────────────────

function GuestDialog({ open, onOpenChange, onSubmit, guest, usedColors }: {
  open: boolean; onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<Guest, "id">) => void
  guest?: Guest
  usedColors: Set<string>
}) {
  const isEdit = !!guest
  const [name, setName] = useState(guest?.name ?? "")
  const [plusOne, setPlusOne] = useState(guest?.plusOne ?? false)
  const [spouse, setSpouse] = useState<Spouse>(guest?.spouse ?? "epoux")
  const [status, setStatus] = useState<InvitationStatus>(guest?.status ?? "en_attente")
  const [groupId, setGroupId] = useState<string | null>(guest?.groupId ?? null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), plusOne, spouse, status, groupId })
    if (!isEdit) { setName(""); setPlusOne(false); setGroupId(null) }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier l'invité" : "Ajouter un invité"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Modifiez les informations de cet invité." : "Ajoutez un invité à votre liste de mariage."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="guest-name">Nom de l'invité</Label>
            <Input id="guest-name" placeholder="Jean Dupont" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>

          <div className="grid gap-2">
            <Label>Côté</Label>
            <Select value={spouse} onValueChange={(v) => setSpouse(v as Spouse)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="epoux">Junias</SelectItem>
                <SelectItem value="epouse">Caroline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isEdit && (
            <div className="grid gap-2">
              <Label>Statut</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as InvitationStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="confirme">Confirmé</SelectItem>
                  <SelectItem value="decline">Décliné</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Group color picker */}
          <div className="grid gap-2">
            <Label className="flex items-center gap-1.5">
              <LinkSimple className="size-3.5" />
              Groupe
            </Label>
            <div className="flex flex-wrap gap-2">
              {/* No group option */}
              <button
                type="button"
                title="Aucun groupe"
                onClick={() => setGroupId(null)}
                className={`flex size-7 items-center justify-center rounded-full border-2 transition-colors ${
                  groupId === null
                    ? "border-foreground"
                    : "border-transparent hover:border-muted-foreground/40"
                }`}
              >
                <span className="size-4 rounded-full border border-dashed border-muted-foreground/50" />
              </button>
              {GROUP_COLOR_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  title={key}
                  onClick={() => setGroupId(groupId === key ? null : key)}
                  className={`relative size-7 rounded-full border-2 transition-colors ${GROUP_COLORS[key]} ${
                    groupId === key
                      ? "border-foreground"
                      : "border-transparent hover:border-muted-foreground/40"
                  }`}
                >
                  {usedColors.has(key) && groupId !== key && (
                    <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full border border-background bg-foreground" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-[0.625rem] text-muted-foreground">
              Choisissez une couleur pour regrouper cet invité avec d'autres. Les points noirs indiquent les couleurs déjà utilisées.
            </p>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" checked={plusOne} onChange={(e) => setPlusOne(e.target.checked)} className="size-4 accent-primary" />
            +1 (accompagnant)
          </label>

          <DialogFooter>
            <Button type="submit" disabled={!name.trim()}>
              {isEdit
                ? <><PencilSimple weight="bold" data-icon="inline-start" />Enregistrer</>
                : <><Plus weight="bold" data-icon="inline-start" />Ajouter</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { guests, loading, error, addGuest, removeGuest, updateGuest, setGuestOrder } = useGuests()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [filterSpouse, setFilterSpouse] = useState<"all" | Spouse>("all")
  const [filterStatus, setFilterStatus] = useState<"all" | InvitationStatus>("all")
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>("asc")

  const isFiltered = filterSpouse !== "all" || filterStatus !== "all"

  // Colors already in use in the current guest list (to hint the picker)
  const usedColors = useMemo(() => {
    const s = new Set<string>()
    for (const g of guests) { if (g.groupId) s.add(g.groupId) }
    return s
  }, [guests])

  function handleSort(key: SortKey) {
    let nextKey: SortKey | null
    let nextDir: SortDir
    if (sortKey === key) {
      if (sortDir === "asc") { nextKey = key; nextDir = "desc" }
      else { nextKey = null; nextDir = "asc" }
    } else { nextKey = key; nextDir = "asc" }
    setSortKey(nextKey)
    setSortDir(nextDir)
    if (nextKey) setGuestOrder(sortGuests(guests, nextKey, nextDir))
  }

  function handleDragReorder(fromIndex: number, toIndex: number) {
    const next = [...guests]
    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)
    setGuestOrder(next)
  }

  const filtered = useMemo(() => {
    const list = guests.filter((g) => {
      if (filterSpouse !== "all" && g.spouse !== filterSpouse) return false
      if (filterStatus !== "all" && g.status !== filterStatus) return false
      return true
    })

    // Cluster guests with the same groupId together while preserving relative
    // order. Ungrouped guests stay in place; when the first member of a group
    // is encountered, all other members are pulled up right after it.
    const seen = new Set<string>()
    const result: Guest[] = []
    const byGroup = new Map<string, Guest[]>()
    for (const g of list) {
      if (g.groupId) {
        const arr = byGroup.get(g.groupId) ?? []
        arr.push(g)
        byGroup.set(g.groupId, arr)
      }
    }
    for (const g of list) {
      if (!g.groupId) {
        result.push(g)
      } else if (!seen.has(g.groupId)) {
        seen.add(g.groupId)
        result.push(...(byGroup.get(g.groupId) ?? []))
      }
    }
    return result
  }, [guests, filterSpouse, filterStatus])

  const stats = useMemo(() => {
    const totalGuests = guests.length
    const totalPlusOnes = guests.filter((g) => g.plusOne).length
    const totalPersonnes = totalGuests + totalPlusOnes
    const confirmes = guests.filter((g) => g.status === "confirme").length
    const confirmesPlusOnes = guests.filter((g) => g.status === "confirme" && g.plusOne).length
    return { totalGuests, totalPlusOnes, totalPersonnes, confirmes, totalConfirmesPersonnes: confirmes + confirmesPlusOnes }
  }, [guests])

  return (
    <div className="mx-auto flex min-h-svh max-w-4xl flex-col gap-8 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-normal tracking-tight">Administration</h1>
        <p className="text-sm text-muted-foreground">Gérez votre liste d'invités et les réponses RSVP.</p>
      </header>

      <Tabs defaultValue="guests" className="flex flex-col gap-6">
        <TabsList>
          <TabsTrigger value="guests">Invités</TabsTrigger>
          <TabsTrigger value="rsvp">Réponses RSVP</TabsTrigger>
        </TabsList>

        <TabsContent value="guests" className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={Users} label="Invités" value={stats.totalGuests} sublabel={`${stats.totalPlusOnes} +1`} />
        <StatCard icon={UserPlus} label="Total personnes" value={stats.totalPersonnes} />
        <StatCard icon={CheckCircle} label="Confirmés" value={stats.totalConfirmesPersonnes} sublabel={`${stats.confirmes} invités`} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={filterSpouse} onValueChange={(v) => setFilterSpouse(v as "all" | Spouse)}>
              <SelectTrigger className="h-9 w-fit min-w-[8rem] border-b-border text-xs tracking-normal normal-case"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les côtés</SelectItem>
                <SelectItem value="epoux">Côté Junias</SelectItem>
                <SelectItem value="epouse">Côté Caroline</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as "all" | InvitationStatus)}>
              <SelectTrigger className="h-9 w-fit min-w-[8rem] border-b-border text-xs tracking-normal normal-case"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="confirme">Confirmé</SelectItem>
                <SelectItem value="decline">Décliné</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => exportGuestListPdf(filtered)} disabled={filtered.length === 0 || loading}>
              <FilePdf weight="bold" data-icon="inline-start" />Exporter PDF
            </Button>
            <Button size="sm" onClick={() => setDialogOpen(true)}>
              <Plus weight="bold" data-icon="inline-start" />Ajouter un invité
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <p className="text-sm text-muted-foreground">Chargement…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <p className="text-sm text-destructive">Erreur de connexion à la base de données.</p>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
            <Users className="size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              {guests.length === 0 ? "Aucun invité pour le moment." : "Aucun invité ne correspond aux filtres."}
            </p>
            {guests.length === 0 && (
              <Button variant="outline" size="sm" className="mt-2" onClick={() => setDialogOpen(true)}>
                <Plus weight="bold" data-icon="inline-start" />Ajouter votre premier invité
              </Button>
            )}
          </div>
        ) : (
          <DragDropProvider
            onDragEnd={(event) => {
              if (event.canceled || isFiltered) return
              const { source } = event.operation
              if (source && isSortable(source) && source.initialIndex !== source.index) {
                handleDragReorder(source.initialIndex, source.index)
              }
            }}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8 px-1" />
                  <SortableHead label="Nom" sortKey="name" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                  <SortableHead label="Côté" sortKey="spouse" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                  <SortableHead label="+1" sortKey="plusOne" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                  <SortableHead label="Statut" sortKey="status" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((guest, index) => (
                  <SortableGuestRow
                    key={guest.id}
                    guest={guest}
                    index={index}
                    canDrag={!isFiltered}
                    groupColor={groupColorClass(guest.groupId)}
                    onEdit={() => setEditingGuest(guest)}
                    onRemove={() => removeGuest(guest.id)}
                    onStatusChange={(s) => updateGuest(guest.id, { status: s })}
                  />
                ))}
              </TableBody>
            </Table>
          </DragDropProvider>
        )}

        {filtered.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {filtered.length} invité{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""} ·{" "}
            {filtered.reduce((acc, g) => acc + 1 + (g.plusOne ? 1 : 0), 0)} personnes au total
          </p>
        )}
      </div>
        </TabsContent>

        <TabsContent value="rsvp">
          <RsvpList />
        </TabsContent>
      </Tabs>

      <GuestDialog
        key="add"
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={addGuest}
        usedColors={usedColors}
      />

      {editingGuest && (
        <GuestDialog
          key={editingGuest.id}
          open={true}
          onOpenChange={(open) => { if (!open) setEditingGuest(null) }}
          onSubmit={(data) => updateGuest(editingGuest.id, data)}
          guest={editingGuest}
          usedColors={usedColors}
        />
      )}
    </div>
  )
}
