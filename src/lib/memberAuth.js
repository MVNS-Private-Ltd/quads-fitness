import { supabase } from './supabaseClient';

export const loginMember = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const logoutMember = async () => {
  await supabase.auth.signOut();
};

export const getMemberSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const getMemberToken = async () => {
  const session = await getMemberSession();
  return session?.access_token || null;
};

export const requireMember = async () => {
  const session = await getMemberSession();
  if (!session) {
    window.location.href = '/member/login';
    return false;
  }
  return true;
};
