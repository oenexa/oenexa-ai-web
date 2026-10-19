export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  profileImageUrl?: string;
  bio?: string;
  company?: string;
  profession?: string;
  language: string;
  timezone: string;
  subscriptionPlan: 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';
  role: string;
  tenantId: string;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export interface UserProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  country?: string;
  bio?: string;
  company?: string;
  profession?: string;
  language?: string;
  timezone?: string;
  profileImageUrl?: string;
}

export interface TwoFactorSetupResponse {
  secret: string;
  otpauthUrl: string;
  backupCodes: string[];
}

export interface UserSession {
  sessionId: string;
  userId: string;
  username: string;
  device: {
    ipAddress: string;
    userAgent: string;
    deviceType: string;
    browser: string;
    os: string;
    country: string;
  };
  createdAt: string;
  lastActiveAt: string;
  active: boolean;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  username: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: string;
  details: Record<string, string>;
}
