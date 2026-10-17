import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  List,
  Paper,
} from '@mui/material';
import { ArgonPlanStep } from '../../../types';

export interface ArgonPlanDagViewProps {
  darkMode: boolean;
  steps: ArgonPlanStep[];
}

export const ArgonPlanDagView: React.FC<ArgonPlanDagViewProps> = ({ darkMode, steps }) => {
  const getPersonaColor = (persona: string) => {
    if (persona.includes('ARCH')) return 'primary';
    if (persona.includes('CODE')) return 'secondary';
    if (persona.includes('BUG')) return 'error';
    if (persona.includes('TEST')) return 'success';
    if (persona.includes('SEC')) return 'warning';
    return 'default';
  };

  return (
    <Card elevation={2} sx={{ bgcolor: darkMode ? '#1e293b' : '#ffffff', borderRadius: 2 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            📋 Argon Autonomous Plan DAG (7 Personas)
          </Typography>
          <Chip label={`${steps.length} Ordered Tasks`} size="small" color="primary" />
        </Box>

        <List sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {steps.map((step, idx) => (
            <Paper
              key={step.stepId || idx}
              variant="outlined"
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: darkMode ? '#0f172a' : '#f8fafc',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Chip label={`Step ${idx + 1}`} size="small" sx={{ fontWeight: 700 }} />
                  <Chip
                    label={step.agentPersona}
                    size="small"
                    color={getPersonaColor(step.agentPersona)}
                    sx={{ fontWeight: 700 }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {step.description}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label={step.toolToInvoke || 'TOOL'} size="small" variant="outlined" />
                  <Chip label={step.status} size="small" color="success" />
                </Box>
              </Box>
              {step.output && (
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 1,
                    color: 'text.secondary',
                    fontFamily: 'monospace',
                    bgcolor: darkMode ? '#1e293b' : '#ffffff',
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  {step.output}
                </Typography>
              )}
            </Paper>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
