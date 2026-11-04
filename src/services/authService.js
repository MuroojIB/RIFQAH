import { supabase } from "./supabase";

export const signUpUser = async ({
  email,
  password,
  name,
  interests,
  gender,
}) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;

  const userId = authData.user?.id;

  if (userId) {
    const { error: profileError } = await supabase.from("users").insert([
      {
        id: userId,
        name,
        email,
        interests,
        gender,
      },
    ]);

    if (profileError) throw profileError;
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

  const { data: userProfile, error: profileError } = await supabase
    .from("users")
    .select("*")
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
    .select();

  if (error) throw error;
  return data;
};
