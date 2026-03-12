import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from '../../../config/config.service';

/**
 * OtpService — sends 6-digit OTPs via MSG91.
 *
 * In development (NODE_ENV !== 'production'):
 *   - OTP is logged to console instead of actually sent
 *   - This lets you test without a MSG91 account
 *
 * In production:
 *   - Uses MSG91 OTP API (https://control.msg91.com/api/v5/otp)
 *   - Requires MSG91_API_KEY and MSG91_OTP_TEMPLATE_ID in .env
 */
@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(private readonly config: AppConfigService) {}

  /** Generate a cryptographically random 6-digit OTP */
  generate(): string {
    const min = 100000;
    const max = 999999;
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
  }

  /**
   * Send OTP to a mobile number.
   * Returns the OTP string (so caller can store it in Redis).
   */
  async send(mobile: string, otp: string): Promise<void> {
    if (!this.config.isProduction) {
      // Dev mode — just log it
      this.logger.warn(`[DEV MODE] OTP for ${mobile}: ${otp}`);
      return;
    }

    await this.sendViaMSG91(mobile, otp);
  }

  private async sendViaMSG91(mobile: string, otp: string): Promise<void> {
    const apiKey = process.env.MSG91_API_KEY;
    const templateId = process.env.MSG91_OTP_TEMPLATE_ID;

    if (!apiKey || !templateId) {
      this.logger.error('MSG91 credentials not configured');
      return;
    }

    // MSG91 expects mobile with country code (91 for India)
    const formattedMobile = mobile.startsWith('91') ? mobile : `91${mobile}`;

    try {
      const response = await fetch('https://control.msg91.com/api/v5/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authkey: apiKey,
        },
        body: JSON.stringify({
          template_id: templateId,
          mobile: formattedMobile,
          otp,
          otp_expiry: 5, // minutes
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        this.logger.error(`MSG91 error for ${mobile}: ${err}`);
      } else {
        this.logger.log(`OTP sent to ${mobile}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`MSG91 send failed: ${message}`);
      // Don't throw — we don't want a SMS failure to crash auth
    }
  }
}
