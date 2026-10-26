import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { BugReport, Build, Shield } from '@mui/icons-material';

interface IssueDetectorCardProps {
  darkMode: boolean;
  loading: boolean;
  onDetectAndResolve: (errorTrace: string, component: string, severity: string) => void;
}

const PRESET_ISSUES = [
  {
    label: 'NullPointerException in PaymentGateway',
    trace: 'java.lang.NullPointerException: Cannot invoke "Account.getBalance()" because "acc" is null at PaymentGateway.process(PaymentGateway.java:42)',
    component: 'PaymentGateway',
    severity: 'HIGH',
  },
  {
    label: 'Thread Deadlock in ConnectionPool',
    trace: 'java.lang.IllegalStateException: Deadlock detected across carrier threads waiting on DBConnection lock',
    component: 'HikariConnectionPool',
    severity: 'CRITICAL',
  },
  {
    label: 'OWASP SQL Injection in UserQuery',
    trace: 'SecurityAlert: Unsanitized input detected in dynamic query string: SELECT * FROM users WHERE name = \'' + '\' OR 1=1--',
    component: 'JpaUserRepository',
    severity: 'CRITICAL',
  },
];

export const IssueDetectorCard: React.FC<IssueDetectorCardProps> = ({
  darkMode,
  loading,
  onDetectAndResolve,
}) => {
  const [errorTrace, setErrorTrace] = useState<string>(PRESET_ISSUES[0].trace);
  const [component, setComponent] = useState<string>(PRESET_ISSUES[0].component);
  const [severity, setSeverity] = useState<string>(PRESET_ISSUES[0].severity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!errorTrace.trim()) return;
    onDetectAndResolve(errorTrace.trim(), component, severity);
  };

  return (
    <Card
      sx={{
        bgcolor: darkMode ? '#18181b' : '#ffffff',
        border: 1,
        borderColor: darkMode ? '#27272a' : '#e4e4e7',
        borderRadius: 2,
        boxShadow: 'none',
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BugReport sx={{ color: '#ef4444', fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
              Autonomous Issue Detection & Root-Cause Resolver
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              icon={<Shield sx={{ fontSize: '14px !important' }} />}
              label="10 Pillars Charter"
              size="small"
              sx={{ bgcolor: darkMode ? 'rgba(239,68,68,0.1)' : '#fef2f2', color: '#dc2626', fontWeight: 600, fontSize: '0.72rem' }}
            />
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              size="small"
              label="Target Component / Service"
              value={component}
              onChange={(e) => setComponent(e.target.value)}
              sx={{ flex: 2 }}
            />
            <TextField
              select
              size="small"
              label="Severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              sx={{ flex: 1 }}
            >
              <MenuItem value="LOW">LOW</MenuItem>
              <MenuItem value="MEDIUM">MEDIUM</MenuItem>
              <MenuItem value="HIGH">HIGH</MenuItem>
              <MenuItem value="CRITICAL">CRITICAL</MenuItem>
            </TextField>
          </Box>

          <TextField
            fullWidth
            label="Error Trace / System Anomaly"
            value={errorTrace}
            onChange={(e) => setErrorTrace(e.target.value)}
            multiline
            rows={3}
            size="small"
            sx={{ mb: 2, fontFamily: 'monospace' }}
          />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Typography variant="caption" sx={{ color: darkMode ? '#a1a1aa' : '#71717a', alignSelf: 'center', mr: 0.5 }}>
              Issue Presets:
            </Typography>
            {PRESET_ISSUES.map((preset) => (
              <Chip
                key={preset.label}
                label={preset.label}
                size="small"
                onClick={() => {
                  setErrorTrace(preset.trace);
                  setComponent(preset.component);
                  setSeverity(preset.severity);
                }}
                sx={{
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  bgcolor: darkMode ? '#27272a' : '#f4f4f5',
                  '&:hover': { bgcolor: darkMode ? '#3f3f46' : '#e4e4e7' },
                }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              type="submit"
              disabled={loading || !errorTrace.trim()}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Build />}
              sx={{
                bgcolor: '#dc2626',
                '&:hover': { bgcolor: '#b91c1c' },
                fontWeight: 700,
                textTransform: 'none',
                px: 3,
              }}
            >
              {loading ? 'Analyzing Root Cause...' : 'Diagnose & Generate Fix'}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};
