import { Link } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Clock, MapPin } from 'lucide-react'
import { CATEGORY_MAP, getImage, getStatus } from '@/utils/activities'
import { formatShortDate, formatTime } from '@/utils/format'
import { pill } from '@/utils/ui'
import { cn } from '@/utils/cn'
import { CategoryBadge, StatusBadge } from '../ui/Badges'
import PersonAvatar from './PersonAvatar'
import SeatsMeter from '../ui/SeatsMeter'

// Activity card component
export default function ActivityCard({ activity, currentUser, footer }) {
  const status = getStatus(activity)
  const cat = CATEGORY_MAP[activity.category]
  const dimmed = status === 'cancelled' || status === 'completed'
  const detailsPath = `/activities/${activity.id}`
  const isMine = currentUser?.id === activity.hostId

  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-3xl border border-foreground/10 transition-transform hover:-translate-y-1',
        cat.bg,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-card">
        <img
          src={getImage(activity)}
          alt=""
          loading="lazy"
          decoding="async"
          className={cn(
            'absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105',
            dimmed && 'grayscale',
          )}
        />
        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <CategoryBadge category={activity.category} className="bg-card/95" />
          {status !== 'open' && <StatusBadge status={status} className="shadow-sm" />}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <h3 className="text-lg font-semibold leading-snug">{activity.title}</h3>

        <ul className="flex flex-col gap-2 text-sm text-foreground/80">
          <li className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
            <span>{formatShortDate(activity.date)}</span>
            <span aria-hidden="true" className="text-foreground/40">•</span>
            <Clock className="size-4 shrink-0" aria-hidden="true" />
            <span>{formatTime(activity.time)}</span>
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{activity.location}</span>
          </li>
          <li className="flex items-center gap-2">
            <PersonAvatar person={activity.host} className="size-6 text-[10px] ring-0" />
            <span>
              بتنظيم <span className="font-semibold text-foreground">{isMine ? 'أنت' : activity.host.name}</span>
            </span>
          </li>
        </ul>

        <SeatsMeter filled={activity.participantIds.length} max={activity.maxMembers} className="mt-auto" />

        {footer ?? (
          <Link
            to={currentUser ? detailsPath : '/login'}
            state={currentUser ? undefined : { from: detailsPath }}
            className={cn(pill({ variant: 'ink', size: 'sm' }), 'w-full')}
          >
            عرض التفاصيل
            <ArrowLeft aria-hidden="true" className="transition-transform group-hover:-translate-x-1" />
          </Link>
        )}
      </div>
    </article>
  )
}

export function ActivityCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex animate-pulse flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-card">
      <div className="aspect-[16/10] bg-muted" />
      <div className="flex flex-col gap-4 p-5">
        <div className="h-5 w-3/4 rounded-full bg-muted" />
        <div className="h-4 w-1/2 rounded-full bg-muted" />
        <div className="h-4 w-2/3 rounded-full bg-muted" />
        <div className="h-9 rounded-full bg-muted" />
      </div>
    </div>
  )
}

