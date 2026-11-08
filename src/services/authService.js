import { supabase } from "./supabase";

export const signUpUser = async ({
  email,
  password,
  name,
  interests,
  gender,
}) => {
  // نمرّر بيانات الملف الشخصي كـ metadata: trigger في قاعدة البيانات
  // (supabase/02_security_rls.sql) ينشئ صف users تلقائياً، ويعمل حتى مع
  // تفعيل تأكيد البريد الإلكتروني حيث لا توجد جلسة بعد التسجيل.
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, gender, interests } },
  });

  if (authError) throw authError;

  // مع تفعيل تأكيد البريد، إعادة التسجيل ببريد موجود لا تُرجع خطأ بل مستخدماً
  // وهمياً بلا identities (حماية من تخمين البريدات). نحوّله لخطأ مفهوم.
  if (authData.user && authData.user.identities?.length === 0) {
    const exists = new Error("User already registered");
    exists.code = "user_already_exists";
    throw exists;
  }

  const userId = authData.user?.id;

  if (userId) {
    // احتياط: لو لم يُشغَّل الـ trigger بعد، ننشئ الصف من هنا.
    // ignoreDuplicates = "ON CONFLICT DO NOTHING" فلا يعدّل صفاً أنشأه الـ trigger.
    const { error: profileError } = await supabase
      .from("users")
      .upsert([{ id: userId, name, email, interests, gender }], {
        onConflict: "id",
        ignoreDuplicates: true,
      });

    // 42501 = رفض صلاحية: يحدث عند تفعيل تأكيد البريد (لا جلسة) والـ trigger أنشأ الصف أصلاً
    if (profileError && profileError.code !== "42501") throw profileError;
  }

  return authData;
};

export const signInUser = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUserProfile = async () => {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError || !session) return null;

  const userId = session.user.id;

  // أعمدة محددة (لا select("*")): عمود email مخفي عن الـ API بصلاحيات الأعمدة،
  // والبريد يأتي من جلسة المصادقة نفسها (session.user.email).
  const { data: userProfile, error: profileError } = await supabase
    .from("users")
    .select("id, name, gender, interests, created_at")
    .eq("id", userId)
    .single();

  if (profileError) return null;

  return { ...session.user, ...userProfile };
};

export const updateUserProfile = async (userId, { name, interests }) => {
  const { data, error } = await supabase
    .from("users")
    .update({ name, interests })
    .eq("id", userId)
    .select("id, name, interests");

  if (error) throw error;
  return data;
};
