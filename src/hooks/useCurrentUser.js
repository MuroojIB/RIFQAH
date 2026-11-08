import { useCallback, useEffect, useState } from 'react'
import { getCurrentUserProfile } from '@/services/authService'

// Manages session and user profile state
export default function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      const user = await getCurrentUserProfile()
      setCurrentUser(user)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setCurrentUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    getCurrentUserProfile()
      .then((user) => {
        if (!cancelled) setCurrentUser(user)
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error)
        if (!cancelled) setCurrentUser(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { currentUser, loading, refetch: fetchUser }
}

