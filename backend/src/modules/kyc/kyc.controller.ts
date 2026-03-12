import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../types/enums';
import { ReviewKycDto } from './dto';
import { KycService } from './kyc.service';

@ApiTags('KYC')
@ApiBearerAuth()
@Controller('kyc')
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Get('pending')
  @ApiOperation({ summary: 'All pending KYC submissions' })
  getPendingSubmissions() {
    return this.kycService.getPendingSubmissions();
  }

  @Get('pending/count')
  @ApiOperation({ summary: 'Count of pending submissions — for notification badge' })
  getPendingCount() {
    return this.kycService.getPendingCount();
  }

  @Get('recent')
  @ApiOperation({ summary: 'Recently reviewed submissions (last 7 days)' })
  getRecentlyReviewed() {
    return this.kycService.getRecentlyReviewed();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Single KYC submission detail' })
  getById(@Param('id') id: string) {
    return this.kycService.getSubmissionById(id);
  }

  @Post(':id/review')
  @ApiOperation({ summary: 'Approve or reject a KYC submission' })
  review(@Param('id') id: string, @CurrentUser('id') adminId: string, @Body() dto: ReviewKycDto) {
    return this.kycService.reviewSubmission(id, adminId, dto);
  }
}
