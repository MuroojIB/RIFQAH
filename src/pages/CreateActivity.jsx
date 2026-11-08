import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Minus, Plus, Send } from 'lucide-react'
import { CATEGORIES, categoryLabelFromId, localDateTime, toInstant } from '@/utils/activities'
import { nowLocalString, todayISO } from '@/utils/format'
import { fieldClass, pill } from '@/utils/ui'
import { cn } from '@/utils/cn'
import { createActivity } from '../services/activityService'
import Field from '../components/ui/Field'

export default function CreateActivity({ currentUser }) {
  const navigate = useNavigate()
  const [maxMembers, setMaxMembers] = useState(6)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const value = (k) => String(data.get(k) ?? '').trim()

    const next = {}
    if (value('title').length < 4) next.title = 'اكتب عنواناً من ٤ أحرف على الأقل'
    if (value('description').length < 10) next.description = 'أضف وصفاً قصيراً (١٠ أحرف على الأقل)'
    if (!value('category')) next.category = 'اختر فئة النشاط'
    if (!value('date')) next.date = 'حدد التاريخ'
    if (!value('time')) next.time = 'حدد الوقت'
    if (value('date') && value('time') && localDateTime(value('date'), value('time')) <= nowLocalString()) {
      next.time = 'اختر موعداً في المستقبل'
    }
    if (!value('location')) next.location = 'أضف الموقع'

    setErrors(next)
    setServerError('')
    if (Object.keys(next).length) {
      form.querySelector(`[name="${Object.keys(next)[0]}"]`)?.focus()
      return
    }

    setSubmitting(true)
    try {
      const created = await createActivity({
        title: value('title'),
        description: value('description'),
        category: categoryLabelFromId(value('category')),
        location: value('location'),
        date_time: toInstant(value('date'), value('time')),
        max_members: maxMembers,
        creator_id: currentUser.id,
        status: 'open',
      })
      navigate(`/activities/${created.id}`)
    } catch (error) {
      console.error('Error creating activity:', error)
      setServerError('تعذّر نشر النشاط، تأكد من البيانات وحاول مرة أخرى')
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-grid-paper">
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold md:text-5xl">أنشئ نشاطاً جديداً</h1>
          <p className="text-muted-foreground">شاركنا التفاصيل، وسنساعدك في إيجاد رفقتك</p>
        </div>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6 rounded-[2rem] border border-border bg-card p-5 shadow-sm md:p-8">
          <Field label="عنوان النشاط" name="title" error={errors.title}>
            {(props) => <input {...props} type="text" maxLength={80} placeholder="مثلاً: جلسة قهوة وتعارف" className={fieldClass} />}
          </Field>

          <Field label="الوصف" name="description" error={errors.description}>
            {(props) => (
              <textarea
                {...props}
                rows={4}
                maxLength={600}
                placeholder="ماذا ستفعلون؟ ولمن يناسب هذا النشاط؟"
                className={cn(fieldClass, 'h-auto resize-y py-3 leading-relaxed')}
              />
            )}
          </Field>

          <Field label="الفئة" name="category" error={errors.category}>
            {(props) => (
              <div className="relative">
                <select {...props} defaultValue="" className={cn(fieldClass, 'appearance-none pl-10')}>
                  <option value="" disabled>
                    اختر الفئة
                  </option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              </div>
            )}
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="التاريخ" name="date" error={errors.date}>
              {(props) => <input {...props} type="date" min={todayISO()} className={cn(fieldClass, 'text-right')} />}
            </Field>
            <Field label="الوقت" name="time" error={errors.time}>
              {(props) => <input {...props} type="time" className={cn(fieldClass, 'text-right')} />}
            </Field>
          </div>

          <Field label="الموقع أو الرابط" name="location" error={errors.location}>
            {(props) => <input {...props} type="text" placeholder="اسم المكان والمدينة، أو رابط موقع" className={fieldClass} />}
          </Field>

          <div className="flex flex-col gap-2">
            <label htmlFor="maxMembers" className="text-sm font-semibold">
              الحد الأقصى للمشاركين
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMaxMembers((n) => Math.max(2, n - 1))}
                aria-label="إنقاص العدد"
                className="flex size-12 items-center justify-center rounded-2xl border border-input bg-card hover:bg-muted"
              >
                <Minus className="size-4" aria-hidden="true" />
              </button>
              <input
                id="maxMembers"
                name="maxMembers"
                type="number"
                inputMode="numeric"
                min={2}
                max={50}
                value={maxMembers}
                onChange={(e) => setMaxMembers(Math.min(50, Math.max(2, Number(e.target.value) || 2)))}
                className={cn(fieldClass, 'w-24 text-center font-display text-lg font-semibold')}
              />
              <button
                type="button"
                onClick={() => setMaxMembers((n) => Math.min(50, n + 1))}
                aria-label="زيادة العدد"
                className="flex size-12 items-center justify-center rounded-2xl border border-input bg-card hover:bg-muted"
              >
                <Plus className="size-4" aria-hidden="true" />
              </button>
              <span className="text-sm text-muted-foreground">من ٢ إلى ٥٠ شخصاً</span>
            </div>
          </div>

          {serverError && (
            <p role="alert" className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              {serverError}
            </p>
          )}

          <button type="submit" disabled={submitting} className={cn(pill({ size: 'lg' }), 'mt-2 w-full sm:w-auto sm:self-start')}>
            <Send aria-hidden="true" className="-scale-x-100" />
            {submitting ? 'جاري النشر...' : 'نشر النشاط'}
          </button>
        </form>
      </div>
    </div>
  )
}
