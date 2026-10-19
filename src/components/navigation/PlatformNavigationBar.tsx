import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Chip,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Lock,
  ExitToApp,
  AccountCircle,
  CreditCard,
  Memory,
} from '@mui/icons-material';

export interface PlatformNavigationBarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  token: string | null;
  username: string;
  onOpenAuthDialog: () => void;
  onLogout: () => void;
  onOpenBilling?: () => void;
  onOpenTelemetry?: () => void;
  activeModel?: string;
}

export const PlatformNavigationBar: React.FC<PlatformNavigationBarProps> = ({
  darkMode,
  toggleDarkMode,
  token,
  username,
  onOpenAuthDialog,
  onLogout,
  onOpenBilling,
  onOpenTelemetry,
  activeModel = 'deepseek-r1:8b',
}) => {
  return (
    <AppBar position="static" color="primary" enableColorOnDark elevation={2}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.025em',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            ⚡ OENEXA Chat
          </Typography>
          <Chip
            label={`🟢 ${activeModel} • Local Ollama`}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.18)',
              color: '#fff',
              fontWeight: 600,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {token ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountCircle fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {username}
              </Typography>
              <IconButton color="inherit" size="small" onClick={onLogout} title="Logout">
                <ExitToApp fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Button
              color="inherit"
              startIcon={<Lock />}
              onClick={onOpenAuthDialog}
              size="small"
              variant="outlined"
              sx={{ borderColor: 'rgba(255,255,255,0.4)' }}
            >
              Sign In
            </Button>
          )}

          {onOpenBilling && (
            <Button
              color="inherit"
              startIcon={<CreditCard />}
              onClick={onOpenBilling}
              size="small"
              variant="outlined"
              sx={{ borderColor: 'rgba(255,255,255,0.4)' }}
            >
              Plans & Quotas
            </Button>
          )}

          {onOpenTelemetry && (
            <Button
              color="inherit"
              startIcon={<Memory />}
              onClick={onOpenTelemetry}
              size="small"
              variant="outlined"
              sx={{ borderColor: 'rgba(255,255,255,0.4)' }}
            >
              7-Layer Memory & MCP
            </Button>
          )}

          <IconButton
            color="inherit"
            onClick={toggleDarkMode}
            aria-label="toggle dark mode"
            size="small"
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default PlatformNavigationBar;
