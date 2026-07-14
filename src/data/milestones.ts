export type Milestone = {
  title: string
  date: string
  location: string
  /** Placeholder fill shown in the polaroid until real photos are added. */
  color: string
  /** Optional photo (drop in /public/polaroid). Overrides `color` when set. */
  image?: string
  imageAlt?: string
}

// Edit this list to change the story milestones. Photos come later — for now
// each milestone shows a solid colour placeholder in the polaroid.
export const milestones: Milestone[] = [
  {
    title: "The Proposal",
    date: "March 15, 2025",
    location: "Cascais, Portugal",
    color: "#C9B8A8",
  },
  {
    title: "The Dowry",
    date: "June 15, 2025",
    location: "Bruxelles, Belgium",
    color: "#B7A6A0",
  },
  {
    title: "The Wedding",
    date: "April 15 2027",
    location: "Les Écrennes, France",
    color: "#A9B0A2",
  },
]

// The intro line above the milestones. The highlighted word is rendered
// in the accent colour + italic. Split across two lines on purpose.
export const milestonesIntro = {
  before: "The ",
  highlight: "Fifteenth",
  afterLine1: " keeps appearing",
  line2: "like the it belongs to us.",
}
