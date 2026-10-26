import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
} from '@mui/material';
import { CheckCircle, Speed, Hub } from '@mui/icons-material';
import { CoreModuleInfo } from '../../../types/coreBrain';

interface CoreModulesStatusGridProps {
  darkMode: boolean;
  modules: CoreModuleInfo[];
}

export const CoreModulesStatusGrid: React.FC<CoreModulesStatusGridProps> = ({
  darkMode,
  modules,
}) => {
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
            <Hub sx={{ color: darkMode ? '#38bdf8' : '#0284c7', fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
              12 Core Engines Health & Throughput Matrix
            </Typography>
          </Box>
          <Chip
            label={`${modules.length}/12 Engines Active`}
            size="small"
            sx={{
              bgcolor: darkMode ? 'rgba(34,197,94,0.1)' : '#ecfdf5',
              color: '#16a34a',
              fontWeight: 700,
              fontSize: '0.72rem',
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: 'repeat(4, 1fr)' },
            gap: 1.5,
          }}
        >
          {modules.map((mod) => (
            <Box
              key={mod.type}
              sx={{
                p: 1.5,
                borderRadius: 1.5,
                bgcolor: darkMode ? '#27272a' : '#f8fafc',
                border: 1,
                borderColor: darkMode ? '#3f3f46' : '#e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.8,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.82rem' }}>
                  {mod.displayName}
                </Typography>
                <Chip
                  icon={<CheckCircle sx={{ fontSize: '12px !important' }} />}
                  label={mod.status}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.65rem',
                    bgcolor: darkMode ? 'rgba(34,197,94,0.15)' : '#dcfce7',
                    color: '#15803d',
                    fontWeight: 700,
                  }}
                />
              </Box>

              <Typography
                variant="caption"
                sx={{
                  color: darkMode ? '#a1a1aa' : '#64748b',
                  fontSize: '0.7rem',
                  lineHeight: 1.3,
                  minHeight: 36,
                }}
              >
                {mod.mission}
              </Typography>

              <Box sx={{ mt: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontSize: '0.68rem', color: darkMode ? '#a1a1aa' : '#64748b' }}>
                    Health Score: {(mod.healthScore * 100).toFixed(0)}%
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                    <Speed sx={{ fontSize: 12, color: darkMode ? '#38bdf8' : '#0284c7' }} />
                    <Typography variant="caption" sx={{ fontSize: '0.68rem', fontWeight: 600 }}>
                      {mod.processedRequests.toLocaleString()} reqs
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={mod.healthScore * 100}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: darkMode ? '#3f3f46' : '#cbd5e1',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: mod.healthScore > 0.9 ? '#10b981' : '#f59e0b',
                    },
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
