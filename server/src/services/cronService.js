import cron from 'node-cron';
import prisma from '../prisma.js';
import { sendMemberReminderEmail, sendAdminExpiryEmail, sendAdminReminderEmail } from './emailService.js';

export const initCronJobs = () => {
  // Run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('[CRON] Running daily membership checks...');
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const in5Days = new Date(today);
      in5Days.setDate(today.getDate() + 5);

      const tomorrowOf5Days = new Date(in5Days);
      tomorrowOf5Days.setDate(in5Days.getDate() + 1);

      // Fetch global settings for gym email
      const settings = await prisma.settings.findFirst();
      const adminEmail = settings?.email || process.env.ADMIN_EMAIL || 'quadsfitness28@gmail.com';

      // 1. Members expiring in exactly 5 days
      const remindingMembers = await prisma.member.findMany({
        where: {
          membershipExpiry: {
            gte: in5Days,
            lt: tomorrowOf5Days
          },
          reminderSent: false,
          status: 'Active'
        },
        include: { plan: true }
      });

      for (const member of remindingMembers) {
        await sendMemberReminderEmail(member, settings);
        await sendAdminReminderEmail(member, adminEmail);
        
        // Update member to mark reminder sent
        await prisma.member.update({
          where: { id: member.id },
          data: { reminderSent: true }
        });

        // Add admin notification
        await prisma.adminNotification.create({
          data: {
            message: `Membership for ${member.name} expires in 5 days.`,
            type: 'REMINDER'
          }
        });
      }

      // 2. Members who expired today (or in the past) and are still 'Active'
      const expiredMembers = await prisma.member.findMany({
        where: {
          membershipExpiry: {
            lt: today
          },
          status: 'Active'
        },
        include: { plan: true }
      });

      for (const member of expiredMembers) {
        await sendAdminExpiryEmail(member, adminEmail);

        // Update member to Expired
        await prisma.member.update({
          where: { id: member.id },
          data: { status: 'Expired' }
        });

        // Add admin notification
        await prisma.adminNotification.create({
          data: {
            message: `Member ${member.name}'s membership has expired.`,
            type: 'EXPIRY'
          }
        });
      }

      console.log(`[CRON] Processed ${remindingMembers.length} reminders and ${expiredMembers.length} expirations.`);
    } catch (err) {
      console.error('[CRON] Error running daily checks:', err);
    }
  });

  console.log('[CRON] Daily membership check job scheduled.');
};
