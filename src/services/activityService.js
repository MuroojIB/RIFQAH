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