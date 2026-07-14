export type Photo = {
  src: string
  alt: string
  /** Caption shown bottom-left over the photo (date + place). */
  date?: string
  location?: string
}

// To change the gallery, just edit this list.
// Drop new files in /public/photos and reference them here.
// Order matters: the middle item is the one shown centered on load.
// `date` / `location` render as a two-line caption over the photo.
export const carouselPhotos: Photo[] = [
  {
    src: "/photos/photo-01.png",
    alt: "Caroline & Junias laughing together",
    date: "June 15, 2026",
    location: "Enghien-les-Bains, France",
  },
  {
    src: "/photos/photo-03.png",
    alt: "Caroline & Junias by the lake",
    date: "June 15, 2026",
    location: "Enghien-les-Bains, France",
  },
  {
    src: "/photos/photo-02.png",
    alt: "Caroline & Junias on a picnic",
    date: "June 15, 2026",
    location: "Enghien-les-Bains, France",
  },
  {
    src: "/photos/photo-04.png",
    alt: "Caroline & Junias sitting close",
    date: "June 15, 2026",
    location: "Enghien-les-Bains, France",
  },
  {
    src: "/photos/photo-05.png",
    alt: "Caroline & Junias walking on the dock",
    date: "June 15, 2026",
    location: "Enghien-les-Bains, France",
  },
]
