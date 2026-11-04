import { supabase } from './supabase'

export const getActivities = async (userGender = null) => {
  let query = supabase
    .from('activities')
    .select(`
      *,
      users:creator_id (name, gender)
    `)
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

export { fetchActivityDetails, joinActivity, leaveActivity }