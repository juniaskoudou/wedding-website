export type Spouse = "epoux" | "epouse"

export type InvitationStatus = "en_attente" | "confirme" | "decline"

export interface Guest {
  id: string
  name: string
  plusOne: boolean
  spouse: Spouse
  status: InvitationStatus
  groupId: string | null
}

export type Meal = "fish" | "chicken" | "meat"

export type Locale = "fr" | "en"

export interface RsvpAttendee {
  id: string
  name: string
  meal: Meal | null
  dietaryNotes: string | null
  isPrimary: boolean
}

export interface Rsvp {
  id: string
  createdAt: string
  name: string
  email: string | null
  attending: boolean
  message: string | null
  locale: Locale
  attendees: RsvpAttendee[]
}

// Payload sent from the public form (no ids yet)
export interface RsvpSubmission {
  name: string
  email: string | null
  attending: boolean
  message: string | null
  locale: Locale
  attendees: {
    name: string
    meal: Meal | null
    dietaryNotes: string | null
    isPrimary: boolean
  }[]
}
