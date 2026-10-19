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
} from '@mui/material';
import { Build, CheckCircle } from '@mui/icons-material';
import { OperatorWorkflow } from '../../../types';
import {
  executeOperatorWorkflow,
  createDefaultOperatorWorkflow,
} from '../../../services/capabilities/operatorService';

export interface OperatorDeliverySubTabProps {
  darkMode: boolean;
  token: string | null;
  notify: (msg: string) => void;
}

export const OperatorDeliverySubTab: React.FC<OperatorDeliverySubTabProps> = ({
  darkMode,
  token,
  notify,
}) => {
  const [operatorObjectiveInput, setOperatorObjectiveInput] = useState<string>(
    'Deploy Canary Release v2.5.0 with automated migrations, SAST scan, and K8s rolling update'
  );
  const [operatorWorkflow, setOperatorWorkflow] = useState<OperatorWorkflow | null>(
    createDefaultOperatorWorkflow()
  );
  const [runningOperator, setRunningOperator] = useState<boolean>(false);

  const handleExecuteOperatorWorkflow = async () => {
    if (!operatorObjectiveInput.trim()) return;
    setRunningOperator(true);
    try {
      const wf = await executeOperatorWorkflow(
        operatorObjectiveInput.trim(),
        ['DOCKER_BUILD', 'DB_MIGRATION', 'SAST_SECURITY_SCAN', 'K8S_DEPLOY'],
        token
      );
      setOperatorWorkflow(wf);
      notify(`OpenAI Operator executed ${wf.actions.length} environment actions with status COMPLETED!`);
    } catch {
      notify('Failed to execute operator workflow');
    } finally {
      setRunningOperator(false);
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
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              ⚙️ OpenAI Operator Delivery Workflows
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
              Multi-step autonomous environment workflows: Docker image builds, DB migrations, SAST scans, and K8s rolling updates.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Workflow Objective"
              value={operatorObjectiveInput}
              onChange={(e) => setOperatorObjectiveInput(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              startIcon={runningOperator ? <CircularProgress size={16} /> : <Build />}
              onClick={handleExecuteOperatorWorkflow}
              disabled={runningOperator || !operatorObjectiveInput.trim()}
            >
              {runningOperator ? 'Executing Environment Actions...' : 'Execute Operator Workflow'}
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={7}>
        {operatorWorkflow ? (
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
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {operatorWorkflow.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Objective: {operatorWorkflow.objective}
                  </Typography>
                </Box>
                <Chip label={operatorWorkflow.status} color="success" size="small" />
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Orchestrated Environment Actions ({operatorWorkflow.actions.length}):
              </Typography>
              {operatorWorkflow.actions.map((act, aIdx) => (
                <Paper
                  key={aIdx}
                  sx={{
                    p: 2,
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle color="success" fontSize="small" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Action {aIdx + 1}: {act.actionType}
                      </Typography>
                    </Box>
                    <Chip
                      label={act.resultStatus}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}
                  >
                    Target: {act.targetResource}
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
                    {act.executionOutput}
                  </Typography>
                </Paper>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Alert severity="info">
            No operator workflow executed yet. Click 'Execute Operator Workflow'.
          </Alert>
        )}
      </Grid>
    </Grid>
  );
};

export default OperatorDeliverySubTab;
