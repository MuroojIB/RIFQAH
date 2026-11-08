import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { fieldClass, pill } from '@/utils/ui'
import { cn } from '@/utils/cn'
import { friendlyAuthError, validateLogin } from '@/utils/validation'
import { signInUser } from '../services/authService'
import AuthShell from '../components/shared/AuthShell'
import Field from '../components/ui/Field'
import PasswordInput from '../components/ui/PasswordInput'

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/explore'

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = validateLogin(form)
    setErrors(next)
    setServerError('')
    if (Object.keys(next).length) return

    try {
      setLoading(true)
      await signInUser({ email: form.email.trim(), password: form.password })
      if (onLoginSuccess) await onLoginSuccess()
      navigate(redirectTo, { replace: true })
    } catch (error) {
      console.error('Error signing in:', error)
      setServerError(friendlyAuthError(error))
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="أهلاً بعودتك"
      subtitle="سجّل دخولك لتنضم إلى الأنشطة وتدير مساحتك"
      footer={
        <>
          ليس لديك حساب؟{' '}
          <Link to="/register" state={location.state} className="font-semibold text-primary underline-offset-4 hover:underline">
            أنشئ حساباً جديداً
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
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

        <Field label="كلمة المرور" name="password" error={errors.password}>
          {(props) => (
            <PasswordInput {...props} autoComplete="current-password" placeholder="••••••••" value={form.password} onChange={update('password')} />
          )}
        </Field>

        {serverError && (
          <p role="alert" className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            {serverError}
          </p>
        )}

        <button type="submit" disabled={loading} className={cn(pill({ size: 'lg' }), 'w-full')}>
          <LogIn aria-hidden="true" className="-scale-x-100" />
          {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
        </button>
      </form>
    </AuthShell>
  )
}
