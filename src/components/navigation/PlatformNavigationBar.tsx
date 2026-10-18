import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Chip,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Chat as ChatIcon,
  Code as CodeIcon,
  ViewModule,
  Lock,
  ExitToApp,
  AccountCircle,
  Psychology,
  Speed,
  Memory as MemoryIcon,
  SmartToy as SmartToyIcon,
  Storage as StorageIcon,
  Assignment as AssignmentIcon,
  Bolt as BoltIcon,
} from '@mui/icons-material';

export interface PlatformNavigationBarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  token: string | null;
  username: string;
  onOpenAuthDialog: () => void;
  onLogout: () => void;
  activeTab: number;
  onTabChange: (newTab: number) => void;
}

export const PlatformNavigationBar: React.FC<PlatformNavigationBarProps> = ({
  darkMode,
  toggleDarkMode,
  token,
  username,
  onOpenAuthDialog,
  onLogout,
  activeTab,
  onTabChange,
}) => {
  return (
    <>
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
              ⚡ OENEXA AI Engineer
            </Typography>
            <Chip
              label="Java 25 • Spring Boot 4.1.1 • Gemini Pro • Claude • GPT-4o • Devin AI"
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.15)',
                color: '#fff',
                fontWeight: 600,
                display: { xs: 'none', md: 'inline-flex' },
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

      {/* Navigation Tabs */}
      <Paper
        square
        elevation={1}
        sx={{
          bgcolor: darkMode ? '#1e293b' : '#ffffff',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, val) => onTabChange(val)}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
        >
          <Tab
            icon={<CodeIcon />}
            iconPosition="start"
            label="Code Workspace"
            sx={{ fontWeight: 600 }}
          />
          <Tab
            icon={<Psychology />}
            iconPosition="start"
            label="Gemini 4 Argon AI Agent"
            sx={{ fontWeight: 600 }}
          />
          <Tab
            icon={<SmartToyIcon />}
            iconPosition="start"
            label="7 Collaborative Agents"
            sx={{ fontWeight: 600 }}
          />
          <Tab
            icon={<ChatIcon />}
            iconPosition="start"
            label="AI Assistant Chat (Gemini Pro)"
            sx={{ fontWeight: 600 }}
          />
          <Tab
            icon={<StorageIcon />}
            iconPosition="start"
            label="Repository Knowledge & RAG"
            sx={{ fontWeight: 600 }}
          />
          <Tab
            icon={<MemoryIcon />}
            iconPosition="start"
            label="AI Memory Inspector"
            sx={{ fontWeight: 600 }}
          />
          <Tab
            icon={<ViewModule />}
            iconPosition="start"
            label="Platform Modules (23)"
            sx={{ fontWeight: 600 }}
          />
          <Tab
            icon={<AssignmentIcon />}
            iconPosition="start"
            label="AI Product Manager & PRD Studio"
            sx={{ fontWeight: 600 }}
          />
          <Tab
            icon={<Speed />}
            iconPosition="start"
            label="Target Capabilities (Claude, Gemini, Cursor, Devin, Copilot, Operator)"
            sx={{ fontWeight: 600 }}
          />
          <Tab
            icon={<BoltIcon />}
            iconPosition="start"
            label="⚡ Neo-GPT Agent OS (OpenAI Native)"
            sx={{ fontWeight: 600 }}
          />
        </Tabs>
      </Paper>
    </>
  );
};

export default PlatformNavigationBar;
