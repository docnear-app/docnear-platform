import { IsIn, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Only admin can set these two statuses
export const KycDecision = {
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type KycDecision = (typeof KycDecision)[keyof typeof KycDecision];

export class ReviewKycDto {
  @ApiProperty({ enum: Object.values(KycDecision), example: KycDecision.APPROVED })
  @IsIn(Object.values(KycDecision))
  decision!: KycDecision;

  @ApiProperty({ required: false, example: 'Registration number does not match MCI records' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
