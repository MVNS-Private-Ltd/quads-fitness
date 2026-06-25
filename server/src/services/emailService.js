import nodemailer from 'nodemailer';

// Create a transporter using standard SMTP variables
// By default, it will gracefully handle missing credentials by just logging out the mock email.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
    pass: process.env.SMTP_PASS || 'ethereal_pass',
  },
});

/**
 * Send 7-day reminder email to the member.
 */
export const sendMemberReminderEmail = async (member, settings) => {
  if (!process.env.SMTP_HOST) {
    console.log(`[EMAIL MOCK] Sending 7-day reminder to ${member.email}`);
    return;
  }

  try {
    const expiryDate = new Date(member.membershipExpiry).toLocaleDateString();
    const firstName = member.name.split(' ')[0];
    const gymName = settings.name || 'Quads Fitness';
    
    await transporter.sendMail({
      from: `"${gymName}" <${settings.email}>`,
      to: member.email,
      subject: `Your Quads Fitness Membership Expires in 7 Days 💪`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; color: #ffffff; padding: 40px; border-top: 5px solid #ff6b00; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ff6b00; margin: 0; font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">${gymName}</h1>
            <p style="color: #888; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; margin-top: 5px;">// Performance Systems</p>
          </div>
          <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 20px;">Membership Expiring Soon</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #dddddd;">Hi ${firstName},</p>
          <p style="font-size: 16px; line-height: 1.6; color: #dddddd;">
            We're reaching out to let you know that your current membership plan <strong>${member.plan?.name || 'N/A'}</strong> is set to expire in exactly 7 days on <strong>${expiryDate}</strong>.
          </p>
          <div style="background-color: #2a2a2a; padding: 20px; border-left: 4px solid #ff6b00; margin: 30px 0;">
            <p style="margin: 0; font-size: 15px; color: #ffffff;">Please contact us or visit the gym front desk to renew your membership and ensure uninterrupted access to the facility.</p>
          </div>
          <p style="font-size: 16px; line-height: 1.6; color: #dddddd; margin-bottom: 40px;">Train hard. Live strong.</p>
          <hr style="border: none; border-top: 1px solid #333; margin-bottom: 20px;" />
          <div style="font-size: 14px; color: #888; text-align: center;">
            <p style="margin: 5px 0; color: #ff6b00; font-weight: bold; text-transform: uppercase;">${gymName}</p>
            <p style="margin: 5px 0;">Phone: ${settings.phone || 'N/A'}</p>
            <p style="margin: 5px 0;">Email: <a href="mailto:${settings.email}" style="color: #888; text-decoration: none;">${settings.email}</a></p>
          </div>
        </div>
      `
    });
    console.log(`Reminder email sent to ${member.email}`);
  } catch (error) {
    console.error('Failed to send reminder email:', error.message);
  }
};

export const sendAdminExpiryEmail = async (member, adminEmail) => {
  if (!process.env.SMTP_HOST) {
    console.log(`[EMAIL MOCK] Sending expiry notification for ${member.name} to admin (${adminEmail})`);
    return;
  }

  try {
    const expiryDate = new Date(member.membershipExpiry).toLocaleDateString();
    
    await transporter.sendMail({
      from: `"Quads Fitness System" <noreply@quadsfitness.com>`,
      to: adminEmail || process.env.ADMIN_EMAIL,
      subject: `Membership Expired: ${member.name}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; color: #333333; padding: 40px; border-top: 5px solid #e53e3e; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <div style="margin-bottom: 30px; text-align: center;">
            <h1 style="color: #e53e3e; margin: 0; font-size: 24px; text-transform: uppercase; font-weight: 900;">Membership Expired</h1>
          </div>
          <p style="font-size: 16px; line-height: 1.6;">Hello Admin,</p>
          <p style="font-size: 16px; line-height: 1.6;">
            The membership for <strong>${member.name}</strong> has officially expired today (${expiryDate}).
          </p>
          <div style="background-color: #ffffff; padding: 25px; border: 1px solid #e0e0e0; border-radius: 6px; margin: 30px 0;">
            <h3 style="margin-top: 0; color: #555555; font-size: 16px; border-bottom: 2px solid #f0f0f0; padding-bottom: 12px; margin-bottom: 15px;">Member Details</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
              <tr>
                <td style="padding: 10px 0; font-weight: bold; width: 120px; color: #666;">Full Name:</td>
                <td style="padding: 10px 0;">${member.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #666;">Email:</td>
                <td style="padding: 10px 0;">
                  <a href="mailto:${member.email}" style="color: #3182ce; text-decoration: none;">${member.email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #666;">Phone:</td>
                <td style="padding: 10px 0;">${member.phone || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #666;">Previous Plan:</td>
                <td style="padding: 10px 0;">${member.plan?.name || 'N/A'}</td>
              </tr>
            </table>
          </div>
          <p style="font-size: 15px; color: #555;">Their status has been automatically updated to "Expired" in the system.</p>
          <div style="text-align: center; margin-top: 40px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin" style="display: inline-block; background-color: #e53e3e; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">Update in Admin Dashboard</a>
          </div>
        </div>
      `
    });
    console.log(`Admin expiry notification sent for ${member.name}`);
  } catch (error) {
    console.error('Failed to send admin expiry email:', error.message);
  }
};

export const sendLeadReplyEmail = async (lead, replyMessage, settings) => {
  if (!process.env.SMTP_HOST) {
    console.log(`[EMAIL MOCK] Sending reply to ${lead.email}`);
    return;
  }

  try {
    const gymName = settings?.gymName || 'Quads Fitness';
    const gymEmail = settings?.email || process.env.ADMIN_EMAIL || 'hello@quadsfitness.com';
    
    await transporter.sendMail({
      from: `"${gymName}" <${gymEmail}>`,
      to: lead.email,
      subject: `Re: Your Inquiry at ${gymName}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; color: #ffffff; padding: 40px; border-top: 5px solid #ff6b00; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ff6b00; margin: 0; font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">${gymName}</h1>
          </div>
          <p style="font-size: 16px; line-height: 1.6; color: #dddddd;">Hi ${lead.name},</p>
          <div style="font-size: 16px; line-height: 1.6; color: #dddddd; white-space: pre-wrap; margin-bottom: 30px;">${replyMessage}</div>
          <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;" />
          <p style="font-size: 14px; color: #888; font-style: italic;">In response to your inquiry:</p>
          <blockquote style="border-left: 3px solid #ff6b00; margin: 0; padding-left: 15px; color: #aaa; font-size: 14px; white-space: pre-wrap;">${lead.message}</blockquote>
        </div>
      `
    });
    console.log(`Reply email sent to ${lead.email}`);
  } catch (error) {
    console.error('Failed to send reply email:', error.message);
    throw error;
  }
};
