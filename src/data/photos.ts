export type Photo = {
  src: string
  alt: string
}

// To change the gallery, just edit this list.
// Drop new files in /public/photos and reference them here.
// Order matters: the middle item is the one shown centered on load.
export const carouselPhotos: Photo[] = [
  { src: "/photos/photo-01.png", alt: "Caroline & Junias laughing together" },
  { src: "/photos/photo-03.png", alt: "Caroline & Junias by the lake" },
  { src: "/photos/photo-02.png", alt: "Caroline & Junias on a picnic" },
  { src: "/photos/photo-04.png", alt: "Caroline & Junias sitting close" },
  { src: "/photos/photo-05.png", alt: "Caroline & Junias walking on the dock" },
]
