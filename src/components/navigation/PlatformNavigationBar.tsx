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
  viewMode?: 'chat' | 'swarm';
  onSelectView?: (mode: 'chat' | 'swarm') => void;
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
  viewMode = 'chat',
  onSelectView,
}) => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: darkMode ? '#18181b' : '#ffffff',
        color: darkMode ? '#f4f4f5' : '#18181b',
        borderBottom: 1,
        borderColor: darkMode ? '#27272a' : '#e4e4e7',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: '56px !important', px: { xs: 1.5, sm: 2 } }}>
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
              fontSize: '1.05rem',
              color: darkMode ? '#f4f4f5' : '#09090b',
            }}
          >
            ⚡ OENEXA Chat
          </Typography>
          <Chip
            label={`🟢 ${activeModel} • Local Ollama`}
            size="small"
            sx={{
              bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              color: 'inherit',
              fontWeight: 600,
              fontSize: '0.72rem',
              border: 1,
              borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
            }}
          />
        </Box>

        {/* View Switcher: Chat vs Antigravity Swarm Threads */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9', p: 0.4, borderRadius: 2 }}>
          <Button
            size="small"
            variant={viewMode === 'chat' ? 'contained' : 'text'}
            onClick={() => onSelectView?.('chat')}
            sx={{
              textTransform: 'none',
              fontSize: '0.75rem',
              fontWeight: 700,
              py: 0.3,
              px: 1.5,
              borderRadius: 1.5,
              ...(viewMode === 'chat' ? { bgcolor: '#0284c7', color: '#fff' } : { color: 'inherit' }),
            }}
          >
            💬 Chat
          </Button>
          <Button
            size="small"
            variant={viewMode === 'swarm' ? 'contained' : 'text'}
            onClick={() => onSelectView?.('swarm')}
            sx={{
              textTransform: 'none',
              fontSize: '0.75rem',
              fontWeight: 700,
              py: 0.3,
              px: 1.5,
              borderRadius: 1.5,
              ...(viewMode === 'swarm' ? { bgcolor: '#0284c7', color: '#fff' } : { color: 'inherit' }),
            }}
          >
            ⚡ Swarm Threads
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          {token ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <AccountCircle fontSize="small" sx={{ color: 'text.secondary' }} />
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
              sx={{
                textTransform: 'none',
                borderColor: darkMode ? '#3f3f46' : '#d4d4d8',
                borderRadius: 1.5,
              }}
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
              sx={{
                textTransform: 'none',
                borderColor: darkMode ? '#3f3f46' : '#d4d4d8',
                borderRadius: 1.5,
                display: { xs: 'none', sm: 'inline-flex' },
              }}
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
              sx={{
                textTransform: 'none',
                borderColor: darkMode ? '#3f3f46' : '#d4d4d8',
                borderRadius: 1.5,
                display: { xs: 'none', md: 'inline-flex' },
              }}
            >
              7-Layer Memory & MCP
            </Button>
          )}

          <IconButton
            color="inherit"
            onClick={toggleDarkMode}
            aria-label="toggle dark mode"
            size="small"
            sx={{ p: 0.8 }}
          >
            {darkMode ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default PlatformNavigationBar;
