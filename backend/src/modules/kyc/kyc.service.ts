import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { KycStatus as PrismaKycStatus } from '../../../generated/prisma/enums';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EmailService } from '../auth/services/email.service';
import { KycDecision, ReviewKycDto } from './dto';

@Injectable()
export class KycService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
  ) {}

  /** All pending KYC submissions for admin review queue */
  async getPendingSubmissions() {
    return this.prisma.kycSubmission.findMany({
      where: { status: PrismaKycStatus.pending },
      include: {
        doctor: {
          // relation name from schema
          include: {
            user: {
              select: {
                id: true,
                name: true,
                mobile: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { submittedAt: 'asc' }, // KycSubmission uses submittedAt
    });
  }

  /** Count of pending submissions — used for admin notification badge */
  async getPendingCount(): Promise<{ count: number }> {
    const count = await this.prisma.kycSubmission.count({
      where: { status: PrismaKycStatus.pending },
    });
    return { count };
  }

  /** Single KYC submission with full doctor details */
  async getSubmissionById(id: string) {
    const submission = await this.prisma.kycSubmission.findUnique({
      where: { id },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                mobile: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!submission) throw new NotFoundException('KYC submission not found');
    return submission;
  }

  /** Admin approves or rejects — updates KycSubmission + DoctorProfile atomically */
  async reviewSubmission(id: string, adminId: string, dto: ReviewKycDto) {
    const submission = await this.getSubmissionById(id);

    if (submission.status !== PrismaKycStatus.pending) {
      throw new BadRequestException('This submission has already been reviewed');
    }

    const isApproved = dto.decision === KycDecision.APPROVED;

    if (!isApproved && !dto.rejectionReason) {
      throw new BadRequestException('Rejection reason is required when rejecting');
    }

    // Map KycDecision → KycStatus (both use the same lowercase values)
    const newStatus = isApproved ? PrismaKycStatus.approved : PrismaKycStatus.rejected;

    const [updatedSubmission] = await this.prisma.$transaction([
      this.prisma.kycSubmission.update({
        where: { id },
        data: {
          status: newStatus,
          reviewedAt: new Date(),
          reviewedBy: adminId,
          rejectionReason: dto.rejectionReason ?? null,
        },
      }),
      this.prisma.doctorProfile.update({
        where: { id: submission.doctorProfileId },
        data: {
          kycStatus: newStatus,
          isListed: isApproved,
        },
      }),
    ]);

    // Email doctor (non-blocking — do not await to keep response fast)
    const doctorUser = submission.doctor.user;
    if (doctorUser?.email) {
      const doctorName = doctorUser.name ?? 'Doctor';
      if (isApproved) {
        this.email.sendDoctorKycApproved(doctorUser.email, doctorName).catch(() => null);
      } else {
        this.email
          .sendDoctorKycRejected(doctorUser.email, doctorName, dto.rejectionReason!)
          .catch(() => null);
      }
    }

    return updatedSubmission;
  }

  /** Recently reviewed submissions (last 7 days) for admin activity log */
  async getRecentlyReviewed() {
    const since = new Date();
    since.setDate(since.getDate() - 7);

    return this.prisma.kycSubmission.findMany({
      where: {
        status: { in: [PrismaKycStatus.approved, PrismaKycStatus.rejected] },
        reviewedAt: { gte: since },
      },
      include: {
        doctor: {
          include: {
            user: { select: { id: true, name: true, mobile: true } },
          },
        },
      },
      orderBy: { reviewedAt: 'desc' },
      take: 20,
    });
  }
}
