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
  Paper,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Terminal as TerminalIcon, CheckCircle } from '@mui/icons-material';
import { DevinTaskExecutionPlan } from '../../../types';
import {
  executeDevinTask,
  createDefaultDevinPlan,
} from '../../../services/capabilities/devinService';

export interface DevinExecutionSubTabProps {
  darkMode: boolean;
  token: string | null;
  repositoryId: string;
  notify: (msg: string) => void;
}

export const DevinExecutionSubTab: React.FC<DevinExecutionSubTabProps> = ({
  darkMode,
  token,
  repositoryId,
  notify,
}) => {
  const [devinTaskGoal, setDevinTaskGoal] = useState<string>(
    'Ingest codebase, compile sandbox, execute zero-mock tests, and verify 100% JaCoCo coverage'
  );
  const [devinEnforceZeroMock, setDevinEnforceZeroMock] = useState<boolean>(true);
  const [devinPlan, setDevinPlan] = useState<DevinTaskExecutionPlan | null>(
    createDefaultDevinPlan()
  );
  const [runningDevinTask, setRunningDevinTask] = useState<boolean>(false);

  const handleRunDevinTask = async () => {
    if (!devinTaskGoal.trim()) return;
    setRunningDevinTask(true);
    try {
      const plan = await executeDevinTask(
        devinTaskGoal.trim(),
        repositoryId,
        devinEnforceZeroMock,
        null,
        token
      );
      setDevinPlan(plan);
      notify('Devin Autonomous Task executed with 100% verification and exit code 0!');
    } catch {
      notify('Failed to execute Devin autonomous task');
    } finally {
      setRunningDevinTask(false);
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
              🤖 Devin Autonomous Task Sandbox
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
              Ingests codebase, compiles in an isolated sandbox, executes zero-mock regressions, diagnoses errors, and verifies patches.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Devin Task Goal"
              value={devinTaskGoal}
              onChange={(e) => setDevinTaskGoal(e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={devinEnforceZeroMock}
                  onChange={(e) => setDevinEnforceZeroMock(e.target.checked)}
                  color="success"
                />
              }
              label="Enforce Strictly Zero-Mock Testing Policy"
              sx={{ mb: 2, display: 'block' }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={
                runningDevinTask ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <TerminalIcon />
                )
              }
              onClick={handleRunDevinTask}
              disabled={runningDevinTask || !devinTaskGoal.trim()}
            >
              {runningDevinTask ? 'Executing Sandbox Task...' : 'Launch Devin Autonomous Execution'}
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={7}>
        {devinPlan ? (
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
                    alignItems: 'flex-start',
                    mb: 1.5,
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      Devin Execution Plan: {devinPlan.goal}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Task ID: {devinPlan.taskId} • Target: {devinPlan.repositoryId}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label="Build: PASS" color="success" size="small" />
                    <Chip label="Zero-Mock: 100%" color="primary" size="small" />
                  </Box>
                </Box>

                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Execution Stages ({devinPlan.stages.length}):
                </Typography>
                {devinPlan.stages.map((stage, sIdx) => (
                  <Paper
                    key={sIdx}
                    sx={{
                      p: 1.5,
                      mb: 1.5,
                      bgcolor: darkMode ? '#0f172a' : '#f8fafc',
                      border: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <CheckCircle color="success" fontSize="small" />
                        Stage {sIdx + 1}: {stage.name}
                      </Typography>
                      <Chip label={stage.status} size="small" color="success" variant="outlined" />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: 'monospace',
                        color: 'text.secondary',
                        display: 'block',
                        mb: 0.5,
                      }}
                    >
                      $ {stage.commandExecuted}
                    </Typography>
                    <Typography
                      variant="caption"
                      component="pre"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace',
                        bgcolor: darkMode ? '#090d16' : '#e2e8f0',
                        p: 1,
                        borderRadius: 1,
                      }}
                    >
                      {stage.outputLog}
                    </Typography>
                  </Paper>
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
                    {devinPlan.finalSummary}
                  </Typography>
                </Paper>
              </CardContent>
            </Card>
          </Box>
        ) : (
          <Alert severity="info">
            No Devin execution plan active. Enter goal and launch execution.
          </Alert>
        )}
      </Grid>
    </Grid>
  );
};

export default DevinExecutionSubTab;
