import type { Locale } from "./types"

export const LOCALES: Locale[] = ["fr", "en"]

export function resolveLocale(input: string | null | undefined): Locale {
  if (!input) return "en"
  const lower = input.toLowerCase()
  if (lower.startsWith("fr")) return "fr"
  if (lower.startsWith("en")) return "en"
  return "en"
}

export interface Dictionary {
  landing: {
    hero: {
      venue: string
      date: string
    }
    story: {
      intro: {
        before: string
        highlight: string
        afterLine1: string
        line2: string
      }
      milestones: { title: string; date: string; location: string }[]
    }
    photos: { alt: string; date: string; location: string }[]
    expect: {
      heading: { before: string; highlight: string; after: string }
      cards: { title: string; body: string }[]
    }
    closing: {
      intro: { before: string; highlight: string }
      buttonLabel: string
      venueAlt: string
    }
  }
  rsvp: {
    title: string
    subtitle: string
    nameLabel: string
    namePlaceholder: string
    attendingLabel: string
    yes: string
    no: string
    mealLabel: string
    meals: { fish: string; chicken: string; meat: string }
    companionsLabel: string
    companionsHint: string
    addCompanion: string
    companionNamePlaceholder: string
    remove: string
    dietaryLabel: string
    dietaryPlaceholder: string
    emailLabel: string
    emailPlaceholder: string
    messageLabel: string
    messagePlaceholder: string
    submit: string
    sending: string
    errorName: string
    errorAttending: string
    errorGeneric: string
    confirmTitle: string
    confirmAttending: string
    confirmDeclined: string
    backHome: string
  }
}

const fr: Dictionary = {
  landing: {
    hero: {
      venue: "Manoir de Villefermoy",
      date: "15 Avril 2027",
    },
    story: {
      intro: {
        before: "Le ",
        highlight: "Quinze",
        afterLine1: " revient sans cesse",
        line2: "comme s'il nous appartenait.",
      },
      milestones: [
        { title: "La Demande", date: "15 Mars 2025", location: "Cascais, Portugal" },
        { title: "La Dote", date: "15 Juin 2025", location: "Bruxelles, Belgique" },
        { title: "Le Mariage", date: "15 Avril 2027", location: "Les Écrennes, France" },
      ],
    },
    photos: [
      { alt: "Caroline & Junias, complices et rieurs", date: "15 Juin 2026", location: "Enghien-les-Bains, France" },
      { alt: "Caroline & Junias au bord du lac", date: "15 Juin 2026", location: "Enghien-les-Bains, France" },
      { alt: "Caroline & Junias en pique-nique", date: "15 Juin 2026", location: "Enghien-les-Bains, France" },
      { alt: "Caroline & Junias assis tout près", date: "15 Juin 2026", location: "Enghien-les-Bains, France" },
      { alt: "Caroline & Junias sur le ponton", date: "15 Juin 2026", location: "Enghien-les-Bains, France" },
      { alt: "Caroline & Junias, regards complices", date: "15 Juin 2026", location: "Enghien-les-Bains, France" },
      { alt: "Caroline & Junias, main dans la main", date: "15 Juin 2026", location: "Enghien-les-Bains, France" },
    ],
    expect: {
      heading: { before: "Ce qui vous ", highlight: "attend", after: " le 15 Avril" },
      cards: [
        {
          title: "Cérémonie civile",
          body: "On se dit oui à la mairie de Champigny-sur-Marne (94), entourés de nos familles et de vous, nos proches.",
        },
        {
          title: "Célébration nuptiale",
          body: "On échange nos vœux devant Dieu et devant vous, au lieu de réception, le moment que l'on attend le plus.",
        },
        {
          title: "Vin d'honneur",
          body: "Le vin d'honneur pour trinquer tous ensemble, entre animations, musique et de belles surprises à venir.",
        },
        {
          title: "Dîner & soirée",
          body: "Un généreux buffet ivoirien plein de saveurs, puis on danse toute la nuit. Ne soyez surtout pas timides !",
        },
      ],
    },
    closing: {
      intro: {
        before: "On se marie, et",
        highlight: "vous êtes invités à célébrer avec nous !",
      },
      buttonLabel: "CONFIRMER VOTRE PRÉSENCE",
      venueAlt: "Illustration du lieu de réception",
    },
  },
  rsvp: {
    title: "Confirmez votre présence",
    subtitle: "Merci de répondre avant le 14 janvier 2026.",
    nameLabel: "Votre nom",
    namePlaceholder: "Jean Dupont",
    attendingLabel: "Serez-vous présent(e) ?",
    yes: "Oui, je serai là",
    no: "Non, je ne peux pas",
    mealLabel: "Votre choix de plat",
    meals: { fish: "Poisson", chicken: "Poulet", meat: "Viande" },
    companionsLabel: "Personnes qui vous accompagnent",
    companionsHint: "Ajoutez les personnes qui viennent avec vous.",
    addCompanion: "Ajouter une personne",
    companionNamePlaceholder: "Nom de l'accompagnant",
    remove: "Retirer",
    dietaryLabel: "Allergies / régime particulier (optionnel)",
    dietaryPlaceholder: "Ex : sans gluten, allergie aux fruits de mer…",
    emailLabel: "Email (optionnel)",
    emailPlaceholder: "vous@exemple.com",
    messageLabel: "Un mot pour les mariés (optionnel)",
    messagePlaceholder: "Votre message…",
    submit: "Envoyer ma réponse",
    sending: "Envoi…",
    errorName: "Veuillez indiquer votre nom.",
    errorAttending: "Veuillez indiquer si vous serez présent(e).",
    errorGeneric: "Une erreur est survenue. Veuillez réessayer.",
    confirmTitle: "Merci !",
    confirmAttending: "Nous avons bien reçu votre réponse. Hâte de célébrer avec vous !",
    confirmDeclined: "Merci pour votre réponse. Vous allez nous manquer !",
    backHome: "Retour à l'accueil",
  },
}

