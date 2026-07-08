// Designed card for projects without a photo: gradient + big type instead of an
// empty-looking placeholder image.
export default function ProjectTile({
  title,
  category,
  gradient,
  aspectRatio = '4/3',
  className = '',
}: {
  title: string
  category: string
  gradient: string
  aspectRatio?: string
  className?: string
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg flex items-end p-6 ${className}`}
      style={{ aspectRatio, background: gradient }}
    >
      <div className="absolute inset-0 bg-black/15" />
      <div className="relative">
        <p className="text-[11px] uppercase tracking-[0.25em] text-white/70">
          {category}
        </p>
        <p className="mt-1 text-2xl md:text-3xl font-display font-semibold text-white leading-tight text-balance">
          {title}
        </p>
      </div>
    </div>
  )
}
