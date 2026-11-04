import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { getCurrentUserProfile } from './services/authService'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Explore from './pages/Explore'
import ActivityDetails from './pages/ActivityDetails'
import CreateActivity from './pages/CreateActivity'
import MyActivities from './pages/MyActivities'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const user = await getCurrentUserProfile()
      setCurrentUser(user)
    } catch (error) {
      console.error('خطأ في جلب المستخدم الحالي:', error)
      setCurrentUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">جاري تحميل التطبيق...</div>
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900" dir="rtl">
        <Navbar currentUser={currentUser} onLogout={fetchUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore currentUser={currentUser} />} />
          <Route path="/activities/:id" element={<ActivityDetails currentUser={currentUser} />} />
          <Route path="/create-activity" element={<CreateActivity currentUser={currentUser} />} />
          <Route path="/my-activities" element={<MyActivities currentUser={currentUser} />} />
          <Route path="/profile" element={<Profile currentUser={currentUser} onProfileUpdate={fetchUser} />} />
          <Route path="/login" element={<Login onLoginSuccess={fetchUser} />} />
          <Route path="/register" element={<Register onRegisterSuccess={fetchUser} />} />
        </Routes>
      </div>
    </Router>
  )
}