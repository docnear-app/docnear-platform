import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  SendOtpDto,
  VerifyOtpDto,
  DoctorRegisterDto,
  AdminLoginDto,
  RefreshTokenDto,
} from './dto/auth.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ─── OTP: Send ────────────────────────────────────────────────────────────

  @Public()
  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send OTP',
    description: 'Send a 6-digit OTP to a mobile number. Works for both patients and doctors.',
  })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 429, description: 'Too many OTP requests' })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto.mobile);
  }

  // ─── OTP: Verify (patient login + existing doctor login) ─────────────────

  @Public()
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify OTP — patient/doctor login',
    description: `
      Verifies OTP and logs in (or creates) the user.
      
      **New patient**: Creates account + patientProfile. Returns isNewUser: true.
      **Existing patient**: Returns tokens.
      **Existing doctor**: Returns tokens + kycStatus + isListed.
      **Admin**: Blocked — use POST /auth/admin/login instead.
    `,
  })
  @ApiResponse({ status: 200, description: 'OTP verified, tokens returned' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  // ─── Doctor Registration ──────────────────────────────────────────────────

  @Public()
  @Post('doctor/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new doctor',
    description: `
      Creates a new doctor account. The OTP must have been sent to the mobile
      number (via POST /auth/otp/send) before calling this endpoint.
      
      On success: creates User + DoctorProfile + KycSubmission, sends email confirmation.
      Doctor can log in immediately but will see "pending verification" screen.
    `,
  })
  @ApiResponse({ status: 201, description: 'Doctor registered, KYC pending' })
  @ApiResponse({ status: 400, description: 'Invalid OTP or validation error' })
  @ApiResponse({ status: 409, description: 'Mobile/email/registration number already exists' })
  async registerDoctor(@Body() dto: DoctorRegisterDto) {
    return this.authService.registerDoctor(dto);
  }

  // ─── Admin Login ──────────────────────────────────────────────────────────

  @Public()
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Admin login with email + password',
    description: 'Internal admin accounts only. No OTP — uses bcrypt password.',
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async adminLogin(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto);
  }

  // ─── Refresh Token ────────────────────────────────────────────────────────

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Exchange a valid refresh token for a new access + refresh token pair.',
  })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  // ─── Logout ───────────────────────────────────────────────────────────────

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout — invalidate refresh token' })
  async logout(@CurrentUser() user: { id: string }) {
    await this.authService.logout(user.id);
    return { message: 'Logged out successfully' };
  }
}
