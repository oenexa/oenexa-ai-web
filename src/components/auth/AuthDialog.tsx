import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from '@mui/material';

export interface AuthSuccessPayload {
  token: string;
  username: string;
}

export interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  onAuthSuccess: (payload: AuthSuccessPayload) => void;
  notify: (msg: string) => void;
}

export const AuthDialog: React.FC<AuthDialogProps> = ({
  open,
  onClose,
  onAuthSuccess,
  notify,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authUsername, setAuthUsername] = useState<string>('admin');
  const [authPassword, setAuthPassword] = useState<string>('Admin@Oenexa2026!');
  const [authError, setAuthError] = useState<string>('');

  const handleAuthSubmit = async () => {
    setAuthError('');
    const endpoint = authMode === 'login' ? '/api/v1/auth/login' : '/api/v1/auth/register';
    const payload =
      authMode === 'login'
        ? { usernameOrEmail: authUsername, password: authPassword }
        : { username: authUsername, email: authEmail, password: authPassword, fullName: authUsername };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Authentication failed');
        return;
      }
      onAuthSuccess({
        token: data.accessToken,
        username: authUsername,
      });
      onClose();
      notify(`Welcome back, ${authUsername}!`);
    } catch {
      setAuthError('Connection to authentication service failed');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{authMode === 'login' ? '🔐 Sign In to OENEXA' : '📝 Create Engineer Account'}</DialogTitle>
      <DialogContent sx={{ pt: 1, minWidth: 320 }}>
        {authError && (
          <Typography color="error" variant="caption" sx={{ mb: 1, display: 'block' }}>
            {authError}
          </Typography>
        )}
        <TextField
          fullWidth
          margin="dense"
          label="Username"
          value={authUsername}
          onChange={(e) => setAuthUsername(e.target.value)}
        />
        {authMode === 'register' && (
          <TextField
            fullWidth
            margin="dense"
            label="Email"
            type="email"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
          />
        )}
        <TextField
          fullWidth
          margin="dense"
          label="Password"
          type="password"
          value={authPassword}
          onChange={(e) => setAuthPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button size="small" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
          {authMode === 'login' ? 'Need an account? Register' : 'Have an account? Sign in'}
        </Button>
        <Button variant="contained" onClick={handleAuthSubmit}>
          {authMode === 'login' ? 'Sign In' : 'Register'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthDialog;
