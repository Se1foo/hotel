import { env } from '../config/env';

/**
 * Outbound email.
 *
 * There is no mail provider wired up, and pretending otherwise would be worse
 * than being explicit about it. This is a single seam: swap the body of `deliver`
 * for Resend / SendGrid / SES and every caller keeps working.
 *
 * In development the message is logged so the flows are testable end to end.
 * Critically, tokens are **never** returned in an HTTP response — that would let
 * anyone verify an address or reset a password they don't control.
 */

interface Mail {
  to: string;
  subject: string;
  body: string;
}

async function deliver(mail: Mail): Promise<void> {
  if (env.isProduction) {
    // Fail loudly rather than silently dropping account-critical mail.
    console.error(
      `[mailer] No email provider configured; "${mail.subject}" to ${mail.to} was NOT sent.`,
    );
    return;
  }

  console.log(
    [
      '',
      '──────────── DEV EMAIL ────────────',
      `To:      ${mail.to}`,
      `Subject: ${mail.subject}`,
      '',
      mail.body,
      '───────────────────────────────────',
      '',
    ].join('\n'),
  );
}

export async function sendVerificationEmail(to: string, token: string): Promise<void> {
  const link = `${env.frontendUrl}/verify-email?token=${token}`;
  await deliver({
    to,
    subject: 'Confirm your email address',
    body: `Welcome to Luxe Reserve.\n\nConfirm your address to activate your account:\n${link}\n\nThis link expires in 24 hours.`,
  });
}

export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
  const link = `${env.frontendUrl}/reset-password?token=${token}`;
  await deliver({
    to,
    subject: 'Reset your password',
    body: `A password reset was requested for your Luxe Reserve account.\n\nSet a new password:\n${link}\n\nThis link expires in 1 hour and can be used once. If you didn't request it, you can ignore this email.`,
  });
}

export async function sendBookingConfirmationEmail(
  to: string,
  details: { reference: string; title: string; checkIn: Date; checkOut: Date },
): Promise<void> {
  const format = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  await deliver({
    to,
    subject: `Booking confirmed — ${details.reference}`,
    body: `Your stay at ${details.title} is confirmed.\n\nReference: ${details.reference}\nCheck-in:  ${format(details.checkIn)}\nCheck-out: ${format(details.checkOut)}\n\nManage this booking at ${env.frontendUrl}/trips`,
  });
}
