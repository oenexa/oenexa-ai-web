import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

export interface OenexaPhaseStepperProps {
  darkMode: boolean;
  activePhase: string;
}

const PHASES = [
  { phase: 'PLANNING', label: '1. PLANNING', desc: 'Goal Analysis & Sovereign Context' },
  { phase: 'DECOMPOSITION', label: '2. DECOMPOSITION', desc: 'Dynamic Plan DAG across 7 Personas' },
  { phase: 'TOOL_EXECUTION', label: '3. TOOL_EXECUTION', desc: 'Active Code & Architecture Tools' },
  { phase: 'SELF_HEALING_VERIFICATION', label: '4. SELF_HEALING', desc: 'Reflection, Diagnostics & Patch' },
  { phase: 'REFLECTION', label: '5. REFLECTION', desc: 'Invariants & Zero Regression Check' },
  { phase: 'COMPLETED', label: '6. COMPLETED', desc: 'Goal Solved & Artifacts Extracted' },
];

export const OenexaPhaseStepper: React.FC<OenexaPhaseStepperProps> = ({
  darkMode,
  activePhase,
}) => {
  return (
    <Paper elevation={1} sx={{ p: 2, bgcolor: darkMode ? '#1e293b' : '#ffffff', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
        {PHASES.map((step, idx) => {
          const isCurrent = activePhase === step.phase || activePhase === 'COMPLETED';
          return (
            <Box
              key={idx}
              sx={{
                flex: '1 1 150px',
                p: 1.5,
                borderRadius: 1.5,
                border: 1,
                borderColor: isCurrent ? 'primary.main' : 'divider',
                bgcolor: isCurrent ? (darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)') : 'transparent',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle fontSize="small" color={isCurrent ? 'primary' : 'disabled'} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isCurrent ? 'primary.main' : 'text.secondary' }}>
                  {step.label}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                {step.desc}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};
