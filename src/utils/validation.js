const EMAIL = /^\S+@\S+\.\S+$/

export const validateName = (v) => (v.trim().length >= 2 ? '' : 'اكتب اسمك (حرفان على الأقل)')
export const validateEmail = (v) => (EMAIL.test(v.trim()) ? '' : 'اكتب بريداً إلكترونياً صحيحاً')
export const validatePassword = (v) => (v.length >= 8 ? '' : 'كلمة المرور ٨ أحرف على الأقل')

// Strip empty error entries
const compact = (errors) => Object.fromEntries(Object.entries(errors).filter(([, msg]) => msg))

export function validateLogin({ email, password }) {
  return compact({
    email: validateEmail(email),
    password: password ? '' : 'اكتب كلمة المرور',
  })
}

export function validateRegister({ name, email, password, gender }) {
  return compact({
    name: validateName(name),
    email: validateEmail(email),
    password: validatePassword(password),
    gender: gender === 'male' || gender === 'female' ? '' : 'اختر الجنس',
  })
}

// Translates Supabase Auth errors to Arabic user-facing messages
export function friendlyAuthError(error) {
  const code = error?.code
  const msg = String(error?.message ?? '').toLowerCase()

  if (code === 'over_email_send_rate_limit' || msg.includes('email rate limit'))
    return 'تعذّر إرسال رسالة التأكيد الآن (تجاوز حد الإرسال) حاول بعد قليل'
  if (code === 'email_address_not_authorized')
    return 'تعذّر إرسال رسالة التأكيد لهذا البريد حالياً'
  if (code === 'email_not_confirmed' || msg.includes('email not confirmed'))
    return 'فعّل بريدك الإلكتروني أولاً من الرسالة التي وصلتك، ثم سجّل الدخول'
  if (code === 'user_already_exists' || msg.includes('already registered') || msg.includes('already been registered'))
    return 'هذا البريد مسجّل مسبقاً، جرّب تسجيل الدخول'
  if (code === 'invalid_credentials' || msg.includes('invalid login credentials'))
    return 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
  if (msg.includes('rate limit') || msg.includes('too many')) return 'محاولات كثيرة، انتظر قليلاً ثم أعد المحاولة'
  if (msg.includes('database error')) return 'تعذّر إنشاء الحساب، تأكد من البيانات وحاول مرة أخرى'
  if (msg.includes('password')) return 'كلمة المرور لا تستوفي الشروط، جرّب كلمة أقوى'
  if (msg.includes('fetch') || msg.includes('network')) return 'تعذّر الاتصال بالخادم، تحقق من الإنترنت'
  return 'حدث خطأ غير متوقع، حاول مرة أخرى'
}

