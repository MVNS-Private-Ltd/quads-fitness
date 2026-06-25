import prisma from '../prisma.js';

// GET /api/admin/notifications
export const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await prisma.adminNotification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to last 50
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching notifications' });
  }
};

// PUT /api/admin/notifications/:id/read
export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await prisma.adminNotification.update({
      where: { id: Number(req.params.id) },
      data: { isRead: true }
    });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Server error updating notification' });
  }
};
