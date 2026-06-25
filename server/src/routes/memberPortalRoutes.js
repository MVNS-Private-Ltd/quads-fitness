import express from 'express';
import multer from 'multer';
import { requireMember, requireBaseAuth } from '../middleware/authMiddleware.js';

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

import { getMe, updateMe, getProgress, addProgress, getOffers, verifyMember, getMyReview, submitReview, markAttendance, getDietPlans } from '../controllers/memberPortalController.js';

const router = express.Router();

// Verification route (only requires base auth — checks if member record exists)
router.post('/verify', requireBaseAuth, verifyMember);

// All member portal routes below require valid Supabase auth token AND a linked Member profile
router.use(requireMember);

router.get('/me', getMe);
router.put('/me', upload.single('profilePhoto'), updateMe);
router.get('/progress', getProgress);
router.post('/progress', addProgress);
router.get('/offers', getOffers);
router.get('/review/me', getMyReview);
router.post('/review', submitReview);
router.post('/attendance/mark', markAttendance);
router.get('/diet-plans', getDietPlans);

export default router;
