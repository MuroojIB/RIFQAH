import { CATEGORIES } from '@/utils/activities'

export default function CategoryMarquee() {
  const items = [...CATEGORIES, ...CATEGORIES]
  return (
    <div className="overflow-hidden border-b border-foreground/15 bg-cat-sports py-3" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-8">
        {[...items, ...items].map((c, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap font-display text-sm font-medium">
            {c.label}
            <span className="text-foreground/50">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
