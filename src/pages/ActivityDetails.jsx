import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Users, User, ArrowRight, CheckCircle, XCircle } from 'lucide-react'
import { fetchActivityDetails, joinActivity, leaveActivity } from '../services/activityService'

export default function ActivityDetails({ currentUser }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const loadDetails = async () => {
    try {
      setLoading(true)
      const data = await fetchActivityDetails(id)
      setActivity(data)
    } catch (error) {
      console.error('خطأ في جلب تفاصيل النشاط:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDetails()
  }, [id])

  if (loading) return <div className="text-center py-20 text-gray-500">جاري تحميل تفاصيل النشاط...</div>
  if (!activity) return <div className="text-center py-20 text-gray-500">النشاط غير موجود.</div>

  const participants = activity.participants || []
  const isJoined = currentUser && participants.some(p => p.user_id === currentUser.id)
  const isCreator = currentUser && activity.creator_id === currentUser.id
  const isFull = participants.length >= activity.max_members

  const handleJoinToggle = async () => {
    if (!currentUser) {
      alert('يجب تسجيل الدخول للانضمام للنشاط.')
      navigate('/login')
      return
    }

    try {
      setActionLoading(true)
      if (isJoined) {
        await leaveActivity(activity.id, currentUser.id)
        alert('تم الانسحاب من النشاط بنجاح.')
      } else {
        if (isFull) {
          alert('عذراً، النشاط مكتمل العدد.')
          return
        }
        await joinActivity(activity.id, currentUser.id)
        alert('تم انضمامك للنشاط بنجاح! 🚀')
      }
      loadDetails()
    } catch (error) {
      console.error('خطأ في الانضمام/الانسحاب:', error)
      alert('حدث خطأ، حاول مرة أخرى.')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/explore')} className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6 text-sm font-medium">
        <ArrowRight size={16} /> العودة للاستكشاف
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-start mb-4">
          <span className="bg-purple-50 text-purple-700 text-sm font-semibold px-4 py-1.5 rounded-full">
            {activity.category}
          </span>
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <User size={16} /> المنشئ: {activity.users?.name || 'مستخدم'}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{activity.title}</h1>
        <p className="text-gray-600 text-base leading-relaxed mb-6">{activity.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-2xl mb-8">
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="text-purple-600" size={20} />
            <div>
              <span className="block text-xs text-gray-400">موعد النشاط</span>
              <span className="font-medium">{new Date(activity.date_time).toLocaleString('ar-SA')}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <MapPin className="text-purple-600" size={20} />
            <div>
              <span className="block text-xs text-gray-400">الموقع</span>
              <span className="font-medium">{activity.location}</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Users size={20} className="text-purple-600" />
            المشاركون ({participants.length} / {activity.max_members})
          </h3>
          <div className="flex flex-wrap gap-2">
            {participants.length === 0 ? (
              <p className="text-gray-500 text-sm">كن أول من ينضم لهذا النشاط!</p>
            ) : (
              participants.map((p) => (
                <span key={p.id} className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-xl text-sm font-medium">
                  {p.users?.name || 'مشارك'}
                </span>
              ))
            )}
          </div>
        </div>

        {!isCreator && (
          <button
            onClick={handleJoinToggle}
            disabled={actionLoading || (!isJoined && isFull)}
            className={`w-full py-4 rounded-2xl font-medium text-white transition-colors shadow-sm ${
              isJoined
                ? 'bg-red-500 hover:bg-red-600'
                : isFull
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {actionLoading ? 'جاري التنفيذ...' : isJoined ? 'الانسحاب من النشاط' : isFull ? 'النشاط مكتمل العدد' : 'انضم للنشاط'}
          </button>
        )}
      </div>
    </div>
  )
}