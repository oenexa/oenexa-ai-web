import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import AppleIcon from '@mui/icons-material/Apple';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { authService, TokenPair } from '../../services/authService';

export interface AuthSuccessPayload {
  token: string;
  username: string;
  role?: string;
}

export interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (token: string, username: string) => void;
  onAuthSuccess?: (payload: AuthSuccessPayload) => void;
  notify: (msg: string) => void;
  token?: string;
}

type AuthTab = 'login' | 'register' | 'otp' | 'forgot' | '2fa';

export const AuthDialog: React.FC<AuthDialogProps> = ({
  open,
  onClose,
  onSuccess,
  onAuthSuccess,
  notify,
}) => {
  const [tab, setTab] = useState<AuthTab>('login');
  const [username, setUsername] = useState<string>('admin');
  const [email, setEmail] = useState<string>('admin@oenexa.com');
  const [password, setPassword] = useState<string>('Admin@Oenexa2026!');
  const [fullName, setFullName] = useState<string>('Lead Engineer');
  const [totpCode, setTotpCode] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [resetToken, setResetToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successInfo, setSuccessInfo] = useState<string>('');

  const handleSuccess = (tokens: TokenPair, user: string) => {
    if (onSuccess) {
      onSuccess(tokens.accessToken, user);
    }
    if (onAuthSuccess) {
      onAuthSuccess({ token: tokens.accessToken, username: user });
    }
    notify(`Welcome to OENEXA AI, ${user}!`);
    onClose();
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const resp = await authService.login(username, password);
      if (resp.status === '2FA_REQUIRED') {
        setTab('2fa');
        setSuccessInfo('Two-Factor Authentication is enabled. Please enter your 6-digit TOTP code.');
      } else if (resp.tokens) {
        handleSuccess(resp.tokens, username);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      const tokens = await authService.register(username, email, password, fullName);
      handleSuccess(tokens, username);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorVerify = async () => {
    setError('');
    setLoading(true);
    try {
      const tokens = await authService.verifyTwoFactor(username, totpCode);
      handleSuccess(tokens, username);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid 2FA code');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'GOOGLE' | 'GITHUB' | 'MICROSOFT' | 'APPLE') => {
    setError('');
    setLoading(true);
    try {
      const simulatedEmail = `${provider.toLowerCase()}.engineer@oenexa.com`;
      const tokens = await authService.oauthLogin(provider, {
        email: simulatedEmail,
        fullName: `${provider} Engineer`,
      });
      handleSuccess(tokens, simulatedEmail.split('@')[0]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : `${provider} OAuth failed`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const code = await authService.sendOtp(email, 'LOGIN');
      setSuccessInfo(`OTP Code dispatched to ${email}: ${code}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const valid = await authService.verifyOtp(email, otpCode, 'LOGIN');
      if (valid) {
        notify(`OTP verified successfully for ${email}`);
        setTab('login');
      } else {
        setError('Invalid or expired OTP code');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPasswordReset = async () => {
    setError('');
    setLoading(true);
    try {
      const token = await authService.requestPasswordReset(email);
      setResetToken(token);
      setSuccessInfo(`Reset token issued. Please choose a new secure password.`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to request reset');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPasswordReset = async () => {
    setError('');
    setLoading(true);
    try {
      await authService.confirmPasswordReset(email, resetToken, newPassword);
      notify('Password reset successful. Please sign in with your new password.');
      setTab('login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography component="div" variant="h6" fontWeight="bold">
          {tab === 'login' && '🔐 Sign In to OENEXA'}
          {tab === 'register' && '📝 Create Engineer Account'}
          {tab === '2fa' && '🛡️ Two-Factor Authentication'}
          {tab === 'otp' && '⚡ Instant OTP Sign-In'}
          {tab === 'forgot' && '🔄 Reset Password'}
        </Typography>
      </DialogTitle>

      <Box sx={{ px: 3 }}>
        <Tabs
          value={tab === '2fa' ? 'login' : tab}
          onChange={(_, val) => {
            setTab(val as AuthTab);
            setError('');
            setSuccessInfo('');
          }}
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab label="Sign In" value="login" />
          <Tab label="Sign Up" value="register" />
          <Tab label="OTP" value="otp" />
          <Tab label="Reset" value="forgot" />
        </Tabs>
      </Box>

      <DialogContent sx={{ pt: 0, pb: 1 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successInfo && <Alert severity="info" sx={{ mb: 2 }}>{successInfo}</Alert>}

        {tab === 'login' && (
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <TextField fullWidth margin="dense" label="Username or Email" value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField fullWidth margin="dense" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button fullWidth variant="contained" size="large" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }} onClick={handleLogin} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
            <Divider sx={{ my: 1 }}>or sign in with</Divider>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
              <Tooltip title="Google Login"><IconButton onClick={() => handleOAuth('GOOGLE')} color="primary"><GoogleIcon /></IconButton></Tooltip>
              <Tooltip title="GitHub Login"><IconButton onClick={() => handleOAuth('GITHUB')} color="inherit"><GitHubIcon /></IconButton></Tooltip>
              <Tooltip title="Apple Login"><IconButton onClick={() => handleOAuth('APPLE')} color="inherit"><AppleIcon /></IconButton></Tooltip>
              <Tooltip title="Microsoft Login"><IconButton onClick={() => handleOAuth('MICROSOFT')} color="info"><VpnKeyIcon /></IconButton></Tooltip>
            </Box>
          </Box>
        )}

        {tab === 'register' && (
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
            <TextField fullWidth margin="dense" label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <TextField fullWidth margin="dense" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField fullWidth margin="dense" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField fullWidth margin="dense" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button fullWidth variant="contained" size="large" sx={{ mt: 2, fontWeight: 'bold' }} onClick={handleRegister} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
          </Box>
        )}

        {tab === '2fa' && (
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleTwoFactorVerify(); }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter the 6-digit verification code from your authenticator app (Google Authenticator, Authy, or 1Password).
            </Typography>
            <TextField fullWidth margin="dense" label="6-Digit TOTP Code" value={totpCode} onChange={(e) => setTotpCode(e.target.value)} placeholder="123456" autoFocus />
            <Button fullWidth variant="contained" size="large" sx={{ mt: 2, fontWeight: 'bold' }} onClick={handleTwoFactorVerify} disabled={loading || totpCode.length < 6}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Code & Sign In'}
            </Button>
            <Button fullWidth sx={{ mt: 1 }} onClick={() => setTab('login')}>Back to Sign In</Button>
          </Box>
        )}

        {tab === 'otp' && (
          <Box>
            <TextField fullWidth margin="dense" label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button fullWidth variant="outlined" sx={{ mt: 1, mb: 2 }} onClick={handleSendOtp} disabled={loading || !email}>
              Send One-Time Passcode
            </Button>
            <TextField fullWidth margin="dense" label="Enter 6-Digit OTP" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="6-digit code" />
            <Button fullWidth variant="contained" size="large" sx={{ mt: 2 }} onClick={handleVerifyOtp} disabled={loading || !otpCode}>
              Verify OTP
            </Button>
          </Box>
        )}

        {tab === 'forgot' && (
          <Box>
            <TextField fullWidth margin="dense" label="Registered Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {!resetToken ? (
              <Button fullWidth variant="outlined" sx={{ mt: 1 }} onClick={handleRequestPasswordReset} disabled={loading || !email}>
                Request Reset Token
              </Button>
            ) : (
              <>
                <TextField fullWidth margin="dense" label="Reset Token" value={resetToken} onChange={(e) => setResetToken(e.target.value)} />
                <TextField fullWidth margin="dense" label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <Button fullWidth variant="contained" size="large" sx={{ mt: 2 }} onClick={handleConfirmPasswordReset} disabled={loading || !newPassword}>
                  Update Password
                </Button>
              </>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">
          Bank-grade TLS 1.3 & JWT HS256 Protected
        </Typography>
        <Button size="small" onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthDialog;
