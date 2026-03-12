import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';
import { AuthModule } from './modules/auth/auth.module';
import { KycModule } from './modules/kyc/kyc.module';
import { RedisModule } from '@common/redis/redis.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    RedisModule,
    AuthModule,
    KycModule,
    // UsersModule,    <- Phase 2
    // DoctorsModule,
    // AppointmentsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, HealthService],
})
export class AppModule {}
