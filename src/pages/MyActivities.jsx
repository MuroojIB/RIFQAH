import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Plus, Trash2 } from "lucide-react";
import { supabase } from "../services/supabase";

export default function MyActivities({ currentUser }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("created"); // 'created' or 'joined'
  const [createdActivities, setCreatedActivities] = useState([]);
  const [joinedActivities, setJoinedActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyData = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);

      const { data: created, error: createdError } = await supabase
        .from("activities")
        .select("*")
        .eq("creator_id", currentUser.id)
        .order("date_time", { ascending: true });

      if (createdError) throw createdError;
      setCreatedActivities(created || []);

      const { data: joined, error: joinedError } = await supabase
        .from("participants")
        .select(
          `
          activities (*)
        `,
        )
        .eq("user_id", currentUser.id);

      if (joinedError) throw joinedError;
      const formattedJoined = joined
        .map((item) => item.activities)
        .filter(Boolean);
      setJoinedActivities(formattedJoined);
    } catch (error) {
      console.error("خطأ في جلب بيانات مساحتي:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyData();
  }, [currentUser]);

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm("هل أنت متأكد من رغبتك في حذف هذا النشاط؟")) return;

    try {
      const { error } = await supabase
        .from("activities")
        .delete()
        .eq("id", activityId);

      if (error) throw error;
      alert("تم حذف النشاط بنجاح.");
      fetchMyData();
    } catch (error) {
      console.error("خطأ في حذف النشاط:", error);
      alert("حدث خطأ أثناء حذف النشاط.");
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          يجب تسجيل الدخول
        </h2>
        <p className="text-gray-600 mb-6">
          لعرض مساحتك الشخصية وإدارة أنشطتك، يرجى تسجيل الدخول أولاً.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors"
        >
          تسجيل الدخول
        </button>
      </div>
    );
  }

  const currentList =
    activeTab === "created" ? createdActivities : joinedActivities;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مساحتي</h1>
          <p className="text-gray-600">
            إدارة الأنشطة التي أنشأتها وتلك التي انضممت إليها.
          </p>
        </div>
        <button
          onClick={() => navigate("/create-activity")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} /> إنشاء نشاط جديد
        </button>
      </div>

      {/* التبويبات */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab("created")}
          className={`pb-4 px-6 font-medium text-sm transition-colors border-b-2 ${
            activeTab === "created"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          الأنشطة التي أنشأتها ({createdActivities.length})
        </button>
        <button
          onClick={() => setActiveTab("joined")}
          className={`pb-4 px-6 font-medium text-sm transition-colors border-b-2 ${
            activeTab === "joined"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          الأنشطة التي انضممت إليها ({joinedActivities.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          جاري تحميل الأنشطة...
        </div>
      ) : currentList.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
          {activeTab === "created"
            ? "لم تقم بإنشاء أي نشاط بعد."
            : "لم تنضم لأي نشاط بعد."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentList.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {activity.category}
                  </span>
                  {activeTab === "created" && (
                    <button
                      onClick={() => handleDeleteActivity(activity.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="حذف النشاط"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {activity.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {activity.description}
                </p>

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-purple-600" />
                    <span>
                      {new Date(activity.date_time).toLocaleDateString("ar-SA")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-purple-600" />
                    <span>{activity.location}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Users size={14} className="text-purple-600" /> الحد الأقصى:{" "}
                  {activity.max_members}
                </span>
                <button
                  onClick={() => navigate(`/activities/${activity.id}`)}
                  className="bg-purple-50 text-purple-600 hover:bg-purple-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  التفاصيل
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
