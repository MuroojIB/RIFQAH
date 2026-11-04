import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, LogOut, Compass, PlusCircle, Home } from 'lucide-react'
import { signOutUser } from '../services/authService'

export default function Navbar({ currentUser, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOutUser()
      if (onLogout) await onLogout()
      navigate('/')
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error)
    }
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-black text-purple-600">رِفقة | RIFQAH</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-purple-600 transition-colors flex items-center gap-1">
            <Home size={16} /> الرئيسية
          </Link>
          <Link to="/explore" className="hover:text-purple-600 transition-colors flex items-center gap-1">
            <Compass size={16} /> استكشف
          </Link>
          {currentUser && (
            <Link to="/my-activities" className="hover:text-purple-600 transition-colors">
              مساحتي
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <Link
                to="/create-activity"
                className="bg-purple-50 text-purple-600 hover:bg-purple-100 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <PlusCircle size={18} /> أنشئ نشاطاً
              </Link>
              <Link
                to="/profile"
                className="p-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors"
                title="الملف الشخصي"
              >
                <User size={18} />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-gray-700 hover:text-purple-600 px-4 py-2 text-sm font-medium transition-colors"
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/register"
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
              >
                إنشاء حساب
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}