import { Check } from 'lucide-react'
import { CATEGORIES } from '@/utils/activities'
import { cn } from '@/utils/cn'

// Multi-select interest chips
export default function InterestPicker({ value, onChange, label = 'الاهتمامات' }) {
  const options = [...CATEGORIES.map((c) => ({ label: c.label, bg: c.bg }))]
  for (const extra of value) {
    if (!options.some((o) => o.label === extra)) options.push({ label: extra, bg: 'bg-muted' })
  }

  const toggle = (item) =>
    onChange(value.includes(item) ? value.filter((v) => v !== item) : [...value, item])

  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const selected = value.includes(o.label)
        return (
          <button
            key={o.label}
            type="button"
            aria-pressed={selected}
            onClick={() => toggle(o.label)}
            className={cn(
              'inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              selected ? 'border-foreground bg-foreground text-background' : 'border-foreground/15 bg-card hover:border-foreground/40',
            )}
          >
            {selected ? (
              <Check className="size-3.5" aria-hidden="true" />
            ) : (
              <span aria-hidden="true" className={cn('size-2.5 rounded-full border border-foreground/20', o.bg)} />
            )}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

