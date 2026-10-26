import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
} from '@mui/material';
import { CheckCircle, ContentCopy, Verified } from '@mui/icons-material';
import { IssueResolutionResultDto } from '../../../types/coreBrain';

interface RootCauseDiagnosticCardProps {
  darkMode: boolean;
  result: IssueResolutionResultDto | null;
  onCopyDiff?: (diff: string) => void;
}

export const RootCauseDiagnosticCard: React.FC<RootCauseDiagnosticCardProps> = ({
  darkMode,
  result,
  onCopyDiff,
}) => {
  if (!result) return null;

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
            <Verified sx={{ color: '#16a34a', fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
              Autonomous Root-Cause Diagnosis & Fix
            </Typography>
            <Chip
              label={result.issueId}
              size="small"
              sx={{ bgcolor: darkMode ? '#27272a' : '#f4f4f5', fontWeight: 700, fontSize: '0.72rem' }}
            />
          </Box>
          <Chip
            icon={<CheckCircle sx={{ fontSize: '14px !important' }} />}
            label={result.autoHealed ? 'Auto-Healed' : 'Manual Intervention Required'}
            size="small"
            sx={{
              bgcolor: darkMode ? 'rgba(34,197,94,0.1)' : '#ecfdf5',
              color: '#16a34a',
              fontWeight: 700,
            }}
          />
        </Box>

        <Box sx={{ mb: 2, p: 1.5, borderRadius: 1.5, bgcolor: darkMode ? '#27272a' : '#f8fafc', border: 1, borderColor: darkMode ? '#3f3f46' : '#e2e8f0' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: darkMode ? '#f87171' : '#dc2626', mb: 0.5 }}>
            🔍 Identified Root Cause:
          </Typography>
          <Typography variant="body2" sx={{ color: darkMode ? '#e4e4e7' : '#334155' }}>
            {result.rootCause}
          </Typography>
        </Box>

        <Box sx={{ mb: 2, p: 1.5, borderRadius: 1.5, bgcolor: darkMode ? '#27272a' : '#f8fafc', border: 1, borderColor: darkMode ? '#3f3f46' : '#e2e8f0' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: darkMode ? '#60a5fa' : '#2563eb', mb: 0.5 }}>
            📋 Corrective Resolution Plan:
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: darkMode ? '#e4e4e7' : '#334155' }}>
            {result.resolutionPlan}
          </Typography>
        </Box>

        {result.patchDiff && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.82rem' }}>
                Automated Patch Unified Diff:
              </Typography>
              <Button
                size="small"
                startIcon={<ContentCopy sx={{ fontSize: '13px !important' }} />}
                onClick={() => onCopyDiff?.(result.patchDiff)}
                sx={{ textTransform: 'none', fontSize: '0.72rem' }}
              >
                Copy Diff
              </Button>
            </Box>
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 1.5,
                borderRadius: 1.5,
                bgcolor: darkMode ? '#09090b' : '#1e293b',
                color: '#38bdf8',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                overflowX: 'auto',
              }}
            >
              {result.patchDiff}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
