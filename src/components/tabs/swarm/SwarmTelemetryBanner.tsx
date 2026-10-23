import React from 'react';
import { Card, Grid, Box, Typography, Chip } from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import SpeedIcon from '@mui/icons-material/Speed';
import BoltIcon from '@mui/icons-material/Bolt';
import { ConcurrentAgentSwarmResult } from '../../../types/agentEcosystem';

interface SwarmTelemetryBannerProps {
  darkMode: boolean;
  swarmResult: ConcurrentAgentSwarmResult;
}

export const SwarmTelemetryBanner: React.FC<SwarmTelemetryBannerProps> = ({
  darkMode,
  swarmResult,
}) => {
  return (
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
  );
};
