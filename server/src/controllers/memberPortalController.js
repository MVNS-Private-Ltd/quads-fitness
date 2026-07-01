import prisma from '../prisma.js';
import { uploadToSupabase } from '../lib/uploadToSupabase.js';

// Helper to get member by auth user email
const getMemberByAuth = async (email) => {
  return await prisma.member.findUnique({
    where: { email },
    include: {
      plan: true,
      trainer: true,
      progressLogs: { orderBy: { date: 'desc' } },
      attendance: { orderBy: { date: 'desc' }, take: 10 }
    }
  });
};

// POST /api/member-portal/verify
// Checks if a member record exists for the authenticated user's email or phone.
// Does NOT auto-create — admin-created members are the source of truth.
export const verifyMember = async (req, res) => {
  try {
    const email = req.user?.email;
    const phone = req.user?.phone;
    if (!email && !phone) return res.status(401).json({ error: 'Unauthorized' });

    let member = null;
    if (email) {
      member = await prisma.member.findUnique({ where: { email } });
    }
    if (!member && phone) {
      const normalized = phone.replace(/^\+91/, '').replace(/^\+/, '');
      member = await prisma.member.findFirst({
        where: {
          OR: [
            { phone: phone },
            { phone: normalized },
            { phone: { endsWith: normalized.slice(-10) } },
          ]
        }
      });
    }

    if (!member) {
      return res.status(404).json({ error: 'No member profile found. Please contact the gym to link your membership.' });
    }

    res.json({ success: true, member: { id: member.id, name: member.name, email: member.email, status: member.status } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/member-portal/me
export const getMe = async (req, res) => {
  try {
    // req.member is already resolved by requireMember middleware (email OR phone)
    const memberId = req.member?.id;
    if (!memberId) return res.status(401).json({ error: 'Unauthorized' });

    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: {
        plan: true,
        trainer: true,
        progressLogs: { orderBy: { date: 'desc' }, take: 5 },
        attendance: { orderBy: { date: 'desc' }, take: 30 }
      }
    });
    if (!member) return res.status(404).json({ error: 'Member profile not found' });

    res.json(member);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/member-portal/me
export const updateMe = async (req, res) => {
  try {
    // req.member is already resolved by requireMember middleware (email OR phone)
    const member = req.member;
    if (!member) return res.status(404).json({ error: 'Member profile not found' });

    let { phone, age, gender, emergencyContact, healthNotes, fitnessGoals, profilePhoto } = req.body;

    if (req.file) {
      profilePhoto = await uploadToSupabase(req.file);
    }

    const updatedMember = await prisma.member.update({
      where: { id: member.id },
      data: {
        phone: phone !== undefined ? phone : member.phone,
        age: age ? Number(age) : (age === '' ? null : member.age),
        gender: gender !== undefined ? gender : member.gender,
        emergencyContact: emergencyContact !== undefined ? emergencyContact : member.emergencyContact,
        healthNotes: healthNotes !== undefined ? healthNotes : member.healthNotes,
        fitnessGoals: fitnessGoals !== undefined ? fitnessGoals : member.fitnessGoals,
        profilePhoto: profilePhoto !== undefined ? profilePhoto : member.profilePhoto,
      },
      include: {
        plan: true,
        trainer: true,
      }
    });

    res.json(updatedMember);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};

// GET /api/member-portal/progress
export const getProgress = async (req, res) => {
  try {
    const member = req.member;
    if (!member) return res.status(404).json({ error: 'Member profile not found' });

    const progressLogs = await prisma.progressLog.findMany({
      where: { memberId: member.id },
      orderBy: { date: 'desc' }
    });

    res.json(progressLogs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/member-portal/progress
export const addProgress = async (req, res) => {
  try {
    const member = req.member;
    if (!member) return res.status(404).json({ error: 'Member profile not found' });

    const { weight, bmi, notes, date } = req.body;

    const newLog = await prisma.progressLog.create({
      data: {
        memberId: member.id,
        weight: weight ? parseFloat(weight) : null,
        bmi: bmi ? parseFloat(bmi) : null,
        notes: notes || null,
        date: date ? new Date(date) : new Date(),
      }
    });

    res.status(201).json(newLog);
  } catch (err) {
    console.error("Error adding progress:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/member-portal/offers
export const getOffers = async (req, res) => {
  try {
    // Only fetch active offers that have not expired (or have no expiration)
    const offers = await prisma.offer.findMany({
      where: {
        status: 'Active',
        OR: [
          { validUntil: null },
          { validUntil: { gte: new Date() } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/member-portal/review/me
export const getMyReview = async (req, res) => {
  try {
    const member = req.member;
    if (!member) return res.status(404).json({ error: 'Member profile not found' });

    const review = await prisma.review.findUnique({
      where: { memberId: member.id }
    });
    res.json(review || null);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/member-portal/review
export const submitReview = async (req, res) => {
  try {
    const member = req.member;
    if (!member) return res.status(404).json({ error: 'Member profile not found' });

    const { rating, comment } = req.body;

    const review = await prisma.review.upsert({
      where: { memberId: member.id },
      update: {
        rating: Number(rating),
        comment,
        status: 'Pending' // Resets to pending on edit
      },
      create: {
        memberId: member.id,
        memberName: member.name,
        rating: Number(rating),
        comment,
        status: 'Pending'
      }
    });

    res.json(review);
  } catch (err) {
    console.error("Error submitting review:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/member-portal/attendance/mark
export const markAttendance = async (req, res) => {
  try {
    const member = req.member;
    if (!member) return res.status(404).json({ error: 'Member profile not found' });

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await prisma.attendance.findFirst({
      where: {
        memberId: member.id,
        date: { gte: today }
      }
    });

    if (existing) {
      return res.status(200).json({ success: true, message: 'Already marked present today!', attendance: existing });
    }

    const timeIn = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
    
    const newAttendance = await prisma.attendance.create({
      data: {
        memberId: member.id,
        status: 'Present',
        timeIn,
        date: new Date()
      }
    });

    // Notify Admin
    await prisma.adminNotification.create({
      data: {
        message: `${member.name} just checked in!`,
        type: 'SYSTEM'
      }
    });

    res.status(201).json({ success: true, message: 'Attendance marked successfully!', attendance: newAttendance });
  } catch (err) {
    console.error("Error marking attendance:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/member-portal/diet-plans
export const getDietPlans = async (req, res) => {
  try {
    const plans = await prisma.dietPlan.findMany({
      where: { status: 'Active' },
      orderBy: { createdAt: 'desc' }
    });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

