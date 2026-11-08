import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Compass, House, LayoutGrid, LogIn, LogOut, Plus } from 'lucide-react'
import { cn } from '@/utils/cn'
import { pill } from '@/utils/ui'
import { toPerson } from '@/utils/activities'
import { signOutUser } from '../../services/authService'
import Logo from './Logo'
import PersonAvatar from '../shared/PersonAvatar'

const HOME = { to: '/', label: 'الرئيسية', icon: House }
const EXPLORE = { to: '/explore', label: 'استكشف', icon: Compass }
const MY_SPACE = { to: '/my-activities', label: 'مساحتي', icon: LayoutGrid }
const CREATE = { to: '/create-activity', label: 'أنشئ', icon: Plus }
const LOGIN = { to: '/login', label: 'دخول', icon: LogIn }

function isActive(pathname, to) {
  if (to === '/') return pathname === '/'
  if (to === '/explore') return pathname.startsWith('/explore') || pathname.startsWith('/activities')
  return pathname.startsWith(to)
}

export default function Navbar({ currentUser, onLogout }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const desktopLinks = currentUser ? [HOME, EXPLORE, MY_SPACE] : [HOME, EXPLORE]
  const mobileLinks = currentUser ? [HOME, EXPLORE, CREATE, MY_SPACE] : [HOME, EXPLORE, LOGIN]

  const handleLogout = async () => {
    try {
      await signOutUser()
      if (onLogout) await onLogout()
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
          <Logo />

          <nav aria-label="التنقل الرئيسي" className="hidden md:block">
            <ul className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
              {desktopLinks.map((link) => {
                const active = isActive(pathname, link.to)
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'block rounded-full px-5 py-2 text-sm font-medium transition-colors',
                        active ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            {currentUser ? (
              <>
                <Link to="/create-activity" className={cn(pill({ size: 'sm' }), 'hidden md:inline-flex')}>
                  <Plus aria-hidden="true" />
                  أنشئ نشاطاً
                </Link>
                <Link to="/profile" aria-label={`ملفي الشخصي: ${currentUser.name}`} className="rounded-full">
                  <PersonAvatar person={toPerson(currentUser.id, currentUser.name)} size="md" />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="تسجيل الخروج"
                  title="تسجيل الخروج"
                  className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-destructive"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={cn(pill({ variant: 'ghost', size: 'sm' }), 'hidden md:inline-flex')}>
                  تسجيل الدخول
                </Link>
                <Link to="/register" className={pill({ size: 'sm' })}>
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <nav
        aria-label="التنقل السفلي"
        className="fixed inset-x-3 bottom-3 z-40 rounded-full border border-border bg-card/95 shadow-lg shadow-foreground/5 backdrop-blur md:hidden"
      >
        <ul className={cn('grid items-center p-1.5', mobileLinks.length === 4 ? 'grid-cols-4' : 'grid-cols-3')}>
          {mobileLinks.map((link) => {
            const active = isActive(pathname, link.to)
            const Icon = link.icon
            const isCreate = link === CREATE
            return (
              <li key={link.to} className="flex justify-center">
                <Link
                  to={link.to}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors',
                    isCreate
                      ? 'bg-primary text-primary-foreground'
                      : active
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground',
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}

