import { useMemo } from 'react'
import { byDate, getStatus } from '@/utils/activities'
import useActivities from '../hooks/useActivities'
import Hero from '../components/landing/Hero'
import CategoryMarquee from '../components/landing/CategoryMarquee'
import Features from '../components/landing/Features'
import CategoryGrid from '../components/landing/CategoryGrid'
import UpcomingActivities from '../components/landing/UpcomingActivities'
import ClosingCta from '../components/landing/ClosingCta'

export default function Home({ currentUser }) {
  const { activities, status } = useActivities(currentUser)

  const open = useMemo(() => activities.filter((a) => getStatus(a) === 'open').sort(byDate), [activities])
  const upcoming = useMemo(() => open.filter((a) => a.hostId !== currentUser?.id).slice(0, 3), [open, currentUser])

  return (
    <>
      <Hero next={open[0] ?? null} />
      <CategoryMarquee />
      <Features />
      <CategoryGrid />
      <UpcomingActivities upcoming={upcoming} loading={status === 'loading'} currentUser={currentUser} />
      <ClosingCta />
    </>
  )
}
