// "What to expect on April 15th" — a horizontally scrollable set of cards.
// Edit the copy freely; the progress line + active highlight adapt to the count.
export const expectHeading = {
  before: "What to ",
  highlight: "expect",
  after: " on April 15th",
}

export type ExpectCard = {
  title: string
  body: string
}

export const expectCards: ExpectCard[] = [
  {
    title: "City Hall",
    body: "We say our I do's at the Champigny-sur-Marne (94) city hall, with our families and all of you close by.",
  },
  {
    title: "Religious Ceremony",
    body: "We exchange our vows before God, surrounded by the people we love the most. (placeholder copy)",
  },
  {
    title: "Reception",
    body: "We celebrate late into the night with dinner, music and dancing. (placeholder copy)",
  },
]

// Closing / RSVP block
export const closing = {
  text: "We’re getting married, and we would be so happy to celebrate you.",
  buttonLabel: "RSVP HERE",
  buttonHref: "#rsvp",
  // Drop the venue line-art here once available (SVG/PNG in /public).
  venueImage: "/venue.svg",
  venueAlt: "Illustration of the wedding venue",
}
