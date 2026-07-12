import { supabase } from './supabaseClient';
import { buildApiUrl } from './apiBase';

const verifyTokenWithBackend = async (token) => {
  const response = await fetch(buildApiUrl('/stats'), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Admin access required');
  }

  return true;
};

export const loginAdmin = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  const token = data.session?.access_token;
  if (!token) {
    await supabase.auth.signOut();
    throw new Error('No active admin session returned.');
  }

  try {
    await verifyTokenWithBackend(token);
  } catch (err) {
    await supabase.auth.signOut();
    throw err;
  }

  return data;
};

export const logoutAdmin = async () => {
  await supabase.auth.signOut();
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const getToken = async () => {
  const session = await getSession();
  return session?.access_token || null;
};

export const verifyAdminSession = async () => {
  const session = await getSession();
  if (!session?.access_token) {
    return false;
  }

  try {
    await verifyTokenWithBackend(session.access_token);
    return true;
  } catch (err) {
    // Only sign out if it's explicitly an auth error, to avoid logging out on network errors/cold starts
    if (err.message && (err.message.includes('401') || err.message.includes('403') || err.message.includes('Admin access required'))) {
      await supabase.auth.signOut();
      return false;
    }
    // If it's a network error, we assume the token is still valid
    return true;
  }
};

export const requireAdmin = async () => {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    window.location.href = '/shubham8the8admin/login';
    return false;
  }
  return true;
};
