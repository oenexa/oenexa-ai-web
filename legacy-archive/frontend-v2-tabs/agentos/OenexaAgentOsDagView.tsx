import React from 'react';
import { Card, CardContent, Typography, Box, Chip, List, Paper } from '@mui/material';
import { OenexaAgentOsTaskStep } from '../../../types';

export interface OenexaAgentOsDagViewProps {
  darkMode: boolean;
  steps: OenexaAgentOsTaskStep[];
}

export const OenexaAgentOsDagView: React.FC<OenexaAgentOsDagViewProps> = ({ darkMode, steps }) => {
  const getPersonaColor = (persona: string) => {
    if (persona.includes('ARCH')) return 'primary';
    if (persona.includes('BACKEND')) return 'secondary';
    if (persona.includes('FRONTEND')) return 'info';
    if (persona.includes('SEC')) return 'warning';
    if (persona.includes('QA')) return 'success';
    if (persona.includes('DEVOPS')) return 'error';
    return 'default';
  };

  return (
    <Card elevation={2} sx={{ bgcolor: darkMode ? '#1e293b' : '#ffffff', borderRadius: 2 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            📋 10-Persona Autonomous Task Execution Graph
          </Typography>
          <Chip label={`${steps.length} Agent Tasks`} size="small" color="primary" />
        </Box>

        <List sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: 420, overflowY: 'auto' }}>
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
                    label={step.persona}
                    size="small"
                    color={getPersonaColor(step.persona)}
                    sx={{ fontWeight: 700 }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {step.action}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label={`${step.durationMs}ms`} size="small" variant="outlined" />
                  <Chip label={step.status} size="small" color="success" />
                </Box>
              </Box>
              {step.outputSnippet && (
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
                  {step.outputSnippet}
                </Typography>
              )}
            </Paper>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default OenexaAgentOsDagView;
