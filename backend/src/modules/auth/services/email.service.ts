import { Injectable, Logger } from '@nestjs/common';

/**
 * EmailService — sends transactional emails via Resend.
 *
 * Free tier: 3,000 emails/month, 100/day
 * From address: onboarding@resend.dev (works without custom domain)
 *
 * When you get a domain, update FROM_EMAIL in .env and verify it on Resend.
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly apiKey = process.env.RESEND_API_KEY;
  private readonly fromEmail = process.env.FROM_EMAIL ?? 'DocNear <onboarding@resend.dev>';
  private readonly isDev = process.env.NODE_ENV !== 'production';

  private async send(to: string, subject: string, html: string): Promise<void> {
    if (this.isDev) {
      this.logger.warn(`[DEV EMAIL] To: ${to} | Subject: ${subject}`);
      return;
    }

    if (!this.apiKey) {
      this.logger.error('RESEND_API_KEY not set — skipping email');
      return;
    }

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ from: this.fromEmail, to, subject, html }),
      });

      if (!res.ok) {
        const err = await res.text();
        this.logger.error(`Resend error: ${err}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Email send failed: ${message}`);
    }
  }

  // ─── Doctor emails ────────────────────────────────────────────────────────

  async sendDoctorRegistrationPending(to: string, doctorName: string): Promise<void> {
    const subject = 'Your DocNear registration is under review';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0f172a; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #14b8a6; margin: 0; font-size: 24px;">DocNear</h1>
        </div>
        <div style="padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1e293b; margin-top: 0;">Welcome, ${doctorName}! 👋</h2>
          <p style="color: #475569; line-height: 1.6;">
            Thank you for registering with DocNear. Your profile is currently <strong>under review</strong>.
          </p>
          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; color: #92400e; font-weight: 600;">What happens next?</p>
            <ul style="color: #92400e; margin: 8px 0 0; padding-left: 20px;">
              <li>Our team will verify your medical license and credentials</li>
              <li>Review typically takes 24–48 hours</li>
              <li>You'll receive an email once approved</li>
            </ul>
          </div>
          <p style="color: #475569;">
            You can log in anytime to check your verification status.
          </p>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 32px;">
            Questions? Reply to this email or contact us at support@docnear.in
          </p>
        </div>
      </div>
    `;
    await this.send(to, subject, html);
  }

  async sendDoctorKycApproved(to: string, doctorName: string): Promise<void> {
    const subject = '🎉 Your DocNear profile is now live!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0f172a; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #14b8a6; margin: 0; font-size: 24px;">DocNear</h1>
        </div>
        <div style="padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1e293b; margin-top: 0;">Congratulations, ${doctorName}! 🎉</h2>
          <p style="color: #475569; line-height: 1.6;">
            Your DocNear profile has been <strong style="color: #10b981;">approved and is now live</strong>.
            Patients in your area can now find and book appointments with you.
          </p>
          <div style="background: #dcfce7; border: 1px solid #16a34a; border-radius: 6px; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; color: #15803d; font-weight: 600;">Your next steps:</p>
            <ul style="color: #15803d; margin: 8px 0 0; padding-left: 20px;">
              <li>Log in and complete your clinic profile</li>
              <li>Set your weekly availability schedule</li>
              <li>Add your consultation fees</li>
            </ul>
          </div>
          <a href="${process.env.DOCTOR_WEB_URL ?? 'https://app.docnear.in'}/doctor/dashboard"
             style="display: inline-block; background: #14b8a6; color: white; padding: 12px 24px;
                    border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 8px;">
            Go to Dashboard →
          </a>
        </div>
      </div>
    `;
    await this.send(to, subject, html);
  }

  async sendDoctorKycRejected(to: string, doctorName: string, reason: string): Promise<void> {
    const subject = 'DocNear verification — action required';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0f172a; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #14b8a6; margin: 0; font-size: 24px;">DocNear</h1>
        </div>
        <div style="padding: 32px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1e293b; margin-top: 0;">Hi ${doctorName},</h2>
          <p style="color: #475569; line-height: 1.6;">
            Unfortunately, we were unable to verify your profile at this time.
          </p>
          <div style="background: #fee2e2; border: 1px solid #ef4444; border-radius: 6px; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; color: #b91c1c; font-weight: 600;">Reason:</p>
            <p style="color: #b91c1c; margin: 8px 0 0;">${reason}</p>
          </div>
          <p style="color: #475569;">
            Please contact us at support@docnear.in to resolve this and resubmit your application.
          </p>
        </div>
      </div>
    `;
    await this.send(to, subject, html);
  }
}
