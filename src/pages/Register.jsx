import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, Tag, Users, UserPlus } from 'lucide-react'
import { signUpUser } from '../services/authService'

export default function Register({ onRegisterSuccess }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    interests: '',
    gender: 'female' // افتراضي
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const interestsArray = formData.interests.split(',').map(i => i.trim()).filter(Boolean)

      await signUpUser({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        interests: interestsArray,
        gender: formData.gender
      })

      alert('تم إنشاء الحساب بنجاح! تم تفعيل الفلترة التلقائية حسب الجنس بنجاح 🎉')
      if (onRegisterSuccess) await onRegisterSuccess()
      navigate('/explore')
    } catch (error) {
      console.error('خطأ في التسجيل:', error)
      alert('حدث خطأ أثناء إنشاء الحساب، تأكد من صحة البيانات.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">انضم إلى منصة رِفقة</h1>
          <p className="text-gray-500 text-sm">كل تجربة أحلى برفقة.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
            <div className="relative">
              <User className="absolute right-3 top-3.5 text-gray-400" size={18} />
              <input
                type="text"
                name="name"
                required
                placeholder="اسمك الكريم"
                value={formData.name}
                onChange={handleChange}
                className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-3 top-3.5 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-3.5 text-gray-400" size={18} />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Users size={16} className="text-purple-600" /> الجنس (لتفعيل الفلترة التلقائية)
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="female">أنثى</option>
              <option value="male">ذكر</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">ملاحظة: لا يمكن تغيير الجنس بعد التسجيل لضمان دقة المجتمع.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاهتمامات (افصل بينها بفاصلة)</label>
            <div className="relative">
              <Tag className="absolute right-3 top-3.5 text-gray-400" size={18} />
              <input
                type="text"
                name="interests"
                placeholder="رياضة, فن, تصوير, قراءة..."
                value={formData.interests}
                onChange={handleChange}
                className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <UserPlus size={18} /> {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          لديك حساب بالفعل؟{' '}
          <Link to="/login" className="text-purple-600 font-medium hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  )
}