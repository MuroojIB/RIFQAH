// DB-level join rule errors (see supabase/01_seat_rules.sql)
const JOIN_ERRORS = {
  ACTIVITY_FULL: 'اكتمل العدد قبل لحظات، للأسف فاتتك الفرصة',
  ACTIVITY_ENDED: 'انتهى موعد هذا النشاط',
  ACTIVITY_CANCELLED: 'تم إلغاء هذا النشاط',
  ACTIVITY_NOT_FOUND: 'هذا النشاط لم يعد موجوداً',
  HOST_CANNOT_JOIN: 'أنت منظّم هذا النشاط',
}

export function joinErrorMessage(error) {
  // 23505 = unique_user_activity constraint (already joined)
  if (error?.code === '23505') return 'أنت منضم لهذا النشاط بالفعل'
  return JOIN_ERRORS[error?.message] ?? 'تعذّر الانضمام، حاول مرة أخرى'
}

