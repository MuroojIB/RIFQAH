import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Compass, Users, Sparkles } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-between">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <span className="bg-purple-50 text-purple-700 text-sm font-semibold px-4 py-1.5 rounded-full inline-block mb-6">
          كل تجربة أحلى برفقة.
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
          ابحث عن أشخاص يشاركونك شغفك، وانطلقوا معاً.
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          منصة اجتماعية تربطك بأشخاص حقيقيين لتنفيذ الأنشطة، الهوايات، والفعاليات بكل سهولة وأمان.
        </p>
        <button
          onClick={() => navigate('/explore')}
          className="bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium px-8 py-4 rounded-2xl shadow-md transition-all flex items-center gap-2 mx-auto"
        >
          <Compass size={22} /> استكشف الأنشطة الآن
        </button>
      </div>

      {/* Feature Cards */}
      <div className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center text-purple-600 mb-4">
              <Compass size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">اكتشف الأنشطة</h3>
            <p className="text-gray-600 text-sm">تصفح الأنشطة المحلية المتنوعة وانضم لمن يشاركك الاهتمامات تلقائياً.</p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center text-purple-600 mb-4">
              <Sparkles size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">أنشئ نشاطك الخاص</h3>
            <p className="text-gray-600 text-sm">حدد موعدك، مكانك، والعدد الأقصى، وادعُ الآخرين لمشاركتك التجربة.</p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center text-purple-600 mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">مجتمع متكامل</h3>
            <p className="text-gray-600 text-sm">إدارة سهلة لمساحتك الشخصية والأنشطة التي انضممت إليها بكل راحة.</p>
          </div>
        </div>
      </div>
    </div>
  )
}