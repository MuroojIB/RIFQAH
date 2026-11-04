import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { getActivities } from '../services/activityService'
import ActivityCard from '../components/ActivityCard'

export default function Explore({ currentUser }) {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('الكل')

  const categories = ['الكل', 'رياضة', 'فن وثقافة', 'تعليم وتعلم', 'ألعاب وترفيه', 'مغامرات', 'أنشطة اجتماعية']

  useEffect(() => {
    const fetchActivitiesData = async () => {
      try {
        setLoading(true)
        const userGender = currentUser ? currentUser.gender : null
        const data = await getActivities(userGender)
        setActivities(data)
      } catch (error) {
        console.error('خطأ في تحميل الأنشطة:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivitiesData()
  }, [currentUser])

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'الكل' || activity.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">استكشف الأنشطة القريبة</h1>
        <p className="text-gray-600">ابحث عن نشاط يشاركك الاهتمام وانضم إليه برفقة الآخرين.</p>
      </div>

      <div className="max-w-xl mx-auto mb-6 relative">
        <Search className="absolute right-4 top-3.5 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="ابحث عن اسم النشاط أو محتواه..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-12 pl-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">جاري تحميل الأنشطة...</div>
      ) : filteredActivities.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
          لا توجد أنشطة مطابقة لبحثك حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} currentUser={currentUser} />
          ))}
        </div>
      )}
    </div>
  )
}