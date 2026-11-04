import React, { useState } from 'react'
import { User, Mail, Tag, Lock, Save } from 'lucide-react'
import { updateUserProfile } from '../services/authService'

export default function Profile({ currentUser, onProfileUpdate }) {
  const [name, setName] = useState(currentUser?.name || '')
  const [email] = useState(currentUser?.email || '')
  const [interests, setInterests] = useState(currentUser?.interests?.join(', ') || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!currentUser) return

    try {
      setLoading(true)
      const interestsArray = interests.split(',').map(i => i.trim()).filter(Boolean)
      
      await updateUserProfile(currentUser.id, {
        name,
        interests: interestsArray
      })

      alert('تم تحديث الملف الشخصي بنجاح! ✨')
      if (onProfileUpdate) onProfileUpdate()
    } catch (error) {
      console.error('خطأ في تحديث البروفايل:', error)
      alert('حدث خطأ أثناء التحديث.')
    } finally {
      setLoading(false)
    }
  }

  if (!currentUser) {
    return <div className="text-center py-20 text-gray-500">يرجى تسجيل الدخول لعرض الملف الشخصي.</div>
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-3 rounded-2xl text-purple-600">
            <User size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">الملف الشخصي</h1>
            <p className="text-gray-500 text-sm">إدارة معلومات حسابك الشخصي.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
            <div className="relative">
              <User className="absolute right-3 top-3.5 text-gray-400" size={18} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                disabled
                value={email}
                className="w-full pr-10 pl-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
              <span>الجنس (مسجل رسمياً)</span>
              <span className="text-xs text-purple-600 flex items-center gap-1">
                <Lock size={12} /> مقفل للحفاظ على استقرار المنصة
              </span>
            </label>
            <input
              type="text"
              disabled
              value={currentUser.gender === 'female' ? 'أنثى' : 'ذكر'}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 font-medium cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">حقل الجنس لا يمكن تغييره بعد التسجيل لضمان دقة الفلترة التلقائية للأنشطة.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاهتمامات (افصل بينها بفاصلة)</label>
            <div className="relative">
              <Tag className="absolute right-3 top-3.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="رياضة, فن, تصوير, قراءة..."
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={18} /> {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </button>
        </form>
      </div>
    </div>
  )
}