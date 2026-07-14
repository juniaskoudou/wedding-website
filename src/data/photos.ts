// Photo assets for the hero carousel. Copy (alt text + captions) lives in the
// bilingual dictionaries in src/lib/i18n.ts under `landing.photos`, matched to
// these sources by order. To change the gallery, edit this list AND keep the
// `landing.photos` arrays (fr + en) the same length / order.
// Drop new files in /public/photos and reference them here.
// Order matters: the middle item is the one shown centered on load.
export type Photo = {
  src: string
  alt: string
  /** Caption shown bottom-left over the photo (date + place). */
  date?: string
  location?: string
}

export const photoSources: { src: string }[] = [
  { src: "/photos/photo-01.jpg" },
  { src: "/photos/photo-02.jpg" },
  { src: "/photos/photo-03.jpg" },
  { src: "/photos/photo-04.jpg" },
  { src: "/photos/photo-05.jpg" },
  { src: "/photos/photo-06.jpg" },
  { src: "/photos/photo-07.jpg" },
]
