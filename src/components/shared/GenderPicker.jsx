import { cn } from '@/utils/cn'

const OPTIONS = [
  { value: 'female', label: 'أنثى', bg: 'bg-cat-arts' },
  { value: 'male', label: 'ذكر', bg: 'bg-cat-games' },
]

export default function GenderPicker({ value, onChange, name = 'gender', ...aria }) {
  return (
    <div role="radiogroup" aria-label="الجنس" className="grid grid-cols-2 gap-3" {...aria}>
      {OPTIONS.map((o) => {
        const checked = value === o.value
        return (
          <label
            key={o.value}
            className={cn(
              'flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl border text-base font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
              checked ? `border-foreground ${o.bg}` : 'border-input bg-card hover:border-foreground/40',
            )}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={checked}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            <span aria-hidden="true" className={cn('size-3 rounded-full border border-foreground/40', checked ? 'bg-foreground' : 'bg-transparent')} />
            {o.label}
          </label>
        )
      })}
    </div>
  )
}

