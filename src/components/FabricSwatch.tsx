/**
 * Renders a color as a smooth piece of satin.
 *
 * The silky look comes from layered, soft gradients: a bright diagonal sheen
 * band (the light catching the fabric), a darker opposite corner for drape
 * depth, and a gentle top-to-bottom sheen. No noise, no bitmap textures.
 */
export default function FabricSwatch({
  color,
  className,
}: {
  color: string
  className?: string
}) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: color,
        backgroundImage: [
          "linear-gradient(118deg, rgba(255,255,255,0) 12%, rgba(255,255,255,0.5) 40%, rgba(255,255,255,0.12) 52%, rgba(255,255,255,0) 74%)",
          "linear-gradient(300deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0) 46%)",
          "linear-gradient(210deg, rgba(255,255,255,0.16) 0%, rgba(0,0,0,0.08) 65%)",
        ].join(", "),
      }}
    />
  )
}
