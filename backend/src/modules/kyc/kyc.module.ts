import { Module } from '@nestjs/common';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule], // gets EmailService from AuthModule exports
  controllers: [KycController],
  providers: [KycService],
  exports: [KycService],
})
export class KycModule {}
