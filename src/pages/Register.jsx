import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Lock, MailCheck, UserPlus } from 'lucide-react'
import { fieldClass, pill } from '@/utils/ui'
import { cn } from '@/utils/cn'
import { friendlyAuthError, validateRegister } from '@/utils/validation'
import { signUpUser } from '../services/authService'
import AuthShell from '../components/shared/AuthShell'
import Field from '../components/ui/Field'
import GenderPicker from '../components/shared/GenderPicker'
import InterestPicker from '../components/shared/InterestPicker'
import PasswordInput from '../components/ui/PasswordInput'

export default function Register({ onRegisterSuccess }) {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/explore'

  const [form, setForm] = useState({ name: '', email: '', password: '', gender: '' })
  const [interests, setInterests] = useState([])
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = validateRegister(form)
    setErrors(next)
    setServerError('')
    if (Object.keys(next).length) return

    try {
      setLoading(true)
      const result = await signUpUser({
        email: form.email.trim(),
        password: form.password,
        name: form.name.trim(),
        interests,
        gender: form.gender,
      })

      if (!result?.session) {
        setPendingEmail(form.email.trim())
        setLoading(false)
        return
      }

      if (onRegisterSuccess) await onRegisterSuccess()
      navigate(redirectTo, { replace: true })
    } catch (error) {
      console.error('Error signing up:', error)
      setServerError(friendlyAuthError(error))
      setLoading(false)
    }
  }

  if (pendingEmail) {
    return (
      <AuthShell
        title="تحقق من بريدك"
        subtitle="أنشأنا حسابك، وبقيت خطوة واحدة"
        footer={
          <>
            فعّلت بريدك؟{' '}
            <Link to="/login" state={location.state} className="font-semibold text-primary underline-offset-4 hover:underline">
              سجّل الدخول
            </Link>
          </>
        }
      >
        <div role="status" className="flex flex-col items-center gap-4 rounded-2xl bg-accent px-5 py-8 text-center text-accent-foreground">
          <MailCheck className="size-10" aria-hidden="true" />
          <p className="leading-relaxed">
            أرسلنا رابط التأكيد إلى <span className="font-semibold" dir="ltr">{pendingEmail}</span>، افتح الرسالة واضغط الرابط ثم ارجع لتسجيل الدخول
          </p>
          <p className="text-sm opacity-80">لم تصلك؟ تفقد البريد غير المرغوب فيه</p>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="انضم إلى رِفقة"
      subtitle="أنشئ حسابك في دقيقة وابدأ بإيجاد رفقتك"
      footer={
        <>
          لديك حساب بالفعل؟{' '}
          <Link to="/login" state={location.state} className="font-semibold text-primary underline-offset-4 hover:underline">
            سجّل الدخول
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <Field label="الاسم" name="name" error={errors.name}>
          {(props) => (
            <input {...props} type="text" autoComplete="name" placeholder="اسمك الكريم" value={form.name} onChange={update('name')} className={fieldClass} />
          )}
        </Field>

        <Field label="البريد الإلكتروني" name="email" error={errors.email}>
          {(props) => (
            <input
              {...props}
              type="email"
              dir="ltr"
              autoComplete="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={update('email')}
              className={cn(fieldClass, 'text-right')}
            />
          )}
        </Field>

        <Field label="كلمة المرور" name="password" error={errors.password} hint="٨ أحرف على الأقل">
          {(props) => (
            <PasswordInput {...props} autoComplete="new-password" placeholder="••••••••" value={form.password} onChange={update('password')} />
          )}
        </Field>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">الجنس</span>
          <GenderPicker value={form.gender} onChange={(gender) => setForm((f) => ({ ...f, gender }))} aria-invalid={errors.gender ? true : undefined} />
          {errors.gender ? (
            <p className="text-sm text-destructive">{errors.gender}</p>
          ) : (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="size-3" aria-hidden="true" />
              يُستخدم لعرض الأنشطة المناسبة لك تلقائياً، ولا يمكن تغييره بعد التسجيل
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">
            اهتماماتك <span className="font-normal text-muted-foreground">(اختياري)</span>
          </span>
          <InterestPicker value={interests} onChange={setInterests} />
        </div>

        {serverError && (
          <p role="alert" className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            {serverError}
          </p>
        )}

        <button type="submit" disabled={loading} className={cn(pill({ size: 'lg' }), 'w-full')}>
          <UserPlus aria-hidden="true" />
          {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
        </button>
      </form>
    </AuthShell>
  )
}
