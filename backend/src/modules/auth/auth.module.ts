import { Module } from '@nestjs/common';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OtpService } from './services/otp.service';
import { EmailService } from './services/email.service';
import { AppConfigModule } from '../../config/config.module';
import { AppConfigService } from '../../config/config.service';

@Module({
  imports: [
    AppConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Async JWT config — reads secret from AppConfigService
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => {
        const signOptions: JwtSignOptions = {
          expiresIn: config.jwtExpiresIn,
        };
        return {
          secret: config.jwtSecret,
          signOptions,
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, OtpService, EmailService],
  exports: [AuthService, JwtModule, EmailService],
})
export class AuthModule {}
