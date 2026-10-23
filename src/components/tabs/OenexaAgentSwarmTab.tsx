import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  TextField,
  Button,
  Chip,
  LinearProgress,
  ButtonGroup,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PsychologyIcon from '@mui/icons-material/Psychology';
import BoltIcon from '@mui/icons-material/Bolt';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import {
  ConcurrentAgentSwarmResult,
  SwarmExecutionStrategy,
} from '../../types/agentEcosystem';
import { executeConcurrentSwarm } from '../../services/agentThreadOrchestratorService';
import {
  SwarmTelemetryBanner,
  SwarmThreadCard,
  SwarmArtifactsStrip,
} from './swarm';

export interface OenexaAgentSwarmTabProps {
  darkMode: boolean;
  token?: string | null;
  notify?: (msg: string) => void;
}

const TEMPLATE_GOALS = [
  'Enterprise E-Commerce Microservices with CQRS',
  'Full SAST Security Audit & Zero-Mock Test Verification',
  'Distributed Event-Driven Ledger with PostgreSQL & pgvector',
  'High-Performance Real-Time AI Inference Pipeline',
];

export const OenexaAgentSwarmTab: React.FC<OenexaAgentSwarmTabProps> = ({
  darkMode,
  token,
  notify,
}) => {
  const [goal, setGoal] = useState('Enterprise E-Commerce Microservices with CQRS');
  const [strategy, setStrategy] = useState<SwarmExecutionStrategy>('PARALLEL_MAX_SPEED');
  const [loading, setLoading] = useState(false);
  const [swarmResult, setSwarmResult] = useState<ConcurrentAgentSwarmResult | null>(null);

  const handleLaunchSwarm = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    try {
      const result = await executeConcurrentSwarm({ goalTitle: goal, strategy }, token);
      setSwarmResult(result);
      if (notify) {
        notify(`Concurrent swarm completed: ${result.activeThreadCount} virtual threads converged in ${result.wallClockDurationMs}ms (${result.speedupFactor}x speedup)`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyArtifacts = () => {
    if (!swarmResult) return;
    navigator.clipboard.writeText(swarmResult.consolidatedArtifacts.join('\n'));
    if (notify) notify('Consolidated artifact list copied to clipboard');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Sleek OENEXA Minimalist Cockpit Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
          <PsychologyIcon sx={{ color: '#38bdf8', fontSize: 30 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
            OENEXA Multi-Agent Swarm
          </Typography>
          <Chip
            icon={<BoltIcon sx={{ fontSize: '1rem !important' }} />}
            label="Java 25 Virtual Threads"
            size="small"
            sx={{
              bgcolor: darkMode ? '#0f172a' : '#e0f2fe',
              color: '#0284c7',
              fontWeight: 700,
              fontSize: '0.72rem',
              border: '1px solid #38bdf8',
            }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          High-throughput concurrent agent orchestrator executing multi-agent pipelines with zero OS thread starvation.
        </Typography>
      </Box>

      {/* Floating Goal Input Bar & Strategy Bar */}
      <Card
        variant="outlined"
        sx={{
          mb: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: darkMode ? '#090d16' : '#ffffff',
          borderColor: darkMode ? '#1e293b' : '#e2e8f0',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            fullWidth
            size="small"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Describe your system goal or architecture directive..."
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: darkMode ? '#0f172a' : '#f8fafc',
                borderRadius: 1.5,
              },
            }}
          />
          <Button
            variant="contained"
            disabled={loading || !goal.trim()}
            onClick={handleLaunchSwarm}
            startIcon={<PlayArrowIcon />}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              px: 3,
              borderRadius: 1.5,
              bgcolor: '#0284c7',
              '&:hover': { bgcolor: '#0369a1' },
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? 'Dispatching...' : 'Dispatch Swarm'}
          </Button>
        </Box>

        {/* Strategy Switcher & Quick Goal Presets */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Presets:
            </Typography>
            {TEMPLATE_GOALS.map((tpl, i) => (
              <Chip
                key={i}
                label={tpl}
                size="small"
                onClick={() => setGoal(tpl)}
                sx={{
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  bgcolor: darkMode ? '#0f172a' : '#f1f5f9',
                  '&:hover': { bgcolor: darkMode ? '#1e293b' : '#e2e8f0' },
                }}
              />
            ))}
          </Box>

          <ButtonGroup size="small" variant="outlined" sx={{ mt: { xs: 1, md: 0 } }}>
            <Button
              onClick={() => setStrategy('PARALLEL_MAX_SPEED')}
              variant={strategy === 'PARALLEL_MAX_SPEED' ? 'contained' : 'outlined'}
              startIcon={<BoltIcon fontSize="small" />}
              sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 700 }}
            >
              Parallel Max Speed
            </Button>
            <Button
              onClick={() => setStrategy('PHASED_PIPELINE')}
              variant={strategy === 'PHASED_PIPELINE' ? 'contained' : 'outlined'}
              startIcon={<AccountTreeIcon fontSize="small" />}
              sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 700 }}
            >
              Phased Pipeline
            </Button>
          </ButtonGroup>
        </Box>
      </Card>

      {loading && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress color="primary" sx={{ borderRadius: 1 }} />
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: '#38bdf8' }}>
            ⚡ Java 25 Virtual Threads executing multi-agent tasks concurrently in parallel ({strategy})...
          </Typography>
        </Box>
      )}

      {/* Structured Concurrency Telemetry Banner */}
      {swarmResult && (
        <SwarmTelemetryBanner
          darkMode={darkMode}
          swarmResult={swarmResult}
        />
      )}

      {/* Concurrent Virtual Thread Cards Grid */}
      {swarmResult && (
        <Grid container spacing={2}>
          {swarmResult.threadRecords.map((t) => (
            <Grid item xs={12} md={6} key={t.threadId}>
              <SwarmThreadCard
                darkMode={darkMode}
                thread={t}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Consolidated Artifacts Strip */}
      {swarmResult && (
        <SwarmArtifactsStrip
          darkMode={darkMode}
          artifacts={swarmResult.consolidatedArtifacts}
          onCopy={handleCopyArtifacts}
        />
      )}
    </Box>
  );
};
