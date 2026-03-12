import {
  IsString,
  IsMobilePhone,
  IsEmail,
  IsOptional,
  IsArray,
  IsInt,
  Min,
  Max,
  Length,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

// ─── Send OTP ────────────────────────────────────────────────────────────────

export class SendOtpDto {
  @ApiProperty({ example: '9876543210', description: '10-digit Indian mobile number' })
  @IsMobilePhone('en-IN', {}, { message: 'Please enter a valid 10-digit Indian mobile number' })
  @Transform(({ value }: { value: string }) => value?.trim().replace(/^\+?91/, ''))
  mobile!: string;
}

// ─── Verify OTP (patient login / existing doctor login) ──────────────────────

export class VerifyOtpDto {
  @ApiProperty({ example: '9876543210' })
  @IsMobilePhone('en-IN', {}, { message: 'Invalid mobile number' })
  @Transform(({ value }: { value: string }) => value?.trim().replace(/^\+?91/, ''))
  mobile!: string;

  @ApiProperty({ example: '482910', description: '6-digit OTP' })
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'OTP must be 6 digits' })
  otp!: string;
}

// ─── Doctor Registration ──────────────────────────────────────────────────────

export class DoctorRegisterDto {
  // ── Personal info ──────────────────────────────────────────────────────────
  @ApiProperty({ example: 'Dr. Suresh Patel' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => value?.trim())
  name!: string;

  @ApiProperty({ example: '9876543210' })
  @IsMobilePhone('en-IN', {}, { message: 'Invalid mobile number' })
  @Transform(({ value }: { value: string }) => value?.trim().replace(/^\+?91/, ''))
  mobile!: string;

  @ApiPropertyOptional({ example: 'suresh@gmail.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  email?: string;

  // ── OTP verification (included in registration payload) ───────────────────
  @ApiProperty({ example: '482910', description: '6-digit OTP sent to mobile' })
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'OTP must be 6 digits' })
  otp!: string;

  // ── Professional info ──────────────────────────────────────────────────────
  @ApiProperty({ example: 'MP/12345/2020', description: 'Medical Council registration number' })
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  @Transform(({ value }: { value: string }) => value?.trim().toUpperCase())
  registrationNumber!: string;

  @ApiProperty({ example: ['MBBS', 'MD'], description: 'Degrees and qualifications' })
  @IsArray()
  @IsString({ each: true })
  qualifications!: string[];

  @ApiProperty({ example: ['General Medicine', 'Cardiology'] })
  @IsArray()
  @IsString({ each: true })
  specializations!: string[];

  @ApiProperty({ example: 5, description: 'Years of experience' })
  @IsInt()
  @Min(0)
  @Max(60)
  experience!: number;

  @ApiPropertyOptional({ example: 'Experienced general physician...' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  // ── Languages ──────────────────────────────────────────────────────────────
  @ApiPropertyOptional({ example: ['Hindi', 'English'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  // ── Clinic info ────────────────────────────────────────────────────────────
  @ApiPropertyOptional({ example: 'Patel Clinic' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  clinicName?: string;

  @ApiPropertyOptional({ example: '123 Station Road, Near Bus Stand' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  clinicAddress?: string;

  @ApiProperty({ example: 'Nagda' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => value?.trim())
  city!: string;

  @ApiProperty({ example: '456335' })
  @IsString()
  @Matches(/^\d{6}$/, { message: 'Pincode must be 6 digits' })
  pincode!: string;

  @ApiProperty({ example: 300, description: 'Consultation fee in rupees' })
  @IsInt()
  @Min(0)
  @Max(10000)
  consultationFee!: number;
}

// ─── Admin Login ──────────────────────────────────────────────────────────────

export class AdminLoginDto {
  @ApiProperty({ example: 'admin@docnear.in' })
  @IsEmail({}, { message: 'Invalid email address' })
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  email!: string;

  @ApiProperty({ example: 'Admin@123', description: 'Admin password' })
  @IsString()
  @MinLength(8)
  password!: string;
}

// ─── Refresh Token ────────────────────────────────────────────────────────────

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token from login response' })
  @IsString()
  refreshToken!: string;
}
