import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import SiteFooter from './components/layout/SiteFooter'
import ProtectedRoute from './components/shared/ProtectedRoute'
import ScrollToTop from './components/layout/ScrollToTop'
import { FullPageLoader } from './components/ui/PageState'
import useCurrentUser from './hooks/useCurrentUser'
import Home from './pages/Home'
import Explore from './pages/Explore'
import ActivityDetails from './pages/ActivityDetails'
import CreateActivity from './pages/CreateActivity'
import MyActivities from './pages/MyActivities'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {
  const { currentUser, loading, refetch: fetchUser } = useCurrentUser()

  if (loading) return <FullPageLoader label="جاري تحميل رِفقة..." />

  const protect = (element) => <ProtectedRoute currentUser={currentUser}>{element}</ProtectedRoute>

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-background text-foreground" dir="rtl">
        <Navbar currentUser={currentUser} onLogout={fetchUser} />
        <main className="min-h-[70vh] pb-24 md:pb-0">
          <Routes>
            <Route path="/" element={<Home currentUser={currentUser} />} />
            <Route path="/explore" element={<Explore currentUser={currentUser} />} />
            <Route path="/activities/:id" element={protect(<ActivityDetails currentUser={currentUser} />)} />
            <Route path="/create-activity" element={protect(<CreateActivity currentUser={currentUser} />)} />
            <Route path="/my-activities" element={protect(<MyActivities currentUser={currentUser} />)} />
            <Route path="/profile" element={protect(<Profile currentUser={currentUser} onProfileUpdate={fetchUser} />)} />
            <Route path="/login" element={<Login onLoginSuccess={fetchUser} />} />
            <Route path="/register" element={<Register onRegisterSuccess={fetchUser} />} />
          </Routes>
        </main>
        <SiteFooter />
      </div>
    </Router>
  )
}
