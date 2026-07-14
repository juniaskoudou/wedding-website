import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import type { Guest, InvitationStatus, Meal, Rsvp, Spouse } from "./types"

const STATUS_LABELS: Record<InvitationStatus, string> = {
  en_attente: "En attente",
  confirme: "Confirmé",
  decline: "Décliné",
}

const SPOUSE_LABELS: Record<Spouse, string> = {
  epoux: "Junias",
  epouse: "Caroline",
}

// group_id is the color key — map directly to RGB
const GROUP_COLOR_RGB: Record<string, [number, number, number]> = {
  violet:  [139, 92,  246],
  sky:     [14,  165, 233],
  rose:    [244, 63,  94],
  amber:   [245, 158, 11],
  emerald: [16,  185, 129],
  orange:  [249, 115, 22],
  pink:    [236, 72,  153],
  teal:    [20,  184, 166],
  indigo:  [99,  102, 241],
  lime:    [132, 204, 22],
}

// guests is already filtered + sorted by the caller
export function exportGuestListPdf(guests: Guest[]) {
  const doc = new jsPDF()

  const totalGuests = guests.length
  const totalPlusOnes = guests.filter((g) => g.plusOne).length
  const totalPersonnes = totalGuests + totalPlusOnes
  const confirmes = guests.filter((g) => g.status === "confirme").length
  const enAttente = guests.filter((g) => g.status === "en_attente").length
  const declines = guests.filter((g) => g.status === "decline").length

  doc.setFontSize(20)
  doc.text("Liste des invités", 14, 20)

  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(
    `${totalGuests} invités · ${totalPlusOnes} +1 · ${totalPersonnes} personnes au total`,
    14, 28,
  )
  doc.text(
    `${confirmes} confirmés · ${enAttente} en attente · ${declines} déclinés`,
    14, 34,
  )
  doc.setTextColor(0)

  const DOT_R = 1.4

  autoTable(doc, {
    startY: 42,
    head: [["#", "Nom", "Côté", "+1", "Statut"]],
    body: guests.map((g, i) => [
      i + 1,
      g.name,
      SPOUSE_LABELS[g.spouse],
      g.plusOne ? "Oui" : "Non",
      STATUS_LABELS[g.status],
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: {
      fillColor: [30, 30, 30],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: {
      0: { cellWidth: 12, halign: "center" },
      2: { cellWidth: 25 },
      3: { cellWidth: 15, halign: "center" },
      4: { cellWidth: 28 },
    },
    didDrawCell(data) {
      // Draw colored dot after the name text in column 1 (Nom)
      if (data.section !== "body" || data.column.index !== 1) return
      const guest = guests[data.row.index]
      if (!guest?.groupId) return
      const color = GROUP_COLOR_RGB[guest.groupId]
      if (!color) return

      const nameWidth = doc.getTextWidth(guest.name)
      const dotX = data.cell.x + data.cell.padding("left") + nameWidth + DOT_R + 1.5
      const dotY = data.cell.y + data.cell.height / 2

      doc.setFillColor(color[0], color[1], color[2])
      doc.circle(dotX, dotY, DOT_R, "F")
    },
  })

  const date = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric",
  })

  doc.save(`invites-mariage-${date}.pdf`)
}

const MEAL_LABELS: Record<Meal, string> = {
  fish: "Poisson",
  chicken: "Poulet",
  meat: "Viande",
}

function attendeesSummary(rsvp: Rsvp): string {
  if (!rsvp.attending || rsvp.attendees.length === 0) return "—"
  return rsvp.attendees
    .map((a) => {
      const meal = a.meal ? MEAL_LABELS[a.meal] : "—"
      const diet = a.dietaryNotes ? ` (${a.dietaryNotes})` : ""
      return `${a.name} : ${meal}${diet}`
    })
    .join("\n")
}

// rsvps is already ordered by the caller (most recent first)
export function exportRsvpListPdf(rsvps: Rsvp[]) {
  const doc = new jsPDF()

  const total = rsvps.length
  const attending = rsvps.filter((r) => r.attending)
  const declined = total - attending.length
  const people = attending.reduce((acc, r) => acc + r.attendees.length, 0)

  doc.setFontSize(20)
  doc.text("Réponses RSVP", 14, 20)

  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(
    `${total} réponse${total > 1 ? "s" : ""} · ${attending.length} confirmée${attending.length > 1 ? "s" : ""} · ${declined} absent${declined > 1 ? "s" : ""}`,
    14, 28,
  )
  doc.text(`${people} personne${people > 1 ? "s" : ""} attendue${people > 1 ? "s" : ""}`, 14, 34)
  doc.setTextColor(0)

  autoTable(doc, {
    startY: 42,
    head: [["#", "Nom", "Présence", "Pers.", "Détails (plats)", "Message"]],
    body: rsvps.map((r, i) => [
      i + 1,
      r.email ? `${r.name}\n${r.email}` : r.name,
      r.attending ? "Vient" : "Absent",
      r.attending ? String(r.attendees.length) : "—",
      attendeesSummary(r),
      r.message ?? "",
    ]),
    styles: { fontSize: 8, cellPadding: 3, valign: "top" },
    headStyles: {
      fillColor: [30, 30, 30],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 38 },
      2: { cellWidth: 18 },
      3: { cellWidth: 12, halign: "center" },
      4: { cellWidth: 55 },
      5: { cellWidth: 49 },
    },
  })

  const date = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric",
  })

  doc.save(`rsvp-mariage-${date}.pdf`)
}
