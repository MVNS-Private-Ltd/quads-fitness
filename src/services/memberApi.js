import { getMemberToken } from '../lib/memberAuth';
import { buildApiUrl } from '../lib/apiBase';

async function memberApiRequest(endpoint, options = {}) {
  const url = buildApiUrl(`/member-portal${endpoint}`);
  
  const headers = {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    ...options.headers,
  };

  const token = await getMemberToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    throw new Error("No active member session");
  }

  if (!(options.body instanceof FormData) && typeof options.body === 'object') {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, { ...options, headers, cache: 'no-store' });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP Error ${response.status}`);
  }
  
  return response.json();
}

// Caching for smooth navigation
let meCache = null;
let offersCache = null;
let progressCache = null;
let reviewCache = null;
let attendanceCache = null;
let dietPlansCache = null;

export const clearMemberCache = () => {
  meCache = null;
  offersCache = null;
  progressCache = null;
  reviewCache = null;
  attendanceCache = null;
  dietPlansCache = null;
};

export const getCachedMe = () => meCache;

export const getMe = async (forceRefresh = false) => {
  if (meCache && !forceRefresh) return meCache;
  meCache = await memberApiRequest('/me');
  return meCache;
};

export const updateMe = async (data) => {
  const result = await memberApiRequest('/me', { method: 'PUT', body: data });
  meCache = result; // Update cache immediately
  return result;
};

export const getCachedProgressLogs = () => progressCache;

export const getMyProgressLogs = async (forceRefresh = false) => {
  if (progressCache && !forceRefresh) return progressCache;
  progressCache = await memberApiRequest('/progress');
  return progressCache;
};

export const addMyProgressLog = async (data) => {
  const result = await memberApiRequest('/progress', { method: 'POST', body: data });
  meCache = null; // Invalidate so next getMe gets updated logs
  progressCache = null; // Invalidate progress logs cache
  return result;
};

export const getCachedOffers = () => offersCache;

export const getMemberOffers = async (forceRefresh = false) => {
  if (offersCache && !forceRefresh) return offersCache;
  offersCache = await memberApiRequest('/offers');
  return offersCache;
};

export const getCachedReview = () => reviewCache;

export const getMyReview = async (forceRefresh = false) => {
  if (reviewCache && !forceRefresh) return reviewCache;
  reviewCache = await memberApiRequest('/review/me');
  return reviewCache;
};

export const submitReview = async (data) => {
  const result = await memberApiRequest('/review', { method: 'POST', body: data });
  reviewCache = result; // Update cache
  return result;
};

export const markMyAttendance = async () => {
  const result = await memberApiRequest('/attendance/mark', { method: 'POST' });
  meCache = null; // Invalidate so next getMe gets new attendance
  return result;
};

export const getCachedDietPlans = () => dietPlansCache;

export const getMemberDietPlans = async (forceRefresh = false) => {
  if (dietPlansCache && !forceRefresh) return dietPlansCache;
  dietPlansCache = await memberApiRequest('/diet-plans');
  return dietPlansCache;
};
