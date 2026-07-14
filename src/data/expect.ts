// Language-independent visuals for the "What to expect" cards. These are merged
// by index with the bilingual copy in src/lib/i18n.ts (landing.expect.cards).
// Line-art SVGs live in /public/expect and are recolored to terracotta via CSS.
export const expectVisuals: { icon: string }[] = [
  { icon: "/expect/cityhall.svg" },
  { icon: "/expect/religious.svg" },
  { icon: "/expect/cocktail.svg" },
  { icon: "/expect/party.svg" },
]

// Assets for the closing / RSVP block. The copy (text, button label, image alt)
// lives in the bilingual dictionaries in src/lib/i18n.ts under `landing.closing`.
export const closingAssets = {
  buttonHref: "/rsvp",
  // Drop the venue line-art here once available (SVG/PNG in /public).
  venueImage: "/venue.svg",
}
