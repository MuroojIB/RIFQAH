import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle, Calendar, MapPin, Users, FileText, Tag } from 'lucide-react'
import { createActivity } from '../services/activityService'

export default function CreateActivity({ currentUser }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'رياضة',
    location: '',
    date_time: '',
    max_members: 5
  })

  const categories = ['رياضة', 'فن وثقافة', 'تعليم وتعلم', 'ألعاب وترفيه', 'مغامرات', 'أنشطة اجتماعية']

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!currentUser) {
      alert('يجب تسجيل الدخول لإنشاء نشاط.')
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      await createActivity({
        ...formData,
        creator_id: currentUser.id,
        status: 'open'
      })
      alert('تم نشر النشاط بنجاح! 🎉')
      navigate('/explore')
    } catch (error) {
      console.error('خطأ في إنشاء النشاط:', error)
      alert('حدث خطأ أثناء نشر النشاط، تأكد من البيانات.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-3 rounded-2xl text-purple-600">
            <PlusCircle size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إنشاء نشاط جديد</h1>
            <p className="text-gray-500 text-sm">شارك اهتمامك وادعُ الآخرين للانضمام إليك برفقة.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">عنوان النشاط</label>
            <div className="relative">
              <FileText className="absolute right-3 top-3.5 text-gray-400" size={18} />
              <input
                type="text"
                name="title"
                required
                placeholder="مثلاً: جولة تصوير في حديقة الملك عبد الله"
                value={formData.title}
                onChange={handleChange}
                className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
            <div className="relative">
              <Tag className="absolute right-3 top-3.5 text-gray-400" size={18} />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">وصف النشاط</label>
            <textarea
              name="description"
              rows="4"
              required
              placeholder="اكتب تفاصيل أكثر عن النشاط وماذا سيقوم المشاركون..."
              value={formData.description}
              onChange={handleChange}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">موعد النشاط</label>
              <div className="relative">
                <Calendar className="absolute right-3 top-3.5 text-gray-400" size={18} />
                <input
                  type="datetime-local"
                  name="date_time"
                  required
                  value={formData.date_time}
                  onChange={handleChange}
                  className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الحد الأقصى للمشاركين</label>
              <div className="relative">
                <Users className="absolute right-3 top-3.5 text-gray-400" size={18} />
                <input
                  type="number"
                  name="max_members"
                  min="2"
                  max="50"
                  required
                  value={formData.max_members}
                  onChange={handleChange}
                  className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الموقع أو الرابط</label>
            <div className="relative">
              <MapPin className="absolute right-3 top-3.5 text-gray-400" size={18} />
              <input
                type="text"
                name="location"
                required
                placeholder="مثلاً: الرياض، حي المداين أو رابط موقع خارجي"
                value={formData.location}
                onChange={handleChange}
                className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'جاري النشر...' : 'نشر النشاط'}
          </button>
        </form>
      </div>
    </div>
  )
}