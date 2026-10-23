import React from 'react';
import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { AgentThreadExecutionRecord, EnterpriseAgentType } from '../../../types/agentEcosystem';

export const AGENT_COLORS: Record<EnterpriseAgentType, string> = {
  ARCHITECT: '#38bdf8',
  SOFTWARE_ENGINEER: '#4ade80',
  SECURITY: '#f43f5e',
  QA: '#facc15',
  DEVOPS: '#a855f7',
  DATA_ENGINEER: '#fb923c',
  RESEARCH: '#06b6d4',
  PRODUCT_MANAGER: '#3b82f6',
  FINANCE: '#10b981',
  CUSTOMER_SUPPORT: '#64748b',
  MARKETING: '#ec4899',
  LEGAL_ASSISTANT: '#6366f1',
};

interface SwarmThreadCardProps {
  darkMode: boolean;
  thread: AgentThreadExecutionRecord;
}

export const SwarmThreadCard: React.FC<SwarmThreadCardProps> = ({
  darkMode,
  thread: t,
}) => {
  const color = AGENT_COLORS[t.agentType] || '#38bdf8';

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        bgcolor: darkMode ? '#090d16' : '#ffffff',
        borderColor: darkMode ? '#1e293b' : '#e2e8f0',
        borderRadius: 2,
        borderLeft: `4px solid ${color}`,
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={t.agentType.replace('_', ' ')}
              size="small"
              sx={{
                bgcolor: `${color}20`,
                color: color,
                fontWeight: 700,
                fontSize: '0.7rem',
                border: `1px solid ${color}`,
              }}
            />
            {t.stageName && (
              <Chip
                label={t.stageName}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.66rem', height: 20, color: 'text.secondary' }}
              />
            )}
            <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
              {t.threadName}
            </Typography>
          </Box>
          <Chip
            icon={<CheckCircleIcon sx={{ fontSize: '0.85rem !important' }} />}
            label={`${t.executionDurationMs}ms`}
            size="small"
            color="success"
            variant="outlined"
            sx={{ height: 22, fontSize: '0.68rem', fontWeight: 600 }}
          />
        </Box>

        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          {t.taskDescription}
        </Typography>

        <Box
          sx={{
            p: 1.2,
            borderRadius: 1,
            bgcolor: darkMode ? '#0f172a' : '#f8fafc',
            fontFamily: 'Consolas, monospace',
            fontSize: '0.76rem',
            color: darkMode ? '#cbd5e1' : '#334155',
            border: '1px solid',
            borderColor: darkMode ? '#1e293b' : '#e2e8f0',
          }}
        >
          {t.outputResult}
        </Box>

        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Memory Allocated: {t.memoryAllocatedKb} KB
          </Typography>
          <Typography variant="caption" sx={{ color: '#4ade80', fontWeight: 600 }}>
            State: {t.state}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
