/**
 * Email Service
 * Emails are skipped when no API key is configured.
 * To enable: add NEXT_PUBLIC_RESEND_API_KEY to .env.local
 */

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

interface SendApplicationConfirmationParams {
  to: string;
  applicantName: string;
  referenceNumber: string;
  schoolLevel: string;
  applicantType: string;
}

// Generic email sending function
export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const apiKey = process.env.NEXT_PUBLIC_RESEND_API_KEY;
  if (!apiKey) {
    console.warn('Resend API key not configured, skipping email send');
    return { success: true, data: { message: 'Email skipped - no API key configured' } };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Campus Portal <onboarding@resend.dev>',
        to: [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('Email sending error:', err);
      return { success: false, error: err.message };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: String(error) };
  }
}

export async function sendApplicationConfirmationEmail({
  to,
  applicantName,
  referenceNumber,
  schoolLevel,
  applicantType,
}: SendApplicationConfirmationParams) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://campus-portal.edu';

  return sendEmail({
    to,
    subject: `Application Received - Reference Number: ${referenceNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;">
              <tr><td style="background:#F59E0B;padding:30px;text-align:center;">
                <h1 style="margin:0;color:#fff;font-size:28px;">Application Received!</h1>
              </td></tr>
              <tr><td style="padding:40px 30px;">
                <p style="font-size:16px;color:#333;">Dear <strong>${applicantName}</strong>,</p>
                <p style="font-size:16px;color:#333;">Thank you for submitting your application. It is now under review.</p>
                <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;background:#FEF3C7;border:2px solid #F59E0B;border-radius:8px;">
                  <tr><td style="padding:20px;text-align:center;">
                    <p style="margin:0 0 10px;font-size:14px;color:#92400E;font-weight:bold;">YOUR REFERENCE NUMBER</p>
                    <p style="margin:0;font-size:32px;color:#F59E0B;font-weight:bold;font-family:'Courier New',monospace;">${referenceNumber}</p>
                  </td></tr>
                </table>
                <p style="font-size:14px;color:#DC2626;background:#FEE2E2;padding:15px;border-radius:6px;border-left:4px solid #DC2626;">
                  <strong>⚠️ IMPORTANT:</strong> Save this reference number to track your application.
                </p>
                <p><strong>School Level:</strong> ${schoolLevel}</p>
                <p><strong>Applicant Type:</strong> ${applicantType}</p>
                <p style="margin-top:20px;">
                  <a href="${origin}/admissions/track" style="display:inline-block;padding:15px 40px;background:#F59E0B;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">Track My Application</a>
                </p>
              </td></tr>
              <tr><td style="background:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #e5e5e5;">
                <p style="font-size:12px;color:#999;">© ${new Date().getFullYear()} Campus Portal. All rights reserved.</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
  });
}
