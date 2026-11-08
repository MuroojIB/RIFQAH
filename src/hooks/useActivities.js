import { useEffect, useState } from 'react'
import { getActivities } from '../services/activityService'
import { toActivity } from '@/utils/activities'

/**
 * يجلب الأنشطة ويحوّلها لشكل الواجهة
 * الفلترة التلقائية حسب الجنس: المستخدم المسجّل يمرّر جنسه، والزائر لا يمرّر شيئاً
 */
export default function useActivities(currentUser) {
  const gender = currentUser?.gender ?? null
  const [state, setState] = useState({ status: 'loading', activities: [] })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    getActivities(gender)
      .then((rows) => {
        if (!cancelled) setState({ status: 'ready', activities: rows.map(toActivity) })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error', activities: [] })
      })
    return () => {
      cancelled = true
    }
  }, [gender, attempt])

  const retry = () => {
    setState((s) => ({ ...s, status: 'loading' }))
    setAttempt((a) => a + 1)
  }

  return { ...state, retry }
}