const en: Dictionary = {
  landing: {
    hero: {
      venue: "Manoir de Villefermoy",
      date: "April 15, 2027",
    },
    story: {
      intro: {
        before: "The ",
        highlight: "Fifteenth",
        afterLine1: " keeps showing up",
        line2: "as if it belongs to us.",
      },
      milestones: [
        { title: "The Proposal", date: "March 15, 2025", location: "Cascais, Portugal" },
        { title: "The Dowry", date: "June 15, 2025", location: "Bruxelles, Belgium" },
        { title: "The Wedding", date: "April 15, 2027", location: "Les Écrennes, France" },
      ],
    },
    photos: [
      { alt: "Caroline & Junias laughing together", date: "June 15, 2026", location: "Enghien-les-Bains, France" },
      { alt: "Caroline & Junias by the lake", date: "June 15, 2026", location: "Enghien-les-Bains, France" },
      { alt: "Caroline & Junias on a picnic", date: "June 15, 2026", location: "Enghien-les-Bains, France" },
      { alt: "Caroline & Junias sitting close", date: "June 15, 2026", location: "Enghien-les-Bains, France" },
      { alt: "Caroline & Junias walking on the dock", date: "June 15, 2026", location: "Enghien-les-Bains, France" },
      { alt: "Caroline & Junias, knowing glances", date: "June 15, 2026", location: "Enghien-les-Bains, France" },
      { alt: "Caroline & Junias, hand in hand", date: "June 15, 2026", location: "Enghien-les-Bains, France" },
    ],
    expect: {
      heading: { before: "What to ", highlight: "expect", after: " on April 15th" },
      cards: [
        {
          title: "Civil ceremony",
          body: "We say our I do's at the Champigny-sur-Marne city hall (94), with our families and all of you close by.",
        },
        {
          title: "Religious ceremony",
          body: "We exchange our vows before God and before you, at the venue, the moment we look forward to the most.",
        },
        {
          title: "Cocktail & animations",
          body: "The vin d'honneur, to raise a glass all together, with entertainment, music and a few surprises to come.",
        },
        {
          title: "Dinner & party",
          body: "A generous Ivorian buffet full of flavor, then we dance all night. And whatever you do, don't be shy!",
        },
      ],
    },
    closing: {
      intro: {
        before: "We're getting married, and",
        highlight: "you're invited to celebrate us!",
      },
      buttonLabel: "CONFIRM YOUR ATTENDANCE",
      venueAlt: "Illustration of the wedding venue",
    },
  },
  rsvp: {
    title: "RSVP",
    subtitle: "Please respond by January 14, 2026.",
    nameLabel: "Your name",
    namePlaceholder: "John Doe",
    attendingLabel: "Will you attend?",
    yes: "Yes, I'll be there",
    no: "No, I can't make it",
    mealLabel: "Your meal choice",
    meals: { fish: "Fish", chicken: "Chicken", meat: "Meat" },
    companionsLabel: "People joining you",
    companionsHint: "Add the people coming with you.",
    addCompanion: "Add a person",
    companionNamePlaceholder: "Guest's name",
    remove: "Remove",
    dietaryLabel: "Allergies / dietary notes (optional)",
    dietaryPlaceholder: "e.g. gluten-free, shellfish allergy…",
    emailLabel: "Email (optional)",
    emailPlaceholder: "you@example.com",
    messageLabel: "A note for the couple (optional)",
    messagePlaceholder: "Your message…",
    submit: "Send my response",
    sending: "Sending…",
    errorName: "Please enter your name.",
    errorAttending: "Please tell us whether you'll attend.",
    errorGeneric: "Something went wrong. Please try again.",
    confirmTitle: "Thank you!",
    confirmAttending: "We've received your response. Can't wait to celebrate with you!",
    confirmDeclined: "Thanks for letting us know. You'll be missed!",
    backHome: "Back home",
  },
}

const DICTIONARIES: Record<Locale, Dictionary> = { fr, en }

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale]
}
