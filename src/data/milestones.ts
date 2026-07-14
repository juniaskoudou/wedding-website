// Visual assets for the story milestones. The copy (title / date / location)
// lives in the bilingual dictionaries in src/lib/i18n.ts under
// `landing.story.milestones`, matched to these visuals by order.
// Photos come later — for now each milestone shows a solid colour placeholder.
export type MilestoneVisual = {
  /** Placeholder fill shown in the polaroid until a real photo is added. */
  color: string
  /** Optional photo (drop in /public/polaroid). Overrides `color` when set. */
  image?: string
  imageAlt?: string
}

export type Milestone = {
  title: string
  date: string
  location: string
} & MilestoneVisual

export const milestoneVisuals: MilestoneVisual[] = [
  {
    color: "#C9B8A8",
    image: "/polaroid/proposal-beach.jpg",
    imageAlt: "Caroline & Junias — the proposal",
  },
  {
    color: "#B7A6A0",
    image: "/polaroid/dote-selfie.jpg",
    imageAlt: "Caroline & Junias — the dowry",
  },
  {
    color: "#A9B0A2",
    image: "/polaroid/wedding-blur.jpg",
    imageAlt: "Caroline & Junias — the wedding",
  },
]
