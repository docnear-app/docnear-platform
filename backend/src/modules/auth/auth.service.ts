import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  KycStatus as PrismaKycStatus,
  UserRole as PrismaUserRole,
} from '../../../generated/prisma/enums';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RedisService } from '../../common/redis/redis.service';
import { AppConfigService } from '../../config/config.service';
import { OtpService } from './services/otp.service';
import { EmailService } from './services/email.service';
import type { DoctorRegisterDto, VerifyOtpDto, AdminLoginDto } from './dto/auth.dto';
import type { JwtPayload, AuthTokens } from '../../types/auth.types';

const OTP_MAX_ATTEMPTS = 5;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly jwt: JwtService,
    private readonly config: AppConfigService,
    private readonly otp: OtpService,
    private readonly email: EmailService,
  ) {}

  // ─── OTP: Send ────────────────────────────────────────────────────────────

  async sendOtp(mobile: string): Promise<{ message: string; devOtp?: string }> {
    // Check send rate: max 3 sends per mobile per 15 min (tracked separately from attempts)
    const sendKey = `otp_send:${mobile}`;
    const sends = await this.redis.get(sendKey);
    if (sends && parseInt(sends, 10) >= 3) {
      throw new BadRequestException(
        'Too many OTP requests. Please wait 15 minutes before trying again.',
      );
    }

    const code = this.otp.generate();
    await this.redis.setOtp(mobile, code, 300); // 5 min TTL
    await this.redis.resetOtpAttempts(mobile); // reset attempts on new OTP

    // Track send count
    if (!sends) {
      await this.redis.set(sendKey, '1', 900); // 15 min window
    } else {
      await this.redis.set(sendKey, String(parseInt(sends, 10) + 1), 900);
    }

    await this.otp.send(mobile, code);

    const response: { message: string; devOtp?: string } = {
      message: `OTP sent to ${mobile.slice(0, 4)}*****${mobile.slice(-2)}`,
    };

    // In dev, return OTP in response for testing
    if (!this.config.isProduction) {
      response.devOtp = code;
    }

    return response;
  }

  // ─── OTP: Verify (patient login / doctor login) ───────────────────────────

  async verifyOtp(dto: VerifyOtpDto) {
    const { mobile, otp } = dto;

    await this.validateOtp(mobile, otp);

    // Check if user exists
    let user = await this.prisma.user.findUnique({
      where: { mobile },
      include: {
        doctorProfile: {
          select: { id: true, kycStatus: true, isListed: true },
        },
        patientProfile: true,
      },
    });

    const isNewUser = !user;

    if (!user) {
      // New patient — create user + empty patient profile
      user = await this.prisma.user.create({
        data: {
          mobile,
          role: PrismaUserRole.patient,
          isVerified: true,
          patientProfile: {
            create: {},
          },
        },
        include: {
          doctorProfile: { select: { id: true, kycStatus: true, isListed: true } },
          patientProfile: true,
        },
      });
      this.logger.log(`New patient created: ${user.id}`);
    } else {
      // Existing user — mark mobile as verified
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true, lastLoginAt: new Date() },
      });
    }

    // Block admin accounts from OTP login
    if (user.role === PrismaUserRole.admin || user.role === PrismaUserRole.super_admin) {
      throw new UnauthorizedException('Admin accounts must use email and password login.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Your account has been suspended. Contact support@docnear.in',
      );
    }

    const tokens = await this.generateTokens(user.id, user.mobile, user.role);

    return {
      user: this.sanitizeUser(user),
      tokens,
      isNewUser,
      ...(user.role === PrismaUserRole.doctor && user.doctorProfile
        ? {
            kycStatus: user.doctorProfile.kycStatus,
            isListed: user.doctorProfile.isListed,
          }
        : {}),
    };
  }

  // ─── Doctor Registration ──────────────────────────────────────────────────

  async registerDoctor(dto: DoctorRegisterDto) {
    const { mobile, email, otp, name, registrationNumber, ...profileData } = dto;

    // Verify OTP first
    await this.validateOtp(mobile, otp);

    // Check for existing accounts
    const existingByMobile = await this.prisma.user.findUnique({ where: { mobile } });
    if (existingByMobile) {
      throw new ConflictException(
        'A doctor account with this mobile number already exists. Please log in instead.',
      );
    }

    if (email) {
      const existingByEmail = await this.prisma.user.findUnique({ where: { email } });
      if (existingByEmail) {
        throw new ConflictException('This email is already registered to another account.');
      }
    }

    // Check duplicate registration number
    const existingReg = await this.prisma.doctorProfile.findUnique({
      where: { registrationNumber },
    });
    if (existingReg) {
      throw new ConflictException('This medical registration number is already in our system.');
    }

    // Create user + doctor profile + KYC submission in a transaction
    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          mobile,
          email: email ?? undefined,
          name,
          role: PrismaUserRole.doctor,
          isVerified: true, // mobile verified via OTP
          doctorProfile: {
            create: {
              registrationNumber,
              qualifications: profileData.qualifications,
              specializations: profileData.specializations,
              experience: profileData.experience,
              bio: profileData.bio,
              languages: profileData.languages ?? ['Hindi', 'English'],
              clinicName: profileData.clinicName,
              clinicAddress: profileData.clinicAddress,
              city: profileData.city,
              pincode: profileData.pincode,
              consultationFee: profileData.consultationFee,
              kycStatus: PrismaKycStatus.pending,
              isListed: false,
              // KYC submission created alongside
              kycSubmission: {
                create: {
                  status: PrismaKycStatus.pending,
                },
              },
            },
          },
        },
        include: {
          doctorProfile: {
            select: { id: true, kycStatus: true, isListed: true },
          },
        },
      });

      return newUser;
    });

    this.logger.log(`New doctor registered: ${user.id} — ${name}`);

    // Send confirmation email (non-blocking)
    if (email) {
      void this.email.sendDoctorRegistrationPending(email, name);
    }

    const tokens = await this.generateTokens(user.id, user.mobile, user.role);

    return {
      user: this.sanitizeUser(user),
      tokens,
      kycStatus: PrismaKycStatus.pending,
      message:
        "Registration successful! Your profile is under review. We'll notify you within 24–48 hours.",
    };
  }

  // ─── Admin Login ──────────────────────────────────────────────────────────

  async adminLogin(dto: AdminLoginDto) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    const adminPasswordHash = this.config.adminPasswordHash;

    if (!user || !adminPasswordHash) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.role !== PrismaUserRole.admin && user.role !== PrismaUserRole.super_admin) {
      throw new UnauthorizedException('Access denied.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account suspended.');
    }

    const passwordMatch = await bcrypt.compare(password, adminPasswordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email!, user.role);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  // ─── Refresh Tokens ───────────────────────────────────────────────────────

  async refreshTokens(refreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = this.jwt.verify<JwtPayload>(refreshToken, {
        secret: this.config.jwtRefreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token. Please log in again.');
    }

    // Verify stored token hash matches
    const storedHash = await this.redis.getRefreshToken(payload.sub);
    if (!storedHash) {
      throw new UnauthorizedException('Session expired. Please log in again.');
    }

    const hashMatch = await bcrypt.compare(refreshToken, storedHash);
    if (!hashMatch) {
      // Token reuse detected — invalidate all sessions for this user
      await this.redis.deleteRefreshToken(payload.sub);
      throw new UnauthorizedException('Token reuse detected. All sessions invalidated.');
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Account not found or suspended.');
    }

    const tokens = await this.generateTokens(user.id, user.mobile ?? user.email!, user.role);
    return { tokens };
  }

  // ─── Logout ───────────────────────────────────────────────────────────────

  async logout(userId: string): Promise<void> {
    await this.redis.deleteRefreshToken(userId);
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private async validateOtp(mobile: string, otp: string): Promise<void> {
    const attempts = await this.redis.incrementOtpAttempts(mobile);
    if (attempts > OTP_MAX_ATTEMPTS) {
      throw new BadRequestException('Too many incorrect OTP attempts. Please request a new OTP.');
    }

    const storedOtp = await this.redis.getOtp(mobile);
    if (!storedOtp) {
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    if (storedOtp !== otp) {
      const remaining = OTP_MAX_ATTEMPTS - attempts;
      throw new BadRequestException(
        `Incorrect OTP. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
      );
    }

    // Valid — clean up
    await this.redis.deleteOtp(mobile);
    await this.redis.resetOtpAttempts(mobile);
  }

  private async generateTokens(
    userId: string,
    identifier: string,
    role: JwtPayload['role'],
  ): Promise<AuthTokens> {
    const payload: JwtPayload = { sub: userId, mobile: identifier, role };

    const accessTokenOptions: JwtSignOptions = {
      secret: this.config.jwtSecret,
      expiresIn: this.config.jwtExpiresIn,
    };

    const refreshTokenOptions: JwtSignOptions = {
      secret: this.config.jwtRefreshSecret,
      expiresIn: this.config.jwtRefreshExpiresIn,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, accessTokenOptions),
      this.jwt.signAsync({ sub: userId }, refreshTokenOptions),
    ]);

    // Store hashed refresh token in Redis
    const tokenHash = await bcrypt.hash(refreshToken, 8);
    await this.redis.setRefreshToken(userId, tokenHash, 604800); // 7 days

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  /** Remove sensitive fields before sending user to frontend */
  private sanitizeUser(user: Record<string, unknown>) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safe } = user as { passwordHash?: string } & Record<string, unknown>;
    return safe;
  }
}
