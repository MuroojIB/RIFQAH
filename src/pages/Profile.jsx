import { useState } from 'react'
import { Check, Lock, Save } from 'lucide-react'
import { toPerson } from '@/utils/activities'
import { validateName } from '@/utils/validation'
import { fieldClass, pill } from '@/utils/ui'
import { cn } from '@/utils/cn'
import { updateUserProfile } from '../services/authService'
import Field from '../components/ui/Field'
import InterestPicker from '../components/shared/InterestPicker'
import PersonAvatar from '../components/shared/PersonAvatar'

export default function Profile({ currentUser, onProfileUpdate }) {
  const [name, setName] = useState(currentUser.name || '')
  const [interests, setInterests] = useState(currentUser.interests || [])
  const [nameError, setNameError] = useState('')
  const [status, setStatus] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const error = validateName(name)
    setNameError(error)
    setStatus({ type: '', text: '' })
    if (error) return

    try {
      setLoading(true)
      await updateUserProfile(currentUser.id, { name: name.trim(), interests })
      setStatus({ type: 'success', text: 'تم حفظ التعديلات' })
      if (onProfileUpdate) await onProfileUpdate()
    } catch (err) {
      console.error('Error updating profile:', err)
      setStatus({ type: 'error', text: 'تعذّر حفظ التعديلات، حاول مرة أخرى' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-grid-paper">
      <div className="mx-auto max-w-2xl px-4 py-10 md:px-6 md:py-14">
        <header className="mb-8 flex items-center gap-4">
          <PersonAvatar person={toPerson(currentUser.id, currentUser.name)} size="lg" />
          <div className="flex flex-col gap-1.5">
            <h1 className="text-3xl font-bold leading-normal md:text-4xl">ملفي الشخصي</h1>
            <p className="text-sm text-muted-foreground" dir="ltr">{currentUser.email}</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 rounded-[2rem] border border-border bg-card p-5 shadow-sm md:p-8">
          <Field label="الاسم" name="name" error={nameError}>
            {(props) => (
              <input {...props} type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} />
            )}
          </Field>

          <Field label="البريد الإلكتروني" name="email">
            {(props) => (
              <input {...props} type="email" dir="ltr" disabled value={currentUser.email || ''} className={cn(fieldClass, 'text-right')} />
            )}
          </Field>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">الجنس</span>
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-input bg-muted px-4 py-3">
              <span className="font-medium">{currentUser.gender === 'female' ? 'أنثى' : 'ذكر'}</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="size-3.5" aria-hidden="true" />
                مقفل
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              لا يمكن تغيير الجنس بعد التسجيل، لأنه أساس الفلترة التلقائية للأنشطة
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">الاهتمامات</span>
            <InterestPicker value={interests} onChange={setInterests} />
          </div>

          {status.text && (
            <p
              role={status.type === 'error' ? 'alert' : 'status'}
              className={cn(
                'flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium',
                status.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-accent text-accent-foreground',
              )}
            >
              {status.type === 'success' && <Check className="size-4" aria-hidden="true" />}
              {status.text}
            </p>
          )}

          <button type="submit" disabled={loading} className={cn(pill({ size: 'lg' }), 'w-full sm:w-auto sm:self-start')}>
            <Save aria-hidden="true" />
            {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </button>
        </form>
      </div>
    </div>
  )
}
