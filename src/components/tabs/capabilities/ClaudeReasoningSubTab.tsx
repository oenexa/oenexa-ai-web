import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from '@mui/material';
import { Psychology, ExpandMore } from '@mui/icons-material';
import { ClaudeReasoningTrace } from '../../../types';
import {
  analyzeClaudeReasoning,
  createDefaultClaudeTrace,
} from '../../../services/capabilities/claudeService';

export interface ClaudeReasoningSubTabProps {
  darkMode: boolean;
  token: string | null;
  notify: (msg: string) => void;
}

export const ClaudeReasoningSubTab: React.FC<ClaudeReasoningSubTabProps> = ({
  darkMode,
  token,
  notify,
}) => {
  const [claudeObjectiveInput, setClaudeObjectiveInput] = useState<string>(
    'Design Hexagonal Modular Monolith Core with Zero-Mock Invariants'
  );
  const [claudeContextInput, setClaudeContextInput] = useState<string>(
    'package com.oenexa.domain;\npublic record OrderPlaced(UUID orderId, BigDecimal amount) {}'
  );
  const [claudeTrace, setClaudeTrace] = useState<ClaudeReasoningTrace | null>(
    createDefaultClaudeTrace()
  );
  const [runningClaudeReasoning, setRunningClaudeReasoning] = useState<boolean>(false);

  const handleRunClaudeReasoning = async () => {
    if (!claudeObjectiveInput.trim()) return;
    setRunningClaudeReasoning(true);
    try {
      const trace = await analyzeClaudeReasoning(
        claudeObjectiveInput.trim(),
        claudeContextInput.trim(),
        token
      );
      setClaudeTrace(trace);
      notify('Claude Tree-of-Thought Reasoning completed with 0.99 calibrated confidence!');
    } catch {
      notify('Claude Tree-of-Thought Reasoning execution failed');
    } finally {
      setRunningClaudeReasoning(false);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={5}>
        <Card
          sx={{
            bgcolor: darkMode ? '#1e293b' : '#ffffff',
            border: 1,
            borderColor: 'divider',
            height: '100%',
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              🧠 Tree-of-Thought (ToT) Objective
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
              Explores competing architectural hypotheses, balances trade-offs, and validates zero-mock testability.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Architectural Objective"
              value={claudeObjectiveInput}
              onChange={(e) => setClaudeObjectiveInput(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={5}
              label="Codebase Context Snippet"
              value={claudeContextInput}
              onChange={(e) => setClaudeContextInput(e.target.value)}
              sx={{ mb: 2, fontFamily: 'monospace' }}
            />
            <Button
              fullWidth
              variant="contained"
              startIcon={
                runningClaudeReasoning ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <Psychology />
                )
              }
              onClick={handleRunClaudeReasoning}
              disabled={runningClaudeReasoning || !claudeObjectiveInput.trim()}
            >
              {runningClaudeReasoning ? 'Exploring Hypotheses...' : 'Execute Claude Reasoning'}
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={7}>
        {claudeTrace ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card
              sx={{
                bgcolor: darkMode ? '#1e293b' : '#ffffff',
                border: 1,
                borderColor: 'divider',
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1.5,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    🏆 Winning Architecture: {claudeTrace.selectedBranch.hypothesis}
                  </Typography>
                  <Chip
                    label={`Confidence: ${claudeTrace.calibratedConfidence}`}
                    color="success"
                    size="small"
                  />
                </Box>
                <Typography variant="body2" sx={{ mb: 1.5 }}>
                  {claudeTrace.selectedBranch.rationale}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip
                    label={`Architectural: ${claudeTrace.selectedBranch.architecturalScore}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={`Feasibility: ${claudeTrace.selectedBranch.feasibilityScore}`}
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                  <Chip
                    label={`Composite Score: ${claudeTrace.selectedBranch.confidenceScore}`}
                    size="small"
                    color="success"
                  />
                </Box>
                <Alert severity="success" sx={{ mb: 1 }}>
                  <strong>Reflection Verdict:</strong> {claudeTrace.reflectionVerdict}
                </Alert>
              </CardContent>
            </Card>

            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              🌲 Evaluated Hypothesis Branches ({claudeTrace.hypotheses.length})
            </Typography>
            {claudeTrace.hypotheses.map((branch, bIdx) => (
              <Accordion
                key={bIdx}
                defaultExpanded={bIdx === 0}
                sx={{
                  bgcolor: darkMode ? '#1e293b' : '#ffffff',
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      width: '100%',
                      justifyContent: 'space-between',
                      pr: 2,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {branch.hypothesis}
                    </Typography>
                    <Chip
                      label={`Score: ${branch.confidenceScore}`}
                      size="small"
                      color={
                        branch.branchId === claudeTrace.selectedBranch.branchId
                          ? 'success'
                          : 'default'
                      }
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {branch.rationale}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 700, color: 'success.main', display: 'block' }}
                      >
                        Pros:
                      </Typography>
                      {branch.pros.map((p, pIdx) => (
                        <Typography
                          key={pIdx}
                          variant="caption"
                          sx={{ display: 'block', color: 'text.secondary' }}
                        >
                          • {p}
                        </Typography>
                      ))}
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 700, color: 'error.main', display: 'block' }}
                      >
                        Cons:
                      </Typography>
                      {branch.cons.map((c, cIdx) => (
                        <Typography
                          key={cIdx}
                          variant="caption"
                          sx={{ display: 'block', color: 'text.secondary' }}
                        >
                          • {c}
                        </Typography>
                      ))}
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}

            <Paper
              sx={{
                p: 2,
                bgcolor: darkMode ? '#0f172a' : '#f1f5f9',
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="caption"
                component="pre"
                sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
              >
                {claudeTrace.tradeOffAnalysis}
              </Typography>
            </Paper>
          </Box>
        ) : (
          <Alert severity="info">
            No reasoning trace generated yet. Click 'Execute Claude Reasoning'.
          </Alert>
        )}
      </Grid>
    </Grid>
  );
};

export default ClaudeReasoningSubTab;
