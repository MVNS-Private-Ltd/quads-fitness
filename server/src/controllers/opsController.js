import prisma from '../prisma.js';
import { sendLeadReplyEmail } from '../services/emailService.js';

const log = async (action, details, entity = null, entityId = null) => {
  try { await prisma.activityLog.create({ data: { action, details, entity, entityId } }); } catch (e) {}
};

// ─── LEADS ───────────────────────────────────────────────────────────────────
export const getLeads = async (req, res) => {
  const { status } = req.query;
  const where = status ? { status } : {};
  const leads = await prisma.lead.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(leads);
};

export const getLead = async (req, res) => {
  const lead = await prisma.lead.findUnique({ where: { id: Number(req.params.id) } });
  if (!lead) return res.status(404).json({ error: 'Not found' });
  res.json(lead);
};

export const createLead = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'Name, email and message required' });
    const lead = await prisma.lead.create({ data: { name, email, phone, subject, message } });
    await log('New Inquiry', `${name} sent a message`, 'Lead', lead.id);
    
    await prisma.adminNotification.create({
      data: {
        type: 'INQUIRY',
        message: `New website inquiry from ${name}`
      }
    });
    
    res.status(201).json(lead);
  } catch (error) {
    console.error('Error in createLead:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const updateLead = async (req, res) => {
  const { status } = req.body;
  const lead = await prisma.lead.update({ where: { id: Number(req.params.id) }, data: { status } });
  res.json(lead);
};

export const replyToLead = async (req, res) => {
  const { replyMessage } = req.body;
  if (!replyMessage) return res.status(400).json({ error: 'Reply message is required' });

  try {
    const lead = await prisma.lead.findUnique({ where: { id: Number(req.params.id) } });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    const settings = await prisma.settings.findFirst();

    await sendLeadReplyEmail(lead, replyMessage, settings);

    const updatedLead = await prisma.lead.update({
      where: { id: lead.id },
      data: { status: 'Contacted' }
    });

    await log('Replied to Lead', `Sent email reply to ${lead.name}`, 'Lead', lead.id);

    res.json(updatedLead);
  } catch (error) {
    console.error('Error replying to lead:', error);
    res.status(500).json({ error: 'Failed to send reply' });
  }
};

export const deleteLead = async (req, res) => {
  await prisma.lead.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Deleted' });
};

// ─── DIET PLANS ──────────────────────────────────────────────────────────────
export const getDietPlans = async (req, res) => {
  const where = req.query.all === 'true' ? {} : { status: 'Active' };
  const items = await prisma.dietPlan.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(items);
};

export const createDietPlan = async (req, res) => {
  const { title, goalType, calories, meals, description, status } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const item = await prisma.dietPlan.create({ data: { title, goalType, calories, meals: Number(meals) || 3, description, status } });
  await log('Created Diet Plan', `"${title}" added`, 'DietPlan', item.id);
  res.status(201).json(item);
};

export const updateDietPlan = async (req, res) => {
  const { title, goalType, calories, meals, description, status } = req.body;
  const item = await prisma.dietPlan.update({ where: { id: Number(req.params.id) }, data: { title, goalType, calories, meals: Number(meals) || 3, description, status } });
  await log('Updated Diet Plan', `"${title}" updated`, 'DietPlan', item.id);
  res.json(item);
};

export const deleteDietPlan = async (req, res) => {
  await prisma.dietPlan.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Deleted' });
};

// ─── ATTENDANCE ──────────────────────────────────────────────────────────────
export const getAttendance = async (req, res) => {
  const { date } = req.query;
  const where = {};
  if (date) { const d = new Date(date); where.date = { gte: d, lt: new Date(d.getTime() + 86400000) }; }
  const items = await prisma.attendance.findMany({ where, include: { member: true }, orderBy: { date: 'desc' } });
  res.json(items);
};

export const markAttendance = async (req, res) => {
  const { memberId, timeIn, timeOut, status, date } = req.body;
  if (!memberId) return res.status(400).json({ error: 'Member ID required' });
  const item = await prisma.attendance.create({ data: { memberId: Number(memberId), timeIn, timeOut, status: status || 'Present', date: date ? new Date(date) : new Date() } });
  res.status(201).json(item);
};
