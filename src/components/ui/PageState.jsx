import { Link } from 'react-router-dom'
import { RefreshCw, SearchX, TriangleAlert } from 'lucide-react'
import { pill } from '@/utils/ui'
import { ActivityCardSkeleton } from '../shared/ActivityCard'

export function CardsSkeleton({ count = 3 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="جاري التحميل">
      {Array.from({ length: count }).map((_, i) => (
        <ActivityCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function FullPageLoader({ label = 'جاري التحميل...' }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status">
      <div className="flex flex-col items-center gap-4">
        <span className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

export function ErrorState({ message = 'تعذّر تحميل البيانات', onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-destructive/40 bg-card px-6 py-14 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-6" aria-hidden="true" />
      </span>
      <p className="max-w-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className={pill({ variant: 'outline' })}>
          <RefreshCw aria-hidden="true" />
          إعادة المحاولة
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, body, actionLabel, actionTo, icon: Icon = SearchX }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-foreground/20 bg-card px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-cat-learning">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h2 className="text-xl font-semibold">{title}</h2>
      {body && <p className="max-w-sm text-muted-foreground">{body}</p>}
      {actionLabel && (
        <Link to={actionTo} className={pill()}>
          {actionLabel}
        </Link>
      )}
    </div>
  )
}

