import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Ban, Eye, LogOut, Plus } from 'lucide-react'
import { getStatus, toActivity, toPerson } from '@/utils/activities'
import { pill } from '@/utils/ui'
import { cn } from '@/utils/cn'
import { cancelActivity, getMyActivities, leaveActivity } from '../services/activityService'
import ActivityCard from '../components/shared/ActivityCard'
import PersonAvatar from '../components/shared/PersonAvatar'
import { CardsSkeleton, EmptyState, ErrorState } from '../components/ui/PageState'

export default function MyActivities({ currentUser }) {
  const [tab, setTab] = useState('created')
  const [data, setData] = useState({ created: [], joined: [] })
  const [load, setLoad] = useState('loading')
  const [reloadKey, setReloadKey] = useState(0)
  const [confirming, setConfirming] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    let cancelled = false
    getMyActivities(currentUser.id)
      .then(({ created, joined }) => {
        if (cancelled) return
        setData({ created: created.map(toActivity), joined: joined.map(toActivity) })
        setLoad('ready')
      })
      .catch((error) => {
        if (cancelled) return
        console.error('Error fetching user activities:', error)
        setLoad('error')
      })
    return () => {
      cancelled = true
    }
  }, [currentUser.id, reloadKey])

  const { created, joined } = data
  const list = tab === 'created' ? created : joined
  const me = toPerson(currentUser.id, currentUser.name)

  const stats = useMemo(() => {
    const met = new Set(joined.flatMap((a) => [a.hostId, ...a.participantIds]))
    met.delete(currentUser.id)
    return [
      { label: 'أنشأتها', value: created.length, bg: 'bg-cat-arts' },
      { label: 'انضممت إليها', value: joined.length, bg: 'bg-cat-sports' },
      { label: 'أشخاص التقيت بهم', value: met.size, bg: 'bg-cat-games' },
    ]
  }, [created, joined, currentUser.id])

  const confirmAction = async (activity) => {
    setBusyId(activity.id)
    setActionError('')
    try {
      if (tab === 'created') await cancelActivity(activity.id)
      else await leaveActivity(activity.id, currentUser.id)
      setConfirming(null)
      setReloadKey((k) => k + 1)
    } catch (error) {
      console.error('Error executing activity action:', error)
      setActionError(error?.message?.startsWith('لا تملك') ? error.message : 'تعذّر تنفيذ الإجراء، حاول مرة أخرى')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-4">
          <PersonAvatar person={me} size="lg" />
          <div>
            <p className="text-sm text-muted-foreground">أهلاً بعودتك، {currentUser.name}</p>
            <h1 className="text-3xl font-bold md:text-4xl">مساحتي</h1>
          </div>
        </div>
        <ul className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <li key={s.label} className={cn('rounded-2xl border border-foreground/10 px-4 py-3', s.bg)}>
              <p className="font-display text-2xl font-bold">{load === 'ready' ? s.value : '–'}</p>
              <p className="text-xs font-medium text-foreground/70">{s.label}</p>
            </li>
          ))}
        </ul>
      </header>

      <div role="tablist" aria-label="أنشطتي" className="mb-8 inline-flex rounded-full border border-border bg-card p-1">
        {[
          { id: 'created', label: 'الأنشطة التي أنشأتها', count: created.length },
          { id: 'joined', label: 'الأنشطة التي انضممت إليها', count: joined.length },
        ].map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="tab-panel"
            onClick={() => {
              setTab(t.id)
              setConfirming(null)
              setActionError('')
            }}
            className={cn(
              'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors md:px-5',
              tab === t.id ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
            <span className={cn('rounded-full px-2 text-xs', tab === t.id ? 'bg-background/20' : 'bg-muted')}>{t.count}</span>
          </button>
        ))}
      </div>

      {actionError && (
        <p role="alert" className="mb-6 rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {actionError}
        </p>
      )}

      <div id="tab-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {load === 'loading' && <CardsSkeleton />}

        {load === 'error' && (
          <ErrorState
            message="تعذّر تحميل أنشطتك."
            onRetry={() => {
              setLoad('loading')
              setReloadKey((k) => k + 1)
            }}
          />
        )}

        {load === 'ready' &&
          (list.length === 0 ? (
            <EmptyState
              title={tab === 'created' ? 'لم تنشئ أي نشاط بعد' : 'لم تنضم لأي نشاط بعد'}
              actionLabel={tab === 'created' ? 'أنشئ نشاطك الأول' : 'استكشف الأنشطة'}
              actionTo={tab === 'created' ? '/create-activity' : '/explore'}
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tab === 'created' && (
                <Link
                  to="/create-activity"
                  className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-foreground/20 bg-card text-center transition-colors hover:border-primary hover:bg-accent/30"
                >
                  <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Plus className="size-6" aria-hidden="true" />
                  </span>
                  <span className="font-display text-lg font-semibold">نشاط جديد</span>
                </Link>
              )}
              {list.map((a) => (
                <ActivityCard
                  key={a.id}
                  activity={a}
                  currentUser={currentUser}
                  footer={
                    <ManageActions
                      activity={a}
                      mode={tab}
                      confirming={confirming === a.id}
                      busy={busyId === a.id}
                      onAsk={() => {
                        setActionError('')
                        setConfirming(a.id)
                      }}
                      onDismiss={() => setConfirming(null)}
                      onConfirm={() => confirmAction(a)}
                    />
                  }
                />
              ))}
            </div>
          ))}
      </div>
    </div>
  )
}

function ManageActions({ activity, mode, confirming, busy, onAsk, onDismiss, onConfirm }) {
  const status = getStatus(activity)
  const actionable = status === 'open' || status === 'full'
  const view = (
    <Link to={`/activities/${activity.id}`} className={cn(pill({ variant: 'ink', size: 'sm' }), 'flex-1')}>
      <Eye aria-hidden="true" />
      عرض
    </Link>
  )

  if (!actionable) return <div className="flex gap-2">{view}</div>

  if (confirming) {
    return (
      <div className="flex flex-col gap-2 rounded-2xl bg-card p-3" role="alertdialog" aria-label="تأكيد الإجراء">
        <p className="text-sm font-medium">
          {mode === 'created' ? 'سيُلغى النشاط ويظهر للمشاركين كملغي متأكد؟' : 'هل تريد مغادرة هذا النشاط؟'}
        </p>
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            disabled={busy}
            className={cn(pill({ size: 'sm' }), 'flex-1 bg-destructive hover:bg-destructive/90')}
          >
            {busy ? 'جاري التنفيذ...' : 'نعم، تأكيد'}
          </button>
          <button onClick={onDismiss} disabled={busy} className={cn(pill({ variant: 'outline', size: 'sm' }), 'flex-1')}>
            تراجع
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      {view}
      <button onClick={onAsk} className={cn(pill({ variant: 'danger', size: 'sm' }), 'flex-1')}>
        {mode === 'created' ? <Ban aria-hidden="true" /> : <LogOut aria-hidden="true" />}
        {mode === 'created' ? 'إلغاء النشاط' : 'مغادرة'}
      </button>
    </div>
  )
}
