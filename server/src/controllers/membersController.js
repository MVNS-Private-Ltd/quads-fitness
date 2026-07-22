import prisma from '../prisma.js';
import { supabaseAdmin } from '../lib/supabaseAdmin.js';
import { uploadToSupabase } from '../lib/uploadToSupabase.js';

// Helper to log admin actions
const log = async (action, details, entity = null, entityId = null) => {
  try {
    await prisma.activityLog.create({ data: { action, details, entity, entityId } });
  } catch (e) { /* silently fail */ }
};

// GET /api/members
export const getMembers = async (req, res) => {
  const { status, search } = req.query;
  const where = {};
  if (status) where.status = status;
  if (search) where.OR = [
    { name: { contains: search } },
    { email: { contains: search } },
  ];
  const members = await prisma.member.findMany({ where, include: { plan: true, trainer: true }, orderBy: { createdAt: 'desc' } });
  res.json(members);
};

// GET /api/members/:id
export const getMember = async (req, res) => {
  const member = await prisma.member.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      plan: true,
      trainer: true,
      attendance: { orderBy: { date: 'desc' }, take: 10 },
      progressLogs: { orderBy: { date: 'desc' }, take: 5 },
      review: true,
    }
  });
  if (!member) return res.status(404).json({ error: 'Member not found' });
  res.json(member);
};

// POST /api/members
export const createMember = async (req, res) => {
  try {
    const { 
      name, email, phone, planId, trainerId, status, 
      age, gender, emergencyContact, healthNotes, membershipExpiry, joinedAt 
    } = req.body;

    const finalName = name || 'Unnamed Member';

    // Provision Supabase Auth account only if email is provided
    if (email) {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: 'Welcome123!',
        email_confirm: true
      });

      if (authError && !authError.message.toLowerCase().includes('already')) {
        return res.status(400).json({ error: 'Failed to create auth user: ' + authError.message });
      }
    }

    // Upload profile photo if provided
    const profilePhoto = req.file ? await uploadToSupabase(req.file) : null;

    const member = await prisma.member.create({ 
      data: { 
        name: finalName, 
        email: email || null, 
        phone: phone || null, 
        age: age ? Number(age) : null,
        gender: gender || null,
        emergencyContact: emergencyContact || null,
        healthNotes: healthNotes || null,
        profilePhoto,
        membershipExpiry: membershipExpiry ? new Date(membershipExpiry) : null,
        joinedAt: joinedAt ? new Date(joinedAt) : new Date(),
        planId: planId ? Number(planId) : null, 
        trainerId: trainerId ? Number(trainerId) : null,
        status: status || 'Active' 
      } 
    });
    await log('Added Member', `${name} registered`, 'Member', member.id);
    res.status(201).json(member);
  } catch (error) {
    console.error("Error creating member:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'A member with this email or phone number already exists.' });
    }
    res.status(500).json({ error: 'Failed to create member.' });
  }
};

// PUT /api/members/:id
export const updateMember = async (req, res) => {
  try {
    const { name, email, phone, planId, trainerId, status, age, gender,
      emergencyContact, healthNotes, fitnessGoals, membershipExpiry } = req.body;
    // Upload new photo if provided
    const profilePhoto = req.file ? await uploadToSupabase(req.file) : undefined;
    const member = await prisma.member.update({
      where: { id: Number(req.params.id) },
      data: {
        name: name || undefined,
        email: email || null,
        phone: phone || null,
        age: age ? Number(age) : null,
        gender: gender || null,
        emergencyContact,
        healthNotes,
        fitnessGoals,
        ...(profilePhoto ? { profilePhoto } : {}),
        membershipExpiry: membershipExpiry ? new Date(membershipExpiry) : undefined,
        planId: planId ? Number(planId) : null,
        trainerId: trainerId ? Number(trainerId) : null,
        status,
        // Reset reminderSent if admin changed expiry date
        ...(membershipExpiry ? { reminderSent: false } : {}),
      },
      include: { plan: true, trainer: true }
    });
    await log('Updated Member', `${name} record updated`, 'Member', member.id);
    res.json(member);
  } catch (error) {
    console.error("Error updating member:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'A member with this email or phone number already exists.' });
    }
    res.status(500).json({ error: 'Failed to update member.' });
  }
};

// DELETE /api/members/:id
export const deleteMember = async (req, res) => {
  try {
    const memberId = Number(req.params.id);
    const member = await prisma.member.findUnique({ where: { id: memberId } });
    if (!member) return res.status(404).json({ error: 'Member not found' });

    // Delete related records first to avoid foreign key constraint errors
    await prisma.attendance.deleteMany({ where: { memberId } });
    await prisma.progressLog.deleteMany({ where: { memberId } });
    await prisma.review.deleteMany({ where: { memberId } });
    
    // Delete the member record
    await prisma.member.delete({ where: { id: memberId } });

    // Try to delete auth account (fail gracefully)
    if (member.email) {
      try {
        const { data: users } = await supabaseAdmin.auth.admin.listUsers();
        const user = users?.users?.find(u => u.email === member.email);
        if (user) {
          await supabaseAdmin.auth.admin.deleteUser(user.id);
        }
      } catch (authErr) {
        console.error('Error deleting auth user:', authErr);
      }
    }

    await log('Deleted Member', `${member.name} removed`, 'Member', memberId);
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ error: 'Failed to delete member.' });
  }
};
