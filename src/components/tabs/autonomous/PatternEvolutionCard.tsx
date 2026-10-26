import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from '@mui/material';
import { School, TrendingUp } from '@mui/icons-material';

interface PatternEvolutionCardProps {
  darkMode: boolean;
}

const LEARNED_PATTERNS = [
  {
    id: 'PAT-DEFENSIVE-NULL-GUARD',
    name: 'Defensive Null Guard & Optional Unwrapping',
    domain: 'Software Engineering',
    successRate: 0.98,
    appliedCount: 42,
  },
  {
    id: 'PAT-VIRTUAL-THREAD-ISOLATION',
    name: 'Scoped Values & Virtual Thread ReentrantLock',
    domain: 'Concurrency & Performance',
    successRate: 0.96,
    appliedCount: 38,
  },
  {
    id: 'PAT-ZERO-MOCK-ASSERTION',
    name: 'In-Process Domain State Assertion',
    domain: 'Verification & QA',
    successRate: 1.0,
    appliedCount: 89,
  },
  {
    id: 'PAT-OWASP-SQL-PARAM',
    name: 'Prepared Statement & AST Sanitization',
    domain: 'Security & Zero-Trust',
    successRate: 0.99,
    appliedCount: 26,
  },
];

export const PatternEvolutionCard: React.FC<PatternEvolutionCardProps> = ({
  darkMode,
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
            <School sx={{ color: '#8b5cf6', fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
              Self-Learning Pattern Repository (Pillars 4-6)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TrendingUp sx={{ fontSize: 16, color: '#16a34a' }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#16a34a' }}>
              Weight Update: Success / (Success + Failure)
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 1.5,
          }}
        >
          {LEARNED_PATTERNS.map((pat) => (
            <Box
              key={pat.id}
              sx={{
                p: 1.5,
                borderRadius: 1.5,
                bgcolor: darkMode ? '#27272a' : '#f8fafc',
                border: 1,
                borderColor: darkMode ? '#3f3f46' : '#e2e8f0',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.82rem' }}>
                  {pat.name}
                </Typography>
                <Chip
                  label={pat.domain}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.65rem',
                    bgcolor: darkMode ? '#3f3f46' : '#e2e8f0',
                    fontWeight: 600,
                  }}
                />
              </Box>

              <Typography variant="caption" sx={{ color: darkMode ? '#a1a1aa' : '#64748b', fontSize: '0.7rem' }}>
                ID: {pat.id} • Applied {pat.appliedCount} times
              </Typography>

              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                  <Typography variant="caption" sx={{ fontSize: '0.68rem', color: darkMode ? '#a1a1aa' : '#64748b' }}>
                    Confidence Weight: {(pat.successRate * 100).toFixed(0)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={pat.successRate * 100}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: darkMode ? '#3f3f46' : '#cbd5e1',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#8b5cf6',
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
