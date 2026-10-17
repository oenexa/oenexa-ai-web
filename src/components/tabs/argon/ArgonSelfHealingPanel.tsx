import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Paper,
  Divider,
  TextField,
  Button,
} from '@mui/material';
import { ArgonSelfHealingCycle } from '../../../types';

export interface ArgonSelfHealingPanelProps {
  darkMode: boolean;
  cycles: ArgonSelfHealingCycle[];
  manualIssueInput: string;
  setManualIssueInput: (val: string) => void;
  manualCauseInput: string;
  setManualCauseInput: (val: string) => void;
  onTriggerManualHeal: () => void;
  onApplyPatchToEditor: (patchDiff: string) => void;
}

export const ArgonSelfHealingPanel: React.FC<ArgonSelfHealingPanelProps> = ({
  darkMode,
  cycles,
  manualIssueInput,
  setManualIssueInput,
  manualCauseInput,
  setManualCauseInput,
  onTriggerManualHeal,
  onApplyPatchToEditor,
}) => {
  return (
    <Card elevation={2} sx={{ bgcolor: darkMode ? '#1e293b' : '#ffffff', borderRadius: 2 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            🛡️ Self-Healing Reflection Loop
          </Typography>
          <Chip label={`${cycles.length} Cycles`} size="small" color="success" />
        </Box>

        {/* Healing Cycles List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {cycles.map((cycle, idx) => (
            <Paper
              key={cycle.cycleId || idx}
              variant="outlined"
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: darkMode ? '#0f172a' : '#f8fafc',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'success.main' }}>
                  Cycle #{idx + 1}: Resolved ✅
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {cycle.timestamp}
                </Typography>
              </Box>

              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 600 }}>
                Issue Detected:
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: 'error.main', fontSize: '0.8rem' }}>
                {cycle.issueDetected}
              </Typography>

              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 600 }}>
                Root Cause Analysis:
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, fontSize: '0.8rem' }}>
                {cycle.rootCause}
              </Typography>

              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 600 }}>
                Unified Git Patch Diff:
              </Typography>
              <Box
                sx={{
                  p: 1,
                  bgcolor: '#090d16',
                  color: '#4ade80',
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  whiteSpace: 'pre-wrap',
                  overflowX: 'auto',
                  mb: 1,
                }}
              >
                {cycle.patchDiff}
              </Box>

              <Button
                size="small"
                variant="outlined"
                color="success"
                fullWidth
                onClick={() => onApplyPatchToEditor(cycle.patchDiff)}
              >
                Apply Patch to Editor
              </Button>
            </Paper>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Manual Trigger Form */}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          Simulate / Trigger Self-Healing Reflection:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <TextField
            label="Issue / Error Detected"
            placeholder="e.g. NullPointerException at line 42"
            value={manualIssueInput}
            onChange={(e) => setManualIssueInput(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Root Cause (Optional)"
            placeholder="e.g. Unchecked optional dereference"
            value={manualCauseInput}
            onChange={(e) => setManualCauseInput(e.target.value)}
            size="small"
            fullWidth
          />
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={onTriggerManualHeal}
            disabled={!manualIssueInput.trim()}
          >
            Trigger Self-Healing Patch
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
