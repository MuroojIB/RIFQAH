import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, CalendarDays, Check, Clock, MapPin, Share2, UserPlus, Users } from 'lucide-react'
import { CATEGORY_MAP, getImage, getStatus, toActivity } from '@/utils/activities'
import { formatLongDate, formatTime } from '@/utils/format'
import { joinErrorMessage } from '@/utils/errors'
import { pill } from '@/utils/ui'
import { cn } from '@/utils/cn'
import { fetchActivityDetails, joinActivity, leaveActivity } from '../services/activityService'
import { CategoryBadge, StatusBadge } from '../components/ui/Badges'
import PersonAvatar from '../components/shared/PersonAvatar'
import SeatsMeter from '../components/ui/SeatsMeter'
import { ErrorState, FullPageLoader } from '../components/ui/PageState'

export default function ActivityDetails({ currentUser }) {
  const { id } = useParams()
  const [row, setRow] = useState(null)
  const [load, setLoad] = useState('loading')
  const [reloadKey, setReloadKey] = useState(0)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchActivityDetails(id)
      .then((data) => {
        if (cancelled) return
        setRow(data)
        setLoad('ready')
      })
      .catch((error) => {
        if (cancelled) return
        console.error('Error fetching activity details:', error)
        setLoad(error?.code === 'PGRST116' ? 'missing' : 'error')
      })
    return () => {
      cancelled = true
    }
  }, [id, reloadKey])

  const activity = useMemo(() => (row && row.id === id ? toActivity(row) : null), [row, id])
  const reload = () => setReloadKey((k) => k + 1)

  if (load === 'loading' || (load === 'ready' && !activity)) return <FullPageLoader label="جاري تحميل تفاصيل النشاط..." />

  if (load === 'error') {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <ErrorState message="تعذّر تحميل النشاط، حاول مرة أخرى" onRetry={() => { setLoad('loading'); reload() }} />
      </div>
    )
  }

  if (load === 'missing' || !activity) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">لم نجد هذا النشاط</h1>
        <p className="text-muted-foreground">ربما حُذف أو أن الرابط غير صحيح</p>
        <Link to="/explore" className={pill()}>
          العودة للاستكشاف
        </Link>
      </div>
    )
  }

  const status = getStatus(activity)
  const cat = CATEGORY_MAP[activity.category]
  const isHost = activity.hostId === currentUser.id
  const joined = activity.participantIds.includes(currentUser.id)
  const remaining = activity.maxMembers - activity.participantIds.length
  const emptySlots = Math.min(Math.max(remaining, 0), 6)
  const finished = status === 'cancelled' || status === 'completed'

  const handleJoin = async () => {
    if (status !== 'open' || joined) return
    setBusy(true)
    setFeedback('')
    try {
      await joinActivity(activity.id, currentUser.id)
      reload()
    } catch (error) {
      console.error('Error joining activity:', error)
      setFeedback(joinErrorMessage(error))
      reload()
    } finally {
      setBusy(false)
    }
  }

  const handleLeave = async () => {
    setBusy(true)
    setFeedback('')
    try {
      await leaveActivity(activity.id, currentUser.id)
      reload()
    } catch (error) {
      console.error('Error leaving activity:', error)
      setFeedback('تعذّرت المغادرة، حاول مرة أخرى')
    } finally {
      setBusy(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setFeedback('تعذّر نسخ الرابط، انسخه من شريط العنوان')
    }
  }

  const action = (() => {
    if (status === 'cancelled') return <button disabled className={cn(pill({ variant: 'outline', size: 'lg' }), 'w-full')}>تم إلغاء النشاط</button>
    if (status === 'completed') return <button disabled className={cn(pill({ variant: 'outline', size: 'lg' }), 'w-full')}>انتهى النشاط</button>
    if (isHost)
      return (
        <Link to="/my-activities" className={cn(pill({ variant: 'ink', size: 'lg' }), 'w-full')}>
          إدارة نشاطك
        </Link>
      )
    if (joined)
      return (
        <div className="flex flex-col gap-2">
          <button disabled className={cn(pill({ variant: 'soft', size: 'lg' }), 'w-full disabled:opacity-100')}>
            <Check aria-hidden="true" />
            انضممت للنشاط
          </button>
          <button
            onClick={handleLeave}
            disabled={busy}
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-destructive hover:underline disabled:opacity-60"
          >
            {busy ? 'جاري التنفيذ...' : 'مغادرة النشاط'}
          </button>
        </div>
      )
    if (status === 'full') return <button disabled className={cn(pill({ variant: 'outline', size: 'lg' }), 'w-full')}>النشاط مكتمل</button>
    return (
      <button onClick={handleJoin} disabled={busy} className={cn(pill({ size: 'lg' }), 'w-full')}>
        <UserPlus aria-hidden="true" />
        {busy ? 'جاري الانضمام...' : 'انضم للنشاط'}
      </button>
    )
  })()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <Link to="/explore" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowRight className="size-4" aria-hidden="true" />
        العودة للأنشطة
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-8">
          <div className={cn('relative aspect-[16/9] overflow-hidden rounded-[2rem] border border-foreground/10', cat.bg)}>
            <img
              src={getImage(activity)}
              alt=""
              fetchPriority="high"
              className={cn('absolute inset-0 size-full object-cover', finished && 'grayscale')}
            />
          </div>

          <header className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={activity.category} />
              <StatusBadge status={status} />
            </div>
            <h1 className="text-3xl font-bold leading-tight md:text-5xl md:leading-tight">{activity.title}</h1>
          </header>

          <section aria-labelledby="about-heading" className="flex flex-col gap-3">
            <h2 id="about-heading" className="text-xl font-semibold">عن النشاط</h2>
            <p className="text-pretty text-lg leading-loose text-foreground/80">{activity.description}</p>
          </section>

          <section aria-labelledby="host-heading" className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5">
            <PersonAvatar person={activity.host} size="lg" />
            <div className="flex-1">
              <h2 id="host-heading" className="text-xs font-semibold text-muted-foreground">المنظّم</h2>
              <p className="font-display text-lg font-semibold">{isHost ? `${activity.host.name} (أنت)` : activity.host.name}</p>
            </div>
          </section>

          <section aria-labelledby="participants-heading" className="flex flex-col gap-4">
            <h2 id="participants-heading" className="flex items-center gap-2 text-xl font-semibold">
              <Users className="size-5" aria-hidden="true" />
              المشاركون ({activity.participantIds.length} / {activity.maxMembers})
            </h2>
            <ul className="flex flex-wrap gap-3">
              {activity.participants.map((p) => (
                <li key={p.id} className="flex animate-in items-center gap-2 rounded-full border border-border bg-card py-1 pl-4 pr-1 fade-in zoom-in-95">
                  <PersonAvatar person={p} className="ring-0" />
                  <span className="text-sm font-medium">{p.id === currentUser.id ? 'أنت' : p.name}</span>
                </li>
              ))}
              {status === 'open' &&
                Array.from({ length: emptySlots }).map((_, i) => (
                  <li key={`empty-${i}`} aria-hidden="true" className="flex items-center gap-2 rounded-full border border-dashed border-foreground/25 py-1 pl-4 pr-1 text-sm text-muted-foreground">
                    <span className="size-8 rounded-full border border-dashed border-foreground/25" />
                    مقعد متاح
                  </li>
                ))}
              {activity.participantIds.length === 0 && status !== 'open' && (
                <li className="text-muted-foreground">لا يوجد مشاركون</li>
              )}
            </ul>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className={cn('flex flex-col gap-6 rounded-[2rem] border border-foreground/10 p-6', cat.bg)}>
            <dl className="flex flex-col gap-4">
              <InfoRow icon={CalendarDays} label="التاريخ" value={formatLongDate(activity.date)} />
              <InfoRow icon={Clock} label="الوقت" value={formatTime(activity.time)} />
              <InfoRow icon={MapPin} label="الموقع" value={activity.location} />
            </dl>

            <div className="rounded-2xl bg-card p-4">
              <SeatsMeter filled={activity.participantIds.length} max={activity.maxMembers} />
            </div>

            {feedback && (
              <p role="alert" className="rounded-2xl bg-card px-4 py-3 text-sm font-medium text-destructive">
                {feedback}
              </p>
            )}

            <div aria-live="polite">{action}</div>

            <button type="button" onClick={handleCopy} className={cn(pill({ variant: 'ghost', size: 'sm' }), 'self-center')}>
              {copied ? <Check aria-hidden="true" /> : <Share2 aria-hidden="true" />}
              {copied ? 'تم نسخ الرابط' : 'نسخ رابط النشاط'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <dt className="text-xs font-semibold text-foreground/60">{label}</dt>
        <dd className="font-semibold">{value}</dd>
      </div>
    </div>
  )
}
