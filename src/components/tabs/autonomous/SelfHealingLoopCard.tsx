import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Autorenew, CheckCircle, WarningAmber } from '@mui/icons-material';
import { SelfHealingStatusDto } from '../../../types/coreBrain';
import { AutonomousTelemetry } from '../../../services/autonomousIssueHandlingService';

interface SelfHealingLoopCardProps {
  darkMode: boolean;
  telemetry: AutonomousTelemetry | null;
  healingStatus: SelfHealingStatusDto | null;
  loading: boolean;
  onTriggerSelfHealing: (failureType: string) => void;
}

export const SelfHealingLoopCard: React.FC<SelfHealingLoopCardProps> = ({
  darkMode,
  telemetry,
  healingStatus,
  loading,
  onTriggerSelfHealing,
}) => {
  const [selectedFailure, setSelectedFailure] = useState<string>('DEADLOCK_RECOVERY');

  const failureTypes = [
    { id: 'DEADLOCK_RECOVERY', label: 'Deadlock Recovery' },
    { id: 'OOM_HEAP_TRIM', label: 'Heap Memory Trim' },
    { id: 'RPC_TIMEOUT_CIRCUIT_BREAK', label: 'Circuit Breaker Reset' },
    { id: 'SECURITY_THREAT_ISOLATION', label: 'Security Quarantine' },
  ];

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
            <Autorenew sx={{ color: '#0ea5e9', fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
              Autonomous Self-Healing Loop & Circuit Recovery
            </Typography>
          </Box>
          {telemetry && (
            <Chip
              label={`Telemetry: ${telemetry.status}`}
              size="small"
              sx={{ bgcolor: darkMode ? 'rgba(14,165,233,0.1)' : '#f0f9ff', color: '#0284c7', fontWeight: 700 }}
            />
          )}
        </Box>

        {/* Telemetry Stats */}
        {telemetry && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' },
              gap: 1.5,
              mb: 2.5,
            }}
          >
            <Box sx={{ p: 1.2, borderRadius: 1.5, bgcolor: darkMode ? '#27272a' : '#f4f4f5' }}>
              <Typography variant="caption" sx={{ color: darkMode ? '#a1a1aa' : '#71717a' }}>Issues Processed</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{telemetry.processedCount}</Typography>
            </Box>
            <Box sx={{ p: 1.2, borderRadius: 1.5, bgcolor: darkMode ? '#27272a' : '#f4f4f5' }}>
              <Typography variant="caption" sx={{ color: darkMode ? '#a1a1aa' : '#71717a' }}>Errors Prevented</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#16a34a' }}>{telemetry.repeatedErrorsPrevented}</Typography>
            </Box>
            <Box sx={{ p: 1.2, borderRadius: 1.5, bgcolor: darkMode ? '#27272a' : '#f4f4f5' }}>
              <Typography variant="caption" sx={{ color: darkMode ? '#a1a1aa' : '#71717a' }}>Avg Healing Latency</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{telemetry.averageLatencyMs.toFixed(1)}ms</Typography>
            </Box>
            <Box sx={{ p: 1.2, borderRadius: 1.5, bgcolor: darkMode ? '#27272a' : '#f4f4f5' }}>
              <Typography variant="caption" sx={{ color: darkMode ? '#a1a1aa' : '#71717a' }}>Learned Patterns</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{telemetry.registeredPatternsCount}</Typography>
            </Box>
          </Box>
        )}

        {/* 1-Click Action */}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, fontSize: '0.82rem' }}>
          Trigger On-Demand Self-Healing Cycle:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {failureTypes.map((type) => (
            <Chip
              key={type.id}
              label={type.label}
              onClick={() => setSelectedFailure(type.id)}
              color={selectedFailure === type.id ? 'primary' : 'default'}
              variant={selectedFailure === type.id ? 'filled' : 'outlined'}
              sx={{ cursor: 'pointer', fontWeight: 600 }}
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {healingStatus && (
              <Chip
                icon={healingStatus.restored ? <CheckCircle sx={{ fontSize: '14px !important' }} /> : <WarningAmber sx={{ fontSize: '14px !important' }} />}
                label={`Cycle ${healingStatus.cycleId}: ${healingStatus.status} (Attempts: ${healingStatus.attemptCount})`}
                size="small"
                sx={{
                  bgcolor: healingStatus.restored ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  color: healingStatus.restored ? '#16a34a' : '#dc2626',
                  fontWeight: 700,
                }}
              />
            )}
          </Box>
          <Button
            variant="contained"
            disabled={loading}
            onClick={() => onTriggerSelfHealing(selectedFailure)}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Autorenew />}
            sx={{
              bgcolor: '#0284c7',
              '&:hover': { bgcolor: '#0369a1' },
              fontWeight: 700,
              textTransform: 'none',
              px: 3,
            }}
          >
            {loading ? 'Healing System...' : 'Trigger Self-Healing'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
