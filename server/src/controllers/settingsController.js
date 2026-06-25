import prisma from '../prisma.js';
import { uploadToSupabase } from '../lib/uploadToSupabase.js';

const log = async (action, details) => {
  try { await prisma.activityLog.create({ data: { action, details, entity: 'Settings' } }); } catch (e) {}
};

// GET /api/settings
export const getSettings = async (req, res) => {
  let settings = await prisma.settings.findUnique({ where: { id: 1 } });
  if (!settings) {
    // Auto-create with defaults on first access
    settings = await prisma.settings.create({ data: { id: 1 } });
  }
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.json(settings);
};

const SETTINGS_FIELDS = [
  'gymName', 'tagline', 'email', 'phone', 'address',
  'instagram', 'facebook', 'twitter', 'youtube',
  'mondayHours', 'tuesdayHours', 'wednesdayHours', 'thursdayHours', 'fridayHours', 'saturdayHours', 'sundayHours',
  'primaryColor', 'logoUrl', 'metaTitle', 'metaDescription',
  'heroTitle', 'heroSubtitle', 'aboutTitle', 'aboutSubtitle',
];

const pickSettingsData = (body) => {
  const data = {};
  for (const key of SETTINGS_FIELDS) {
    const value = body[key];
    if (value !== undefined && value !== null) {
      data[key] = value;
    }
  }
  return data;
};

// PUT /api/settings
export const updateSettings = async (req, res) => {
  try {
    const logoUrl = req.file ? await uploadToSupabase(req.file) : undefined;
    const data = pickSettingsData(req.body);
    if (logoUrl) data.logoUrl = logoUrl;

    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });
    await log('Updated Settings', 'Gym settings updated');
    res.json(settings);
  } catch (err) {
    console.error('Settings update error:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};

// GET /api/logs
export const getLogs = async (req, res) => {
  const logs = await prisma.activityLog.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  res.json(logs);
};

// GET /api/stats  (dashboard overview numbers)
export const getStats = async (req, res) => {
  const [totalMembers, activeMembers, activePrograms, unreadLeads, membersWithPlans] = await Promise.all([
    prisma.member.count(),
    prisma.member.count({ where: { status: 'Active' } }),
    prisma.program.count({ where: { status: 'Active' } }),
    prisma.lead.count({ where: { status: 'Unread' } }),
    prisma.member.findMany({
      where: { status: 'Active', planId: { not: null } },
      include: { plan: true },
    }),
  ]);

  // Estimated monthly revenue = sum of each active member's plan price
  const totalRevenue = membersWithPlans.reduce((sum, m) => sum + (m.plan?.price || 0), 0);

  // Fetch all members to calculate monthly trends
  const allMembersData = await prisma.member.findMany({
    include: { plan: true },
  });

  // Calculate Last 6 Months
  const monthlyData = [];
  const now = new Date();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthlyData.push({
      month: monthNames[d.getMonth()],
      year: d.getFullYear(),
      monthIndex: d.getMonth(),
      members: 0,
      revenue: 0,
    });
  }

  // Populate Monthly Data
  allMembersData.forEach(member => {
    const joinedAt = new Date(member.joinedAt);
    const mYear = joinedAt.getFullYear();
    const mMonth = joinedAt.getMonth();

    const monthBucket = monthlyData.find(m => m.year === mYear && m.monthIndex === mMonth);
    if (monthBucket) {
      monthBucket.members += 1;
      if (member.plan && member.plan.price) {
        monthBucket.revenue += member.plan.price;
      }
    }
  });

  // Clean up extra fields before sending
  const formattedMonthlyData = monthlyData.map(({ month, members, revenue }) => ({ month, members, revenue }));

  // Fetch Weekly Attendance (Last 7 Days or Current Week)
  // For simplicity, we can fetch all attendance in the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const recentAttendance = await prisma.attendance.findMany({
    where: {
      date: { gte: sevenDaysAgo },
      status: 'Present',
    },
  });

  // Initialize weekly buckets starting from Monday
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // Let's just create an array for the last 7 days ending today
  const weeklyAttendanceData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    weeklyAttendanceData.push({
      name: dayNames[d.getDay()],
      attendance: 0,
      dateString: d.toISOString().split('T')[0]
    });
  }

  // Populate Attendance Data
  recentAttendance.forEach(record => {
    const rDate = new Date(record.date).toISOString().split('T')[0];
    const bucket = weeklyAttendanceData.find(b => b.dateString === rDate);
    if (bucket) {
      bucket.attendance += 1;
    }
  });

  // Clean up dateString before sending
  const formattedWeeklyData = weeklyAttendanceData.map(({ name, attendance }) => ({ name, attendance }));

  res.json({ 
    totalMembers, 
    activeMembers, 
    activePrograms, 
    unreadLeads, 
    totalRevenue, 
    monthlyData: formattedMonthlyData,
    weeklyAttendanceData: formattedWeeklyData
  });
};
