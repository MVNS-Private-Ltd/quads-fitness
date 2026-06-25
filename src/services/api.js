import { getToken } from '../lib/adminAuth';
import { buildApiUrl } from '../lib/apiBase';

// Standard API request helper
async function apiRequest(endpoint, options = {}) {
  const url = buildApiUrl(endpoint);
  
  const headers = {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    ...options.headers,
  };

  const token = await getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If it's not FormData, we assume it's JSON and add Content-Type
  if (!(options.body instanceof FormData) && typeof options.body === 'object') {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, { ...options, headers, cache: 'no-store' });
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    let message = `HTTP Error ${response.status}`;
    if (errorText) {
      try {
        const errorData = JSON.parse(errorText);
        message = errorData.error || errorData.message || message;
      } catch {
        message = errorText.slice(0, 200) || message;
      }
    }
    throw new Error(message);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('API returned a non-JSON response. Check the production backend URL/proxy configuration.');
  }
  
  return response.json();
}

// ── Members ───────────────────────────────────────────────────────────
export const getMembers = (params = '') => apiRequest(`/members${params}`);
export const getMember = (id) => apiRequest(`/members/${id}`);
export const createMember = (data) => apiRequest('/members', { method: 'POST', body: data });
export const updateMember = (id, data) => apiRequest(`/members/${id}`, { method: 'PUT', body: data });
export const deleteMember = (id) => apiRequest(`/members/${id}`, { method: 'DELETE' });

// ── Programs ──────────────────────────────────────────────────────────
export const getPrograms = (params = '') => apiRequest(`/programs${params}`);
export const createProgram = (data) => {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, v); });
  return apiRequest('/programs', { method: 'POST', body: fd });
};
export const updateProgram = (id, data) => {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, v); });
  return apiRequest(`/programs/${id}`, { method: 'PUT', body: fd });
};
export const deleteProgram = (id) => apiRequest(`/programs/${id}`, { method: 'DELETE' });

// ── Plans ─────────────────────────────────────────────────────────────
export const getPlans = (params = '') => apiRequest(`/plans${params}`);
export const createPlan = (data) => apiRequest('/plans', { method: 'POST', body: data });
export const updatePlan = (id, data) => apiRequest(`/plans/${id}`, { method: 'PUT', body: data });
export const deletePlan = (id) => apiRequest(`/plans/${id}`, { method: 'DELETE' });

// ── Trainers ──────────────────────────────────────────────────────────
export const getTrainers = (params = '') => apiRequest(`/trainers${params}`);
export const createTrainer = (data) => {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, v); });
  return apiRequest('/trainers', { method: 'POST', body: fd });
};
export const updateTrainer = (id, data) => {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, v); });
  return apiRequest(`/trainers/${id}`, { method: 'PUT', body: fd });
};
export const deleteTrainer = (id) => apiRequest(`/trainers/${id}`, { method: 'DELETE' });

// ── Testimonials ──────────────────────────────────────────────────────
export const getTestimonials = (params = '') => apiRequest(`/testimonials${params}`);
export const createTestimonial = (data) => {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, v); });
  return apiRequest('/testimonials', { method: 'POST', body: fd });
};
export const updateTestimonial = (id, data) => {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, v); });
  return apiRequest(`/testimonials/${id}`, { method: 'PUT', body: fd });
};
export const deleteTestimonial = (id) => apiRequest(`/testimonials/${id}`, { method: 'DELETE' });

// ── Offers ────────────────────────────────────────────────────────────
export const getOffers = (params = '') => apiRequest(`/offers${params}`);
export const createOffer = (data) => apiRequest('/offers', { method: 'POST', body: data });
export const updateOffer = (id, data) => apiRequest(`/offers/${id}`, { method: 'PUT', body: data });
export const deleteOffer = (id) => apiRequest(`/offers/${id}`, { method: 'DELETE' });

// ── Leads ─────────────────────────────────────────────────────────────
export const getLeads = (params = '') => apiRequest(`/leads${params}`);
export const createLead = (data) => apiRequest('/leads', { method: 'POST', body: data });
export const updateLead = (id, data) => apiRequest(`/leads/${id}`, { method: 'PUT', body: data });
export const replyToLead = (id, replyMessage) => apiRequest(`/leads/${id}/reply`, { method: 'POST', body: { replyMessage } });
export const deleteLead = (id) => apiRequest(`/leads/${id}`, { method: 'DELETE' });

// ── Diet Plans ────────────────────────────────────────────────────────
export const getDietPlans = (params = '') => apiRequest(`/diet-plans${params}`);
export const createDietPlan = (data) => apiRequest('/diet-plans', { method: 'POST', body: data });
export const updateDietPlan = (id, data) => apiRequest(`/diet-plans/${id}`, { method: 'PUT', body: data });
export const deleteDietPlan = (id) => apiRequest(`/diet-plans/${id}`, { method: 'DELETE' });

// ── Attendance ────────────────────────────────────────────────────────
export const getAttendance = (params = '') => apiRequest(`/attendance${params}`);
export const markAttendance = (data) => apiRequest('/attendance', { method: 'POST', body: data });

// ── Gallery ───────────────────────────────────────────────────────────
export const getGallery = (params = '') => apiRequest(`/gallery${params}`);
export const createGalleryItem = (data) => {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, v); });
  return apiRequest('/gallery', { method: 'POST', body: fd });
};
export const deleteGalleryItem = (id) => apiRequest(`/gallery/${id}`, { method: 'DELETE' });

// ── Reviews ───────────────────────────────────────────────────────────
export const getPublicReviews = () => apiRequest('/reviews');
export const getAdminReviews = () => apiRequest('/admin/reviews');
export const updateReviewStatus = (id, status) => apiRequest(`/admin/reviews/${id}`, { method: 'PUT', body: { status } });
export const deleteReview = (id) => apiRequest(`/admin/reviews/${id}`, { method: 'DELETE' });

// ── Settings & Ops ────────────────────────────────────────────────────
export const getSettings = () => apiRequest('/settings');
export const updateSettings = (data) => apiRequest('/settings', { method: 'PUT', body: data });
export const getLogs = () => apiRequest('/logs');
export const getStats = () => apiRequest('/stats');

// ── Admin Notifications ───────────────────────────────────────────────
export const getAdminNotifications = () => apiRequest('/admin/notifications');
export const markNotificationRead = (id) => apiRequest(`/admin/notifications/${id}/read`, { method: 'PUT' });
