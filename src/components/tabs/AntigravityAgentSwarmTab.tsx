import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PsychologyIcon from '@mui/icons-material/Psychology';
import BoltIcon from '@mui/icons-material/Bolt';
import MemoryIcon from '@mui/icons-material/Memory';
import SpeedIcon from '@mui/icons-material/Speed';
import {
  ConcurrentAgentSwarmResult,
  EnterpriseAgentType,
} from '../../types/agentEcosystem';
import { executeConcurrentSwarm } from '../../services/agentThreadOrchestratorService';

export interface AntigravityAgentSwarmTabProps {
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

const AGENT_COLORS: Record<EnterpriseAgentType, string> = {
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

export const AntigravityAgentSwarmTab: React.FC<AntigravityAgentSwarmTabProps> = ({
  darkMode,
  token,
  notify,
}) => {
  const [goal, setGoal] = useState('Enterprise E-Commerce Microservices with CQRS');
  const [loading, setLoading] = useState(false);
  const [swarmResult, setSwarmResult] = useState<ConcurrentAgentSwarmResult | null>(null);

  const handleLaunchSwarm = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    try {
      const result = await executeConcurrentSwarm({ goalTitle: goal }, token);
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
    const text = swarmResult.consolidatedArtifacts.join('\n');
    navigator.clipboard.writeText(text);
    if (notify) notify('Consolidated artifact list copied to clipboard');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Sleek Antigravity Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <PsychologyIcon sx={{ color: '#38bdf8', fontSize: 30 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
            Antigravity Multi-Agent Swarm
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
          Dispatches autonomous specialized agents concurrently across sub-tasks using structured virtual thread logic.
        </Typography>
      </Box>

      {/* Floating Goal Input Bar */}
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
        <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
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
            }}
          >
            {loading ? 'Dispatching...' : 'Dispatch Swarm'}
          </Button>
        </Box>

        {/* Quick Goal Templates */}
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
      </Card>

      {loading && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress color="primary" sx={{ borderRadius: 1 }} />
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: '#38bdf8' }}>
            ⚡ Java 25 Virtual Threads executing multi-agent tasks concurrently in parallel...
          </Typography>
        </Box>
      )}

      {/* Structured Concurrency Telemetry Banner */}
      {swarmResult && (
        <Card
          variant="outlined"
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: darkMode ? '#0c1322' : '#f0fdf4',
            borderColor: darkMode ? '#1e293b' : '#bbf7d0',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MemoryIcon sx={{ color: '#38bdf8' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Active Threads</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {swarmResult.activeThreadCount} Virtual Threads
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SpeedIcon sx={{ color: '#4ade80' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Wall-Clock Duration</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#4ade80' }}>
                    {swarmResult.wallClockDurationMs} ms
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BoltIcon sx={{ color: '#facc15' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Sequential Equivalent</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#94a3b8' }}>
                    {swarmResult.sequentialDurationMs} ms
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Chip
                label={`⚡ ${swarmResult.speedupFactor}x Speedup`}
                sx={{
                  bgcolor: '#047857',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  py: 1,
                  width: '100%',
                }}
              />
            </Grid>
          </Grid>
        </Card>
      )}

      {/* Concurrent Virtual Thread Cards Grid */}
      {swarmResult && (
        <Grid container spacing={2}>
          {swarmResult.threadRecords.map((t) => {
            const color = AGENT_COLORS[t.agentType] || '#38bdf8';
            return (
              <Grid item xs={12} md={6} key={t.threadId}>
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Consolidated Artifacts Strip */}
      {swarmResult && swarmResult.consolidatedArtifacts.length > 0 && (
        <Card
          variant="outlined"
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: darkMode ? '#090d16' : '#ffffff',
            borderColor: darkMode ? '#1e293b' : '#e2e8f0',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Consolidated Artifacts Synthesized Across Threads ({swarmResult.consolidatedArtifacts.length})
            </Typography>
            <Tooltip title="Copy all artifact names">
              <IconButton size="small" onClick={handleCopyArtifacts}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {swarmResult.consolidatedArtifacts.map((art, idx) => (
              <Chip
                key={idx}
                label={art}
                size="small"
                variant="outlined"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  borderColor: darkMode ? '#334155' : '#cbd5e1',
                }}
              />
            ))}
          </Box>
        </Card>
      )}
    </Box>
  );
};
