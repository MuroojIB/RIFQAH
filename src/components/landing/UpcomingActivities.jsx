import { Link } from 'react-router-dom'
import { ArrowLeft, CalendarPlus } from 'lucide-react'
import { pill } from '@/utils/ui'
import ActivityCard from '../shared/ActivityCard'
import { CardsSkeleton, EmptyState } from '../ui/PageState'

/** upcoming: أنشطة مفتوحة جاهزة للعرض (الصفحة الرئيسية تحسبها وتمررها) */
export default function UpcomingActivities({ upcoming, loading, currentUser }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold md:text-4xl">أنشطة قريبة تنتظرك</h2>
          <p className="text-muted-foreground">مقاعد محدودة، احجز مكانك قبل أن تكتمل</p>
        </div>
        <Link to="/explore" className={pill({ variant: 'outline', size: 'sm' })}>
          عرض الكل
          <ArrowLeft aria-hidden="true" />
        </Link>
      </div>

      {loading ? (
        <CardsSkeleton />
      ) : upcoming.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((a) => (
            <ActivityCard key={a.id} activity={a} currentUser={currentUser} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarPlus}
          title="لا توجد أنشطة قادمة الآن"
          body="كن أول من ينشئ نشاطاً ويدعو الآخرين للانضمام"
          actionLabel="أنشئ نشاطاً"
          actionTo="/create-activity"
        />
      )}
    </section>
  )
}
