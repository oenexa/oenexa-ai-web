import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { DeliberativeReasoningTrace } from '../../../types';

export interface OpenAiReasoningInspectorProps {
  darkMode: boolean;
  trace: DeliberativeReasoningTrace;
}

export const OpenAiReasoningInspector: React.FC<OpenAiReasoningInspectorProps> = ({
  darkMode,
  trace,
}) => {
  return (
    <Card elevation={2} sx={{ bgcolor: darkMode ? '#1e293b' : '#ffffff', borderRadius: 2 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            🧠 o3 Deliberative Reasoning Trace (5 Cognitive Stages)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`${(trace.confidenceScore * 100).toFixed(0)}% (Verified)`}
              color="success"
              size="small"
              sx={{ fontWeight: 700 }}
            />
            <Chip
              label={`${trace.hypothesesCount} Hypotheses`}
              color="primary"
              variant="outlined"
              size="small"
            />
            <Chip
              label={trace.selfCritiquePassed ? 'Self-Critique: Passed ✅' : 'Self-Critique: Warning'}
              color="info"
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>

        <Box
          sx={{
            p: 2,
            bgcolor: '#090d16',
            color: '#38bdf8',
            borderRadius: 2,
            fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
            fontSize: '0.8rem',
            maxHeight: 280,
            overflowY: 'auto',
            border: 1,
            borderColor: '#1e293b',
          }}
        >
          {trace.thoughtSteps.map((step, idx) => (
            <Box key={idx} sx={{ mb: 1.2, pb: 0.8, borderBottom: '1px dashed #1e293b', whiteSpace: 'pre-wrap' }}>
              <span style={{ color: '#a855f7', fontWeight: 'bold' }}>💭 </span>
              <span style={{ color: '#e2e8f0' }}>{step}</span>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
