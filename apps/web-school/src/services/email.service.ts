type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

type SendApplicationConfirmationParams = {
  to: string;
  applicantName: string;
  referenceNumber: string;
  schoolLevel: string;
  applicantType: string;
};

type EmailResult = {
  success: boolean;
  data?: { message: string };
  error?: string;
};

function skipped(message: string): EmailResult {
  return { success: true, data: { message } };
}

export async function sendEmail({ to, subject }: SendEmailParams): Promise<EmailResult> {
  console.info('[email] Delivery skipped until server-side email endpoint is configured.', {
    to,
    subject,
  });

  return skipped('Email delivery skipped - server-side email endpoint not configured');
}

export async function sendApplicationConfirmationEmail({
  to,
  applicantName,
  referenceNumber,
  schoolLevel,
  applicantType,
}: SendApplicationConfirmationParams): Promise<EmailResult> {
  console.info('[email] Application confirmation skipped until server-side email endpoint is configured.', {
    to,
    applicantName,
    referenceNumber,
    schoolLevel,
    applicantType,
  });

  return skipped('Application confirmation email skipped - server-side email endpoint not configured');
}
