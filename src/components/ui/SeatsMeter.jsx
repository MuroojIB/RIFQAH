import { cn } from '@/utils/cn'

export default function SeatsMeter({ filled, max, className }) {
  const segments = Math.min(max, 12)
  const filledSegments = Math.round((filled / max) * segments)
  const remaining = Math.max(0, max - filled)

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold">
          <span className="font-mono text-base font-semibold">{filled}/{max}</span> مقاعد محجوزة
        </span>
        <span className="text-xs text-foreground/70">
          {remaining === 0 ? 'لا مقاعد متبقية' : `متبقٍ ${remaining}`}
        </span>
      </div>
      <div
        role="meter"
        aria-label="المقاعد المحجوزة"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={filled}
        className="flex gap-1"
      >
        {Array.from({ length: segments }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'h-2 flex-1 rounded-full',
              i < filledSegments ? 'bg-foreground' : 'border border-dashed border-foreground/40',
            )}
          />
        ))}
      </div>
    </div>
  )
}

