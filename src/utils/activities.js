// Activity data layer — adapter between Supabase rows and UI objects
import { nowLocalString } from './format'

export const CATEGORIES = [
  { id: 'sports', label: 'رياضة', image: '/images/cat-sports.webp', bg: 'bg-cat-sports', description: 'جري، بادل، كرة، ودراجات' },
  { id: 'arts', label: 'فن وثقافة', image: '/images/cat-arts.webp', bg: 'bg-cat-arts', description: 'ورش رسم، متاحف، ومعارض' },
  { id: 'learning', label: 'تعليم وتعلم', image: '/images/cat-learning.webp', bg: 'bg-cat-learning', description: 'أندية قراءة وورش مهارات' },
  { id: 'games', label: 'ألعاب وترفيه', image: '/images/cat-games.webp', bg: 'bg-cat-games', description: 'ألعاب لوحية وليالي مرح' },
  { id: 'adventure', label: 'مغامرات', image: '/images/cat-adventure.webp', bg: 'bg-cat-adventure', description: 'هايكنج، تخييم، واستكشاف' },
  { id: 'social', label: 'أنشطة اجتماعية', image: '/images/cat-social.webp', bg: 'bg-cat-social', description: 'قهوة، تعارف، ولقاءات' },
]

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]))
const CATEGORY_BY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.label, c.id]))

export const isCategoryId = (id) => id in CATEGORY_MAP
export const categoryIdFromLabel = (label) => CATEGORY_BY_LABEL[label] ?? 'social'
export const categoryLabelFromId = (id) => CATEGORY_MAP[id]?.label ?? CATEGORY_MAP.social.label

// Deterministic color tone derived from user id
export function toneFor(id = '') {
  let hash = 0
  for (const ch of String(id)) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return CATEGORIES[hash % CATEGORIES.length].id
}

export const toPerson = (id, name) => ({ id, name: name || 'مستخدم', tone: toneFor(id || name) })

// Sort activities ascending by date + time
export const byDate = (a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)

// Splits a timestamptz value into local { date, time } strings
export function splitDateTime(value) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return { date: '1970-01-01', time: '00:00' }
  const local = nowLocalString(d)
  return { date: local.slice(0, 10), time: local.slice(11, 16) }
}

// Local datetime string (no timezone) — for comparison with nowLocalString only
export const localDateTime = (date, time) => `${date}T${time}`

// ISO instant from local date + time — sent to the timestamptz column
export const toInstant = (date, time) => new Date(localDateTime(date, time)).toISOString()

// Maps a Supabase row to the UI activity object
export function toActivity(row) {
  const { date, time } = splitDateTime(row.date_time)
  const participants = (row.participants ?? []).map((p) => toPerson(p.user_id, p.users?.name || 'مشارك'))
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    category: categoryIdFromLabel(row.category),
    date,
    time,
    location: row.location,
    maxMembers: row.max_members,
    dbStatus: row.status,
    host: toPerson(row.creator_id, row.users?.name),
    hostId: row.creator_id,
    participants,
    participantIds: participants.map((p) => p.id),
  }
}

export function getStatus(activity) {
  if (activity.dbStatus === 'cancelled') return 'cancelled'
  const started = `${activity.date}T${activity.time}` < nowLocalString()
  if (activity.dbStatus === 'completed' || started) return 'completed'
  if (activity.participantIds.length >= activity.maxMembers) return 'full'
  return 'open'
}

export const getImage = (activity) => CATEGORY_MAP[activity.category].image

