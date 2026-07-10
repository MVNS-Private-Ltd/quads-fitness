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
const loadLocal = (key) => {
  try {
    const val = localStorage.getItem(`memberApi_${key}`);
    return val ? JSON.parse(val) : null;
  } catch (e) {
    return null;
  }
};

const saveLocal = (key, data) => {
  try {
    if (data === null) {
      localStorage.removeItem(`memberApi_${key}`);
    } else {
      localStorage.setItem(`memberApi_${key}`, JSON.stringify(data));
    }
  } catch (e) {}
};

let meCache = loadLocal('me');
let offersCache = loadLocal('offers');
let progressCache = loadLocal('progress');
let reviewCache = loadLocal('review');
let attendanceCache = loadLocal('attendance');
let dietPlansCache = loadLocal('dietPlans');

// Promise caching to prevent duplicate simultaneous requests
let pendingRequests = {};

async function fetchWithDedup(key, endpoint, options = {}) {
  if (pendingRequests[key]) return pendingRequests[key];
  
  const promise = memberApiRequest(endpoint, options).then(data => {
    saveLocal(key, data);
    delete pendingRequests[key];
    return data;
  }).catch(err => {
    delete pendingRequests[key];
    throw err;
  });
  
  pendingRequests[key] = promise;
  return promise;
}

export const clearMemberCache = () => {
  meCache = null; offersCache = null; progressCache = null; reviewCache = null; attendanceCache = null; dietPlansCache = null;
  saveLocal('me', null); saveLocal('offers', null); saveLocal('progress', null); saveLocal('review', null); saveLocal('attendance', null); saveLocal('dietPlans', null);
};

export const getCachedMe = () => meCache;

export const getMe = async (forceRefresh = false) => {
  if (meCache && !forceRefresh) return meCache;
  meCache = await fetchWithDedup('me', '/me');
  return meCache;
};

export const updateMe = async (data) => {
  const result = await memberApiRequest('/me', { method: 'PUT', body: data });
  meCache = result;
  saveLocal('me', result);
  return result;
};

export const getCachedProgressLogs = () => progressCache;

export const getMyProgressLogs = async (forceRefresh = false) => {
  if (progressCache && !forceRefresh) return progressCache;
  progressCache = await fetchWithDedup('progress', '/progress');
  return progressCache;
};

export const addMyProgressLog = async (data) => {
  const result = await memberApiRequest('/progress', { method: 'POST', body: data });
  meCache = null; saveLocal('me', null);
  progressCache = null; saveLocal('progress', null);
  return result;
};

export const getCachedOffers = () => offersCache;

export const getMemberOffers = async (forceRefresh = false) => {
  if (offersCache && !forceRefresh) return offersCache;
  offersCache = await fetchWithDedup('offers', '/offers');
  return offersCache;
};

export const getCachedReview = () => reviewCache;

export const getMyReview = async (forceRefresh = false) => {
  if (reviewCache && !forceRefresh) return reviewCache;
  reviewCache = await fetchWithDedup('review', '/review/me');
  return reviewCache;
};

export const submitReview = async (data) => {
  const result = await memberApiRequest('/review', { method: 'POST', body: data });
  reviewCache = result;
  saveLocal('review', result);
  return result;
};

export const markMyAttendance = async () => {
  const result = await memberApiRequest('/attendance/mark', { method: 'POST' });
  meCache = null; saveLocal('me', null);
  return result;
};

export const getCachedDietPlans = () => dietPlansCache;

export const getMemberDietPlans = async (forceRefresh = false) => {
  if (dietPlansCache && !forceRefresh) return dietPlansCache;
  dietPlansCache = await fetchWithDedup('dietPlans', '/diet-plans');
  return dietPlansCache;
};
