import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { AppConfigService } from '../../config/config.service';

/**
 * RedisService — thin wrapper around ioredis.
 *
 * Works with both:
 *   - Local Redis (REDIS_HOST + REDIS_PORT)
 *   - Upstash Redis (REDIS_URL=rediss://... with TLS)
 *
 * Used for: OTP storage, refresh token tracking, slot locking
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  constructor(private readonly config: AppConfigService) {
    const redisUrl = process.env.REDIS_URL;

    if (redisUrl) {
      // Upstash / cloud Redis (TLS URL)
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        tls: redisUrl.startsWith('rediss://') ? {} : undefined,
      });
    } else {
      // Local Redis
      this.client = new Redis({
        host: config.redisHost,
        port: config.redisPort,
        password: config.redisPassword,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });
    }

    this.client.on('error', (err) => {
      this.logger.error('Redis error:', err.message);
    });
  }

  async onModuleInit() {
    await this.client.connect();
    this.logger.log('✅ Redis connected');
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  // ─── OTP helpers ──────────────────────────────────────────────────────────

  async setOtp(mobile: string, otp: string, ttlSeconds = 300): Promise<void> {
    await this.client.set(`otp:${mobile}`, otp, 'EX', ttlSeconds);
  }

  async getOtp(mobile: string): Promise<string | null> {
    return this.client.get(`otp:${mobile}`);
  }

  async deleteOtp(mobile: string): Promise<void> {
    await this.client.del(`otp:${mobile}`);
  }

  // OTP attempt tracking — max 5 attempts per mobile per 15 min
  async incrementOtpAttempts(mobile: string): Promise<number> {
    const key = `otp_attempts:${mobile}`;
    const count = await this.client.incr(key);
    if (count === 1) {
      await this.client.expire(key, 900); // 15 min
    }
    return count;
  }

  async getOtpAttempts(mobile: string): Promise<number> {
    const val = await this.client.get(`otp_attempts:${mobile}`);
    return val ? parseInt(val, 10) : 0;
  }

  async resetOtpAttempts(mobile: string): Promise<void> {
    await this.client.del(`otp_attempts:${mobile}`);
  }

  // ─── Refresh token helpers ────────────────────────────────────────────────

  /**
   * Store a hashed refresh token for a user.
   * We store the hash (not the raw token) so a DB breach doesn't expose tokens.
   */
  async setRefreshToken(userId: string, tokenHash: string, ttlSeconds = 604800): Promise<void> {
    await this.client.set(`refresh:${userId}`, tokenHash, 'EX', ttlSeconds);
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    return this.client.get(`refresh:${userId}`);
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    await this.client.del(`refresh:${userId}`);
  }

  // ─── Generic helpers ──────────────────────────────────────────────────────

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async setnx(key: string, value: string, ttlSeconds: number): Promise<boolean> {
    const result = await this.client.set(key, value, 'EX', ttlSeconds, 'NX');
    return result === 'OK';
  }
}
