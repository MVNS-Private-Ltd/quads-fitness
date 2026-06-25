import prisma from '../prisma.js';
import { supabaseAdmin } from '../lib/supabaseAdmin.js';

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
  const { 
    name, email, phone, planId, trainerId, status, 
    age, gender, emergencyContact, healthNotes, membershipExpiry, joinedAt 
  } = req.body;

  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
  if (!phone) return res.status(400).json({ error: 'Phone is required' });
  if (!gender) return res.status(400).json({ error: 'Gender is required' });
  if (!age) return res.status(400).json({ error: 'Age is required' });
  if (!planId) return res.status(400).json({ error: 'Membership plan is required' });
  if (!joinedAt) return res.status(400).json({ error: 'Membership start date is required' });
  if (!membershipExpiry) return res.status(400).json({ error: 'Membership expiry date is required' });

  // Provision Supabase Auth account
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: 'Welcome123!',
    email_confirm: true
  });

  if (authError && !authError.message.toLowerCase().includes('already')) {
    return res.status(400).json({ error: 'Failed to create auth user: ' + authError.message });
  }

  const member = await prisma.member.create({ 
    data: { 
      name, 
      email, 
      phone, 
      age: Number(age),
      gender,
      emergencyContact,
      healthNotes,
      membershipExpiry: new Date(membershipExpiry),
      joinedAt: new Date(joinedAt),
      planId: Number(planId), 
      trainerId: trainerId ? Number(trainerId) : null,
      status 
    } 
  });
  await log('Added Member', `${name} registered`, 'Member', member.id);
  res.status(201).json(member);
};

// PUT /api/members/:id
export const updateMember = async (req, res) => {
  const { name, email, phone, planId, trainerId, status, age, gender,
    emergencyContact, healthNotes, fitnessGoals, membershipExpiry } = req.body;
  const member = await prisma.member.update({
    where: { id: Number(req.params.id) },
    data: {
      name,
      email,
      phone,
      age: age ? Number(age) : undefined,
      gender,
      emergencyContact,
      healthNotes,
      fitnessGoals,
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
};

// DELETE /api/members/:id
export const deleteMember = async (req, res) => {
  const memberId = Number(req.params.id);
  const member = await prisma.member.findUnique({ where: { id: memberId } });
  if (!member) return res.status(404).json({ error: 'Member not found' });

  // Delete related records first to avoid foreign key constraint errors
  await prisma.attendance.deleteMany({ where: { memberId } });
  await prisma.progressLog.deleteMany({ where: { memberId } });
  await prisma.review.deleteMany({ where: { memberId } });

  await prisma.member.delete({ where: { id: memberId } });

  // Also try to delete the Supabase Auth user if possible
  try {
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    if (users && users.users) {
      const authUser = users.users.find(u => u.email === member.email);
      if (authUser) {
        await supabaseAdmin.auth.admin.deleteUser(authUser.id);
      }
    }
  } catch (e) {
    // Silently continue if auth user deletion fails
  }

  await log('Deleted Member', `${member.name} removed`, 'Member', memberId);
  res.json({ message: 'Member deleted' });
};
