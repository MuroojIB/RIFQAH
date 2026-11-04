import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Users, User } from 'lucide-react'

export default function ActivityCard({ activity, currentUser }) {
  const navigate = useNavigate()

  const handleViewDetails = () => {
    if (!currentUser) {
      alert('يجب تسجيل الدخول أولاً لعرض تفاصيل النشاط والانضمام إليه.')
      navigate('/login')
    } else {
      navigate(`/activities/${activity.id}`)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
            {activity.category}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <User size={14} /> المنشئ: {activity.users?.name || 'مستخدم'}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-2">{activity.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{activity.description}</p>

        <div className="space-y-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-purple-600" />
            <span>{new Date(activity.date_time).toLocaleDateString('ar-SA')}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-purple-600" />
            <span>{activity.location}</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Users size={16} className="text-purple-600" />
          <span>الحد الأقصى: {activity.max_members}</span>
        </div>

        <button
          onClick={handleViewDetails}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          عرض التفاصيل
        </button>
      </div>
    </div>
  )
}