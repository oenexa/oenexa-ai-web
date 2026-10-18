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
import { OenexaPlanStep } from '../../../types';

export interface OenexaPlanDagViewProps {
  darkMode: boolean;
  steps: OenexaPlanStep[];
}

export const OenexaPlanDagView: React.FC<OenexaPlanDagViewProps> = ({ darkMode, steps }) => {
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
            📋 OENEXA Autonomous Plan DAG (7 Personas)
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
                <Chip
                  label={step.status}
                  size="small"
                  color={step.status === 'COMPLETED' ? 'success' : step.status === 'RUNNING' ? 'primary' : 'default'}
                />
              </Box>

              {step.output && (
                <Box sx={{ mt: 1, pl: 4, pt: 0.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                    ↳ {step.output}
                  </Typography>
                </Box>
              )}
            </Paper>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
