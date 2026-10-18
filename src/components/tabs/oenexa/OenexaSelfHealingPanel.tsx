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
import { OenexaSelfHealingCycle } from '../../../types';

export interface OenexaSelfHealingPanelProps {
  darkMode: boolean;
  cycles: OenexaSelfHealingCycle[];
  manualIssueInput: string;
  setManualIssueInput: (val: string) => void;
  manualCauseInput: string;
  setManualCauseInput: (val: string) => void;
  onTriggerManualHeal: () => void;
  onApplyPatchToEditor: (patchDiff: string) => void;
}

export const OenexaSelfHealingPanel: React.FC<OenexaSelfHealingPanelProps> = ({
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
                  Cycle #{idx + 1}: {cycle.resolved ? 'Resolved ✅' : 'In Progress ⏳'}
                </Typography>
                <Chip
                  label={cycle.resolved ? 'RESOLVED' : 'IN_PROGRESS'}
                  size="small"
                  color={cycle.resolved ? 'success' : 'warning'}
                />
              </Box>

              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 600 }}>
                Issue Detected:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {cycle.issueDetected}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 600 }}>
                Root Cause:
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                {cycle.rootCause}
              </Typography>

              {cycle.patchDiff && (
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: darkMode ? '#020617' : '#f1f5f9',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    whiteSpace: 'pre-wrap',
                    overflowX: 'auto',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  {cycle.patchDiff}
                </Box>
              )}

              {cycle.patchDiff && (
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    size="small"
                    variant="text"
                    color="primary"
                    onClick={() => onApplyPatchToEditor(cycle.patchDiff)}
                  >
                    Apply Patch in Monaco Editor
                  </Button>
                </Box>
              )}
            </Paper>
          ))}

          {cycles.length === 0 && (
            <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              No compilation issues or regressions detected. System invariants verified 100%.
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Manual Trigger Section */}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          🔧 Trigger Manual Self-Healing Cycle
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <TextField
            size="small"
            label="Issue Description / Test Failure"
            placeholder="e.g. AssertionFailedError in AuthServiceTest: expected 200 got 500"
            value={manualIssueInput}
            onChange={(e) => setManualIssueInput(e.target.value)}
            fullWidth
          />
          <TextField
            size="small"
            label="Hypothesized Root Cause"
            placeholder="e.g. Missing defensive non-null check in token extraction"
            value={manualCauseInput}
            onChange={(e) => setManualCauseInput(e.target.value)}
            fullWidth
          />
          <Button
            variant="outlined"
            color="success"
            onClick={onTriggerManualHeal}
            disabled={!manualIssueInput.trim()}
          >
            Run Reflection Diagnostic & Synthesize Patch
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
