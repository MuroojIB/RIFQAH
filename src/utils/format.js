const baseOptions = { calendar: 'gregory', numberingSystem: 'latn', timeZone: 'UTC' }

const longDate = new Intl.DateTimeFormat('ar', { ...baseOptions, weekday: 'long', day: 'numeric', month: 'long' })
const shortDate = new Intl.DateTimeFormat('ar', { ...baseOptions, day: 'numeric', month: 'short' })

// Treat date strings as floating local time (no timezone shift)
function toDate(date) {
  return new Date(`${date}T00:00:00Z`)
}

const pad = (n) => String(n).padStart(2, '0')

export function todayISO(now = new Date()) {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export function nowLocalString(now = new Date()) {
  return `${todayISO(now)}T${pad(now.getHours())}:${pad(now.getMinutes())}`
}

export function formatLongDate(date) {
  return longDate.format(toDate(date))
}

export function formatShortDate(date) {
  return shortDate.format(toDate(date))
}

export function formatTime(time) {
  const [h, m] = time.split(':').map(Number)
  const period = h < 12 ? 'ص' : 'م'
  const hour12 = h % 12 || 12
  return `${hour12}:${pad(m)} ${period}`
}

// Returns a human-readable relative day label, falls back to short date
export function relativeDay(date) {
  const diff = Math.round((toDate(date) - toDate(todayISO())) / 86400000)
  if (diff === 0) return 'يبدأ اليوم'
  if (diff === 1) return 'يبدأ غداً'
  if (diff === 2) return 'يبدأ بعد يومين'
  if (diff > 2 && diff <= 10) return `يبدأ بعد ${diff} أيام`
  return formatShortDate(date)
}

export function initials(name = '') {
  return name.trim().charAt(0)
}

