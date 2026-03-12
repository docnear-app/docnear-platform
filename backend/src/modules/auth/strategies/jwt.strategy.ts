import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AppConfigService } from '../../../config/config.service';
import type { JwtPayload } from '../../../types/auth.types';

/**
 * JwtStrategy — validates the access token on every protected request.
 *
 * After validation, `request.user` is set to the full user object from DB.
 * We fetch from DB (not just trust the JWT) so:
 *   - Suspended accounts are immediately blocked (isActive check)
 *   - Latest role changes take effect without re-login
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: AppConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        doctorProfile: {
          select: {
            id: true,
            kycStatus: true,
            isListed: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Account not found or suspended');
    }

    // Inject into request.user — accessible via @CurrentUser() decorator
    return user;
  }
}
