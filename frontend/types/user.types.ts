import type { KycStatus, UserRole } from './enums';

export interface IUser {
  id: string;
  mobile: string;
  email?: string;
  role: UserRole;
  name?: string;
  avatar?: string;
  isActive: boolean;
  isVerified: boolean;
  kycStatus?: KycStatus;
  isListed?: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}
