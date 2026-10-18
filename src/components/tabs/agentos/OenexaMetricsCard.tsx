import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { OenexaAgentOsMetrics } from '../../../types';

export interface OenexaMetricsCardProps {
  darkMode: boolean;
  metrics: OenexaAgentOsMetrics;
}

export const OenexaMetricsCard: React.FC<OenexaMetricsCardProps> = ({
  darkMode,
  metrics,
}) => {
  return (
    <Card elevation={2} sx={{ bgcolor: darkMode ? '#1e293b' : '#ffffff', borderRadius: 2 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
          📊 Execution Telemetry
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Execution Duration:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{metrics.totalDurationMs} ms</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Tokens Synthesized:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{metrics.tokensGenerated} tokens</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Throughput:</Typography>
            <Chip label={`${metrics.tokensPerSecond} tokens/sec`} color="info" size="small" />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Privacy Mode:</Typography>
            <Chip
              label={metrics.airGappedVerified ? 'Air-Gapped: 0 Leakage' : 'Hybrid Cloud'}
              color={metrics.airGappedVerified ? 'success' : 'warning'}
              size="small"
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Testing Policy:</Typography>
            <Chip label="Strictly Zero-Mock" color="success" size="small" variant="outlined" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OenexaMetricsCard;
