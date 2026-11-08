import { CATEGORY_MAP } from '@/utils/activities'
import { cn } from '@/utils/cn'

export function CategoryBadge({ category, className }) {
  const cat = CATEGORY_MAP[category]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-foreground/10 px-3 py-1 text-xs font-semibold text-foreground',
        cat.bg,
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-foreground/70" />
      {cat.label}
    </span>
  )
}

const STATUS = {
  open: { label: 'متاح', className: 'bg-accent text-accent-foreground' },
  full: { label: 'مكتمل العدد', className: 'bg-cat-learning text-foreground' },
  completed: { label: 'انتهى', className: 'bg-muted text-muted-foreground' },
  cancelled: { label: 'ملغي', className: 'bg-destructive/10 text-destructive' },
}

export function StatusBadge({ status, className }) {
  const s = STATUS[status]
  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', s.className, className)}>
      {s.label}
    </span>
  )
}

