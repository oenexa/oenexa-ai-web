import React, { useState } from 'react';
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
} from '@mui/material';
import { PlayArrow, CheckCircle } from '@mui/icons-material';
import { AgentCollaborationTask } from '../../types';
import { runAgentCollaborationPipeline } from '../../services/agentCollaborationService';

export interface CollaborativeAgentsTabProps {
  darkMode: boolean;
  token?: string | null;
  notify: (msg: string) => void;
  initialGoal?: string;
}

const AGENTS = [
  { name: 'Architecture Agent', desc: 'Hexagonal layer boundaries, C4 models, RFC 7807' },
  { name: 'Code Agent', desc: 'Java 25 records, Spring Boot controllers, entities' },
  { name: 'Bug Fix Agent', desc: 'Root cause analysis, nullability checks, non-breaking patches' },
  { name: 'Test Agent', desc: '100% Zero-Mock JUnit 5 & BDD test synthesis' },
  { name: 'DevOps Agent', desc: 'Multi-stage Docker, K8s manifests, EKS Terraform' },
  { name: 'Documentation Agent', desc: 'Markdown API specifications, Mermaid diagrams' },
  { name: 'Security Agent', desc: 'SAST scans, OWASP Top 10, token leakage audit' },
];

export const CollaborativeAgentsTab: React.FC<CollaborAgentsTabProps> = ({
  darkMode,
  token,
  notify,
  initialGoal = 'Implement Real-Time Collaborative Code Review Microservice',
}) => {
  const [pipelineGoal, setPipelineGoal] = useState<string>(initialGoal);
  const [pipelineTasks, setPipelineTasks] = useState<AgentCollaborationTask[]>([]);
  const [runningPipeline, setRunningPipeline] = useState<boolean>(false);

  const handleRunPipeline = async () => {
    if (!pipelineGoal.trim()) return;
    setRunningPipeline(true);
    try {
      const tasks = await runAgentCollaborationPipeline({
        goal: pipelineGoal,
        token,
      });
      setPipelineTasks(tasks);
      notify('Collaborative 7-Agent Pipeline completed all steps successfully!');
    } catch {
      notify('Failed to run agent pipeline');
    } finally {
      setRunningPipeline(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: darkMode ? '#1e293b' : '#fff', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 800 }}>
          🤖 Autonomous 7-Agent Engineering Pipeline (Argon & Devin AI Architecture)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Coordinates 7 specialized software engineer agents collaboratively: Architecture Agent ➔ Code Agent ➔ Test Agent ➔ Security Agent ➔ DevOps Agent ➔ Documentation Agent.
        </Typography>

        <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
          {AGENTS.map((ag, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card variant="outlined" sx={{ bgcolor: darkMode ? '#0f172a' : '#f8fafc', height: '100%' }}>
                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {ag.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {ag.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <TextField
          fullWidth
          label="Engineering Objective / User Request"
          value={pipelineGoal}
          onChange={(e) => setPipelineGoal(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          size="large"
          startIcon={<PlayArrow />}
          onClick={handleRunPipeline}
          disabled={runningPipeline}
        >
          {runningPipeline ? 'Running 7-Agent Collaborative Pipeline...' : 'Execute Collaborative Pipeline'}
        </Button>
      </Paper>

      {pipelineTasks.length > 0 && (
        <Paper sx={{ p: 3, bgcolor: darkMode ? '#1e293b' : '#fff', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
            Collaborative Pipeline Execution Results ({pipelineTasks.length} Stages Completed)
          </Typography>
          <List>
            {pipelineTasks.map((task, idx) => (
              <React.Fragment key={task.taskId || idx}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemText
                    disableTypography
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <CheckCircle color="success" fontSize="small" />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          Stage {idx + 1}: {task.agentType}
                        </Typography>
                        <Chip label={task.status} color="success" size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
                        <Typography variant="caption" color="text.secondary">
                          {task.timestamp}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ pl: 3 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          <strong>Task:</strong> {task.taskDescription}
                        </Typography>
                        <Typography
                          variant="body2"
                          component="pre"
                          sx={{
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'monospace',
                            p: 1,
                            bgcolor: darkMode ? '#0f172a' : '#f8fafc',
                            borderRadius: 1,
                          }}
                        >
                          {task.outputResult}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};
