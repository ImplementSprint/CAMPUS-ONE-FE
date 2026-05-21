import { Resend } from 'resend';

// Initialize Resend with API key from environment
const apiKey = process.env.NEXT_PUBLIC_RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

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
  // If no API key is configured, skip email sending
  if (!resend) {
    console.warn('Resend API key not configured, skipping email send');
    return { success: true, data: { message: 'Email skipped - no API key configured' } };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // Resend test domain
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }

    console.log('Email sent successfully:', data);
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
  // If no API key is configured, skip email sending
  if (!resend) {
    console.warn('Resend API key not configured, skipping email send');
    return { success: true, data: { message: 'Email skipped - no API key configured' } };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Campus Admissions <onboarding@resend.dev>', // Resend test domain
      to: [to],
      subject: `Application Received - Reference Number: ${referenceNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Application Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background-color: #F59E0B; padding: 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Application Received!</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">
                        Dear <strong>${applicantName}</strong>,
                      </p>
                      
                      <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">
                        Thank you for submitting your application to our institution. We have successfully received your application and it is now under review.
                      </p>
                      
                      <!-- Reference Number Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; background-color: #FEF3C7; border: 2px solid #F59E0B; border-radius: 8px;">
                        <tr>
                          <td style="padding: 20px; text-align: center;">
                            <p style="margin: 0 0 10px; font-size: 14px; color: #92400E; font-weight: bold;">
                              YOUR REFERENCE NUMBER
                            </p>
                            <p style="margin: 0; font-size: 32px; color: #F59E0B; font-weight: bold; font-family: 'Courier New', monospace; letter-spacing: 2px;">
                              ${referenceNumber}
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 0 0 20px; font-size: 14px; color: #DC2626; background-color: #FEE2E2; padding: 15px; border-radius: 6px; border-left: 4px solid #DC2626;">
                        <strong>⚠️ IMPORTANT:</strong> Please save this reference number. You will need it to track your application status.
                      </p>
                      
                      <!-- Application Details -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; border-top: 1px solid #e5e5e5; border-bottom: 1px solid #e5e5e5;">
                        <tr>
                          <td style="padding: 15px 0;">
                            <p style="margin: 0; font-size: 14px; color: #666666;">School Level:</p>
                            <p style="margin: 5px 0 0; font-size: 16px; color: #333333; font-weight: bold;">${schoolLevel}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px 0; border-top: 1px solid #f0f0f0;">
                            <p style="margin: 0; font-size: 14px; color: #666666;">Applicant Type:</p>
                            <p style="margin: 5px 0 0; font-size: 16px; color: #333333; font-weight: bold;">${applicantType}</p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Next Steps -->
                      <h2 style="margin: 30px 0 20px; font-size: 20px; color: #1a1a1a;">What Happens Next?</h2>
                      
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 15px 0;">
                            <table cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="width: 40px; vertical-align: top;">
                                  <div style="width: 32px; height: 32px; background-color: #F59E0B; color: #ffffff; border-radius: 50%; text-align: center; line-height: 32px; font-weight: bold; font-size: 16px;">1</div>
                                </td>
                                <td style="padding-left: 15px;">
                                  <p style="margin: 0 0 5px; font-size: 16px; color: #333333; font-weight: bold;">Application Review</p>
                                  <p style="margin: 0; font-size: 14px; color: #666666;">Our admissions team will review your application and documents. This typically takes 3-5 business days.</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        
                        <tr>
                          <td style="padding: 15px 0;">
                            <table cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="width: 40px; vertical-align: top;">
                                  <div style="width: 32px; height: 32px; background-color: #F59E0B; color: #ffffff; border-radius: 50%; text-align: center; line-height: 32px; font-weight: bold; font-size: 16px;">2</div>
                                </td>
                                <td style="padding-left: 15px;">
                                  <p style="margin: 0 0 5px; font-size: 16px; color: #333333; font-weight: bold;">Track Your Status</p>
                                  <p style="margin: 0; font-size: 14px; color: #666666;">Use your reference number to check your application status anytime on our website.</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        
                        <tr>
                          <td style="padding: 15px 0;">
                            <table cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="width: 40px; vertical-align: top;">
                                  <div style="width: 32px; height: 32px; background-color: #F59E0B; color: #ffffff; border-radius: 50%; text-align: center; line-height: 32px; font-weight: bold; font-size: 16px;">3</div>
                                </td>
                                <td style="padding-left: 15px;">
                                  <p style="margin: 0 0 5px; font-size: 16px; color: #333333; font-weight: bold;">Admission Decision</p>
                                  <p style="margin: 0; font-size: 14px; color: #666666;">You'll receive an email notification once a decision has been made on your application.</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td align="center">
                            <a href="${window.location.origin}/admissions/track" style="display: inline-block; padding: 15px 40px; background-color: #F59E0B; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Track My Application</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #e5e5e5;">
                      <p style="margin: 0 0 10px; font-size: 14px; color: #666666;">
                        Need help? Contact the Admissions Office
                      </p>
                      <p style="margin: 0; font-size: 14px; color: #666666;">
                        Email: <a href="mailto:admissions@campus.edu" style="color: #F59E0B; text-decoration: none;">admissions@campus.edu</a> | 
                        Phone: <a href="tel:+1234567890" style="color: #F59E0B; text-decoration: none;">(123) 456-7890</a>
                      </p>
                      <p style="margin: 15px 0 0; font-size: 12px; color: #999999;">
                        © ${new Date().getFullYear()} Campus Portal. All rights reserved.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: String(error) };
  }
}
