import { supabase } from './supabase'

const CREATOR = 'users:creator_id (id, name, gender)'
const SEATS = 'participants (id, user_id)'
const ACTIVITY_FIELDS = `*, ${CREATOR}, ${SEATS}`

/**
 * جلب الأنشطة للاستكشاف.
 * - الزائر (userGender = null): يرى كل الأنشطة
 * - المستخدم المسجّل: تُفلتر الأنشطة تلقائياً حسب جنسه
 *
 * ملاحظة: الفلترة على جدول مضمَّن (embedded) تحتاج `!inner`،
 * وإلا يُرجع PostgREST كل الأنشطة ويجعل users = null فقط للأنشطة غير المطابقة
 */
export const getActivities = async (userGender = null) => {
  const creator = userGender ? 'users:creator_id!inner (id, name, gender)' : CREATOR

  let query = supabase
    .from('activities')
    .select(`*, ${creator}, ${SEATS}`)
    .order('date_time', { ascending: true })

  if (userGender) {
    query = query.eq('users.gender', userGender)
  }

  const { data, error } = await query

  if (error) {
    console.error('خطأ في جلب الأنشطة:', error)
    throw error
  }

  return data || []
}

export const createActivity = async (activityData) => {
  const { data, error } = await supabase
    .from('activities')
    .insert([activityData])
    .select()

  if (error) throw error
  return data[0]
}

const fetchActivityDetails = async (activityId) => {
  const { data: activity, error: activityError } = await supabase
    .from('activities')
    .select(`
      *,
      users:creator_id (id, name, gender),
      participants (
        id,
        user_id,
        users:user_id (id, name)
      )
    `)
    .eq('id', activityId)
    .single()

  if (activityError) throw activityError
  return activity
}

const joinActivity = async (activityId, userId) => {
  const { data, error } = await supabase
    .from('participants')
    .insert([{ activity_id: activityId, user_id: userId }])
    .select()

  if (error) throw error
  return data[0]
}

const leaveActivity = async (activityId, userId) => {
  const { error } = await supabase
    .from('participants')
    .delete()
    .eq('activity_id', activityId)
    .eq('user_id', userId)

  if (error) throw error
  return true
}

/** مساحتي: الأنشطة التي أنشأها المستخدم + التي انضم إليها */
const getMyActivities = async (userId) => {
  const [createdRes, joinedRes] = await Promise.all([
    supabase
      .from('activities')
      .select(ACTIVITY_FIELDS)
      .eq('creator_id', userId)
      .order('date_time', { ascending: true }),
    supabase
      .from('participants')
      .select(`activities (${ACTIVITY_FIELDS})`)
      .eq('user_id', userId),
  ])

  if (createdRes.error) throw createdRes.error
  if (joinedRes.error) throw joinedRes.error

  const joined = (joinedRes.data || [])
    .map((item) => item.activities)
    .filter(Boolean)
    .sort((a, b) => String(a.date_time).localeCompare(String(b.date_time)))

  return { created: createdRes.data || [], joined }
}

/** إلغاء نشاط (يبقى ظاهراً بحالة "ملغي" في مساحتي وتفاصيل النشاط) */
const cancelActivity = async (activityId) => {
  const { data, error } = await supabase
    .from('activities')
    .update({ status: 'cancelled' })
    .eq('id', activityId)
    .select()

  if (error) throw error
  // RLS لا يرمي خطأ عند منع التعديل، بل يُرجع 0 صفوف
  if (!data || data.length === 0) {
    throw new Error('لا تملك صلاحية إلغاء هذا النشاط')
  }
  return data[0]
}

export { fetchActivityDetails, joinActivity, leaveActivity, getMyActivities, cancelActivity }
