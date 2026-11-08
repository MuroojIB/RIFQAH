import { CATEGORY_MAP } from '@/utils/activities'
import { initials } from '@/utils/format'
import { cn } from '@/utils/cn'

const SIZES = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-14 text-lg',
}

// User avatar with deterministic tone
export default function PersonAvatar({ person, size = 'sm', className }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-foreground ring-2 ring-background',
        CATEGORY_MAP[person.tone].bg,
        SIZES[size],
        className,
      )}
    >
      {initials(person.name)}
    </span>
  )
}

