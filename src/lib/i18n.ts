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
  hero: {
    invitedTo: string
    date: string
    location: string
  }
  programme: {
    title: string
    schedule: { label: string; description: string }[]
  }
  cta: {
    rsvp: string
  }
  footer: {
    tagline: string
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
  hero: {
    invitedTo: "Vous êtes invités au mariage de",
    date: "Samedi 14 février 2026",
    location: "Paris, France",
  },
  programme: {
    title: "Ce qui vous attend",
    schedule: [
      {
        label: "Cérémonie civile",
        description:
          "On se dit oui à la mairie de Champigny-sur-Marne (94), entourés de nos familles et de vous, nos proches.",
      },
      {
        label: "Célébration nuptiale",
        description:
          "On échange nos vœux devant Dieu et devant vous, au lieu de réception, le moment que l'on attend le plus.",
      },
      {
        label: "Vin d'honneur",
        description:
          "Le vin d'honneur pour trinquer tous ensemble, entre animations, musique et de belles surprises à venir.",
      },
      {
        label: "Dîner & soirée",
        description:
          "Un généreux buffet ivoirien plein de saveurs, puis on danse toute la nuit. Ne soyez surtout pas timides !",
      },
    ],
  },
  cta: {
    rsvp: "Confirmer ma présence",
  },
  footer: {
    tagline: "Junias & Caroline · 2026",
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
  hero: {
    invitedTo: "You are invited to the wedding of",
    date: "Saturday, February 14, 2026",
    location: "Paris, France",
  },
  programme: {
    title: "What to expect",
    schedule: [
      {
        label: "Civil ceremony",
        description:
          "We say our I do's at the Champigny-sur-Marne city hall (94), with our families and all of you close by.",
      },
      {
        label: "Religious ceremony",
        description:
          "We exchange our vows before God and before you, at the venue, the moment we look forward to the most.",
      },
      {
        label: "Cocktail & animations",
        description:
          "The vin d'honneur, to raise a glass all together, with entertainment, music and a few surprises to come.",
      },
      {
        label: "Dinner & party",
        description:
          "A generous Ivorian buffet full of flavor, then we dance all night. And whatever you do, don't be shy!",
      },
    ],
  },
  cta: {
    rsvp: "RSVP",
  },
  footer: {
    tagline: "Junias & Caroline · 2026",
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
