import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  PlayArrow,
  CheckCircle,
  ExpandMore,
  Psychology,
  SyncAlt,
  VerifiedUser,
  Memory,
} from '@mui/icons-material';
import {
  AgentProfile,
  AgentGoalExecutionPlan,
} from '../../types';
import {
  listEcosystemAgents,
  planEcosystemGoal,
  executeEcosystemPlan,
} from '../../services/agentEcosystemService';

export interface CollaborativeAgentsTabProps {
  darkMode: boolean;
  token?: string | null;
  notify: (msg: string) => void;
  initialGoal?: string;
}

export const CollaborativeAgentsTab: React.FC<CollaborativeAgentsTabProps> = ({
  darkMode,
  token,
  notify,
  initialGoal = 'Deploy High-Throughput Sovereign AI Microservices with Zero Mocks',
}) => {
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [goalTitle, setGoalTitle] = useState<string>(initialGoal);
  const [goalObjective, setGoalObjective] = useState<string>(
    'Coordinate autonomous multi-agent ecosystem to plan, synthesize, test, secure, deploy, and monitor production platform.'
  );
  const [currentPlan, setCurrentPlan] = useState<AgentGoalExecutionPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    listEcosystemAgents(token).then(setAgents).catch(() => {});
  }, [token]);

  const handlePlanGoal = async () => {
    if (!goalTitle.trim()) return;
    setLoading(true);
    try {
      const plan = await planEcosystemGoal(goalTitle, goalObjective, undefined, token);
      setCurrentPlan(plan);
      notify(`Planned 8-agent goal execution with ${plan.steps.length} sequential steps.`);
    } catch {
      notify('Failed to plan goal');
    } finally {
      setLoading(false);
    }
  };

  const handleExecutePlan = async () => {
    if (!currentPlan) return;
    setLoading(true);
    try {
      const completed = await executeEcosystemPlan(currentPlan.planId, token, currentPlan);
      setCurrentPlan(completed);
      notify('Autonomous 8-Agent execution completed with 100% self-reflection checks passed!');
    } catch {
      notify('Failed to execute agent plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1280, margin: '0 auto' }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: darkMode ? '#1e293b' : '#fff', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 800 }}>
          🤖 Autonomous 8-Agent Enterprise Ecosystem (Phase 5)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Multi-agent orchestration platform featuring goal planning, tool calling, self-reflection audits, team collaboration handoffs, and learned memories.
        </Typography>

        <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
          {agents.map((ag) => (
            <Grid item xs={12} sm={6} md={3} key={ag.agentType}>
              <Card variant="outlined" sx={{ bgcolor: darkMode ? '#0f172a' : '#f8fafc', height: '100%' }}>
                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {ag.displayName}
                    </Typography>
                    <Chip label={ag.autonomyLevel} size="small" sx={{ fontSize: '0.6rem', height: 16 }} />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    {ag.roleDescription}
                  </Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {ag.primaryTools.slice(0, 2).map((tool) => (
                      <Chip key={tool} label={tool} size="small" variant="outlined" sx={{ fontSize: '0.55rem', height: 16 }} />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Stack spacing={2} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Enterprise Goal Title"
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
          />
          <TextField
            fullWidth
            label="Objective & Success Criteria"
            value={goalObjective}
            onChange={(e) => setGoalObjective(e.target.value)}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            size="large"
            onClick={handlePlanGoal}
            disabled={loading}
          >
            {loading && !currentPlan?.completed ? 'Planning...' : 'Plan Goal'}
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrow />}
            onClick={currentPlan ? handleExecutePlan : handlePlanGoal}
            disabled={loading}
          >
            {loading ? 'Executing 8-Agent Pipeline...' : (currentPlan ? 'Execute Multi-Step Plan' : 'Plan & Execute Goal')}
          </Button>
        </Stack>
      </Paper>

      {currentPlan && (
        <Stack spacing={3}>
          <Paper sx={{ p: 3, bgcolor: darkMode ? '#1e293b' : '#fff', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Goal Execution Plan: {currentPlan.goalTitle}
              </Typography>
              <Chip
                label={currentPlan.currentPhase}
                color={currentPlan.completed ? 'success' : 'primary'}
                sx={{ fontWeight: 700 }}
              />
            </Box>

            <List disablePadding>
              {currentPlan.steps.map((step, idx) => (
                <Accordion
                  key={step.stepId}
                  defaultExpanded={idx === 0}
                  sx={{ mb: 1, bgcolor: darkMode ? '#0f172a' : '#f8fafc', '&:before': { display: 'none' } }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', pr: 2 }}>
                      <CheckCircle color={step.status === 'SUCCESS' ? 'success' : 'action'} fontSize="small" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Step {idx + 1}: {step.agentType}
                      </Typography>
                      <Chip label={step.status} size="small" color={step.status === 'SUCCESS' ? 'success' : 'default'} sx={{ height: 18, fontSize: '0.65rem' }} />
                      <Chip label={`Tool: ${step.toolToInvoke}`} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.65rem' }} />
                      {step.reflection && (
                        <Chip
                          icon={<VerifiedUser sx={{ fontSize: '0.75rem !important' }} />}
                          label={`Confidence: ${step.reflection.confidenceScore}%`}
                          color={step.reflection.passed ? 'success' : 'error'}
                          size="small"
                          sx={{ height: 18, fontSize: '0.65rem', ml: 'auto' }}
                        />
                      )}
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      <strong>Description:</strong> {step.stepDescription}
                    </Typography>
                    {step.output && (
                      <Typography
                        variant="body2"
                        component="pre"
                        sx={{
                          whiteSpace: 'pre-wrap',
                          fontFamily: 'monospace',
                          p: 1.5,
                          mb: 1.5,
                          bgcolor: darkMode ? '#1e293b' : '#e2e8f0',
                          borderRadius: 1,
                        }}
                      >
                        {step.output}
                      </Typography>
                    )}
                    {step.reflection && (
                      <Box sx={{ p: 1.5, bgcolor: darkMode ? '#1e293b' : '#f1f5f9', borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Psychology fontSize="inherit" /> Self-Reflection Critique & Invariant Audit:
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          {step.reflection.critique}
                        </Typography>
                        <Typography variant="caption" color="primary.main">
                          <strong>Correction:</strong> {step.reflection.correction}
                        </Typography>
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </List>
          </Paper>

          {currentPlan.collaborationLog.length > 0 && (
            <Paper sx={{ p: 3, bgcolor: darkMode ? '#1e293b' : '#fff', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SyncAlt /> Team Collaboration Handoff Telemetry ({currentPlan.collaborationLog.length} events)
              </Typography>
              <List disablePadding>
                {currentPlan.collaborationLog.map((ev, i) => (
                  <ListItem key={ev.eventId || i} sx={{ px: 0, py: 0.75 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label={ev.sourceAgent} size="small" color="primary" sx={{ height: 20, fontSize: '0.65rem' }} />
                          <Typography variant="caption">→</Typography>
                          <Chip label={ev.targetAgent} size="small" color="secondary" sx={{ height: 20, fontSize: '0.65rem' }} />
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                            {new Date(ev.timestamp).toLocaleTimeString()}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary" sx={{ pl: 1, mt: 0.5, display: 'block' }}>
                          {ev.handoffMessage}
                        </Typography>
                      }
                    />
                    {i < currentPlan.collaborationLog.length - 1 && <Divider />}
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}

          {currentPlan.learnedMemories.length > 0 && (
            <Paper sx={{ p: 3, bgcolor: darkMode ? '#1e293b' : '#fff', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Memory /> Learned Invariant Memories ({currentPlan.learnedMemories.length} rules acquired)
              </Typography>
              <Stack spacing={1}>
                {currentPlan.learnedMemories.map((mem, i) => (
                  <Box key={i} sx={{ p: 1, bgcolor: darkMode ? '#0f172a' : '#f8fafc', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                      {mem}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}
        </Stack>
      )}
    </Box>
  );
};
