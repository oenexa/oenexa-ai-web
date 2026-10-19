import {
  UserProfile,
  UserProfileUpdateRequest,
  TwoFactorSetupResponse,
  UserSession,
  AuditLogEntry,
} from '../types/auth';

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || '';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds?: number;
}

export interface AuthLoginResponse {
  tokens?: TokenPair;
  status?: string;
  challenge?: string;
}

export const authService = {
  async login(usernameOrEmail: string, password: string, device?: Record<string, string>): Promise<AuthLoginResponse> {
    const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail,
        password,
        device: device || {
          ipAddress: '127.0.0.1',
          userAgent: navigator.userAgent,
          deviceType: 'Web',
          browser: 'Browser',
          os: navigator.platform,
          country: 'Global',
        },
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    if (data.status === '2FA_REQUIRED') {
      return { status: '2FA_REQUIRED', challenge: data.challenge };
    }
    return { tokens: data };
  },

  async register(username: string, email: string, password: string, fullName?: string): Promise<TokenPair> {
    const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, fullName }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    return data;
  },

  async oauthLogin(
    provider: 'GOOGLE' | 'GITHUB' | 'MICROSOFT' | 'APPLE',
    payload: { email: string; fullName?: string; avatarUrl?: string; accessToken?: string }
  ): Promise<TokenPair> {
    const res = await fetch(`${API_BASE}/api/v1/auth/oauth/${provider.toLowerCase()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider,
        providerId: `oauth-${Date.now()}`,
        email: payload.email,
        fullName: payload.fullName || `${provider} Engineer`,
        avatarUrl: payload.avatarUrl || '',
        accessToken: payload.accessToken || 'mock-token',
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `${provider} login failed`);
    }
    return data;
  },

  async refresh(refreshToken: string): Promise<TokenPair> {
    const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Token refresh failed');
    }
    return data;
  },

  async getProfile(token: string): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to load profile');
    }
    return data;
  },

  async updateProfile(token: string, req: UserProfileUpdateRequest): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/api/v1/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(req),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update profile');
    }
    return data;
  },

  async setupTwoFactor(token: string): Promise<TwoFactorSetupResponse> {
    const res = await fetch(`${API_BASE}/api/v1/auth/2fa/setup`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to setup 2FA');
    }
    return data;
  },

  async verifyTwoFactor(usernameOrEmail: string, code: string, secret?: string): Promise<TokenPair> {
    const res = await fetch(`${API_BASE}/api/v1/auth/2fa/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail, code, secret }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Invalid 2FA code');
    }
    return data;
  },

  async sendOtp(email: string, purpose: string): Promise<string> {
    const res = await fetch(`${API_BASE}/api/v1/auth/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, purpose }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to dispatch OTP');
    }
    return data.code;
  },

  async verifyOtp(email: string, code: string, purpose: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/api/v1/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, purpose }),
    });
    return res.ok;
  },

  async requestPasswordReset(email: string): Promise<string> {
    const res = await fetch(`${API_BASE}/api/v1/auth/password/reset-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to request password reset');
    }
    return data.resetToken;
  },

  async confirmPasswordReset(email: string, resetToken: string, newPassword: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/v1/auth/password/reset-confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, resetToken, newPassword }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Password reset failed');
    }
  },

  async listSessions(token: string): Promise<UserSession[]> {
    const res = await fetch(`${API_BASE}/api/v1/auth/sessions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to list sessions');
    }
    return data;
  },

  async revokeSession(token: string, sessionId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/v1/auth/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error('Failed to revoke session');
    }
  },

  async getAuditLogs(token: string): Promise<AuditLogEntry[]> {
    const res = await fetch(`${API_BASE}/api/v1/auth/audit-logs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to load audit logs');
    }
    return data;
  },
};
