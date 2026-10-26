import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import {
  IssueDetectorCard,
  RootCauseDiagnosticCard,
  SelfHealingLoopCard,
  PatternEvolutionCard,
} from './autonomous';
import {
  IssueResolutionResultDto,
  SelfHealingStatusDto,
} from '../../types/coreBrain';
import {
  detectAndResolveV2,
  triggerSelfHealingV2,
  getAutonomousTelemetry,
  AutonomousTelemetry,
} from '../../services/autonomousIssueHandlingService';

interface AutonomousSelfHealingTabProps {
  darkMode: boolean;
  token?: string | null;
  notify: (msg: string) => void;
  onCopyDiff?: (diff: string) => void;
}

export const AutonomousSelfHealingTab: React.FC<AutonomousSelfHealingTabProps> = ({
  darkMode,
  token,
  notify,
  onCopyDiff,
}) => {
  const [telemetry, setTelemetry] = useState<AutonomousTelemetry | null>(null);
  const [resolutionResult, setResolutionResult] = useState<IssueResolutionResultDto | null>(null);
  const [healingStatus, setHealingStatus] = useState<SelfHealingStatusDto | null>(null);
  const [loadingDetect, setLoadingDetect] = useState<boolean>(false);
  const [loadingHealing, setLoadingHealing] = useState<boolean>(false);

  const loadTelemetry = useCallback(async () => {
    try {
      const data = await getAutonomousTelemetry(token);
      setTelemetry(data);
    } catch {
      notify('Failed to load autonomous telemetry');
    }
  }, [token, notify]);

  useEffect(() => {
    loadTelemetry();
  }, [loadTelemetry]);

  const handleDetectAndResolve = async (errorTrace: string, component: string, severity: string) => {
    setLoadingDetect(true);
    notify(`Analyzing anomaly in ${component} across 10 autonomous pillars...`);
    try {
      const res = await detectAndResolveV2(errorTrace, component, 'DEVELOPMENT', severity, token);
      setResolutionResult(res);
      notify(`Issue ${res.issueId} diagnosed and auto-healed!`);
      loadTelemetry();
    } catch {
      notify('Autonomous issue resolution failed');
    } finally {
      setLoadingDetect(false);
    }
  };

  const handleTriggerSelfHealing = async (failureType: string) => {
    setLoadingHealing(true);
    const cycleId = `CYCLE-${Date.now().toString(36).toUpperCase()}`;
    notify(`Triggering autonomous self-healing cycle: ${cycleId}...`);
    try {
      const res = await triggerSelfHealingV2(cycleId, failureType, 'CorePool', token);
      setHealingStatus(res);
      notify(`Self-healing completed: System restored!`);
      loadTelemetry();
    } catch {
      notify('Self-healing cycle execution failed');
    } finally {
      setLoadingHealing(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 1.5, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.025em' }}>
          🛡️ Autonomous Issue Handling & Self-Healing Cockpit
        </Typography>
        <Typography variant="body2" sx={{ color: darkMode ? '#a1a1aa' : '#71717a' }}>
          Autonomous 10-Pillar cognitive monitoring, root-cause diagnosis, 1-click self-healing circuit breakers, and dynamic pattern weight learning.
        </Typography>
      </Box>

      {/* Detection & Diagnosis */}
      <IssueDetectorCard
        darkMode={darkMode}
        loading={loadingDetect}
        onDetectAndResolve={handleDetectAndResolve}
      />

      {/* Diagnosis & Fix Result */}
      {resolutionResult && (
        <RootCauseDiagnosticCard
          darkMode={darkMode}
          result={resolutionResult}
          onCopyDiff={onCopyDiff}
        />
      )}

      {/* Self-Healing Loop */}
      <SelfHealingLoopCard
        darkMode={darkMode}
        telemetry={telemetry}
        healingStatus={healingStatus}
        loading={loadingHealing}
        onTriggerSelfHealing={handleTriggerSelfHealing}
      />

      {/* Pattern Evolution */}
      <PatternEvolutionCard
        darkMode={darkMode}
      />
    </Box>
  );
};
