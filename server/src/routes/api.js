import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Middleware
import { requireAdmin, requireMember } from '../middleware/authMiddleware.js';
import { globalLimiter, strictLimiter } from '../middleware/rateLimiter.js';

// Controllers

import { getMembers, getMember, createMember, updateMember, deleteMember } from '../controllers/membersController.js';
import { getPrograms, getProgram, createProgram, updateProgram, deleteProgram } from '../controllers/programsController.js';
import { getPlans, getPlan, createPlan, updatePlan, deletePlan } from '../controllers/plansController.js';
import { getTrainers, getTrainer, createTrainer, updateTrainer, deleteTrainer } from '../controllers/trainersController.js';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, getGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem, getOffers, createOffer, updateOffer, deleteOffer } from '../controllers/contentController.js';
import { getLeads, getLead, createLead, updateLead, deleteLead, replyToLead, getDietPlans, createDietPlan, updateDietPlan, deleteDietPlan, getAttendance, markAttendance } from '../controllers/opsController.js';
import { getSettings, updateSettings, getLogs, getStats } from '../controllers/settingsController.js';
import { getPublicReviews, getAdminReviews, updateReviewStatus, deleteReview } from '../controllers/reviewsController.js';
import { getAdminNotifications, markNotificationAsRead } from '../controllers/notificationsController.js';
import memberPortalRoutes from './memberPortalRoutes.js';

const router = express.Router();

// ── Apply Global Rate Limiter ────────────────────────────────────────────────
router.use(globalLimiter);

// ── Member Portal ────────────────────────────────────────────────────────────
router.use('/member-portal', memberPortalRoutes);

// ── Multer Setup for File Uploads ────────────────────────────────────────────
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit



// ── Members ──────────────────────────────────────────────────────────────────
router.get('/members', requireAdmin, getMembers);
router.get('/members/:id', requireAdmin, getMember);
router.post('/members', requireAdmin, createMember);
router.put('/members/:id', requireAdmin, updateMember);
router.delete('/members/:id', requireAdmin, deleteMember);

// ── Programs ─────────────────────────────────────────────────────────────────
router.get('/programs', getPrograms); // Public
router.get('/programs/:id', getProgram); // Public
router.post('/programs', requireAdmin, upload.single('image'), createProgram);
router.put('/programs/:id', requireAdmin, upload.single('image'), updateProgram);
router.delete('/programs/:id', requireAdmin, deleteProgram);

// ── Plans (Membership) ───────────────────────────────────────────────────────
router.get('/plans', getPlans); // Public
router.get('/plans/:id', getPlan); // Public
router.post('/plans', requireAdmin, createPlan);
router.put('/plans/:id', requireAdmin, updatePlan);
router.delete('/plans/:id', requireAdmin, deletePlan);

// ── Trainers ─────────────────────────────────────────────────────────────────
router.get('/trainers', getTrainers); // Public
router.get('/trainers/:id', getTrainer); // Public
router.post('/trainers', requireAdmin, upload.single('image'), createTrainer);
router.put('/trainers/:id', requireAdmin, upload.single('image'), updateTrainer);
router.delete('/trainers/:id', requireAdmin, deleteTrainer);

// ── Diet Plans ───────────────────────────────────────────────────────────────
router.get('/diet-plans', requireAdmin, getDietPlans);
router.post('/diet-plans', requireAdmin, createDietPlan);
router.put('/diet-plans/:id', requireAdmin, updateDietPlan);
router.delete('/diet-plans/:id', requireAdmin, deleteDietPlan);

// ── Testimonials ─────────────────────────────────────────────────────────────
router.get('/testimonials', getTestimonials); // Public
router.post('/testimonials', requireAdmin, upload.single('image'), createTestimonial);
router.put('/testimonials/:id', requireAdmin, upload.single('image'), updateTestimonial);
router.delete('/testimonials/:id', requireAdmin, deleteTestimonial);

// ── Gallery ──────────────────────────────────────────────────────────────────
router.get('/gallery', getGallery); // Public
router.post('/gallery', requireAdmin, upload.single('image'), createGalleryItem);
router.put('/gallery/:id', requireAdmin, updateGalleryItem);
router.delete('/gallery/:id', requireAdmin, deleteGalleryItem);

// ── Offers ───────────────────────────────────────────────────────────────────
router.get('/offers', getOffers); // Public
router.post('/offers', requireAdmin, createOffer);
router.put('/offers/:id', requireAdmin, updateOffer);
router.delete('/offers/:id', requireAdmin, deleteOffer);

// ── Leads / Inquiries ────────────────────────────────────────────────────────
router.get('/leads', requireAdmin, getLeads);
router.get('/leads/:id', requireAdmin, getLead);
router.post('/leads', strictLimiter, createLead);          // Public contact form (Strict rate limit)
router.post('/leads/:id/reply', requireAdmin, replyToLead);
router.put('/leads/:id', requireAdmin, updateLead);
router.delete('/leads/:id', requireAdmin, deleteLead);

// ── Attendance ───────────────────────────────────────────────────────────────
router.get('/attendance', requireAdmin, getAttendance);
router.post('/attendance', requireAdmin, markAttendance);

// -- Admin Notifications --
router.get('/admin/notifications', requireAdmin, getAdminNotifications);
router.put('/admin/notifications/:id/read', requireAdmin, markNotificationAsRead);

// -- Settings ─────────────────────────────────────────────────────────────────
router.get('/settings', getSettings); // Public
router.put('/settings', requireAdmin, (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    // File upload (logo) — let multer handle it
    upload.single('logo')(req, res, next);
  } else {
    // Plain JSON update — skip multer entirely
    next();
  }
}, updateSettings);

// ── Reviews ──────────────────────────────────────────────────────────────────
router.get('/reviews', getPublicReviews); // Public
router.get('/admin/reviews', requireAdmin, getAdminReviews);
router.put('/admin/reviews/:id', requireAdmin, updateReviewStatus);
router.delete('/admin/reviews/:id', requireAdmin, deleteReview);

// ── Utility ──────────────────────────────────────────────────────────────────
router.get('/logs', requireAdmin, getLogs);
router.get('/stats', requireAdmin, getStats);

export default router;
