import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { ArgonExecutionEvent } from '../../../types';

export interface ArgonThoughtTraceTerminalProps {
  darkMode: boolean;
  events: ArgonExecutionEvent[];
}

export const ArgonThoughtTraceTerminal: React.FC<ArgonThoughtTraceTerminalProps> = ({
  darkMode,
  events,
}) => {
  return (
    <Card elevation={2} sx={{ bgcolor: darkMode ? '#1e293b' : '#ffffff', borderRadius: 2 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            ⚡ Real-Time Thought Trace & Tool Telemetry
          </Typography>
          <Chip label="Live Telemetry Stream" size="small" color="info" variant="outlined" />
        </Box>

        <Box
          sx={{
            p: 2,
            bgcolor: '#090d16',
            color: '#38bdf8',
            borderRadius: 2,
            fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
            fontSize: '0.8rem',
            height: 320,
            overflowY: 'auto',
            border: 1,
            borderColor: '#1e293b',
          }}
        >
          {events.map((evt, idx) => (
            <Box key={evt.eventId || idx} sx={{ mb: 1.5, pb: 1, borderBottom: '1px dashed #1e293b' }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.5 }}>
                <span style={{ color: '#94a3b8' }}>[{evt.timestamp || '00:00:00'}]</span>
                <span style={{ color: '#a855f7', fontWeight: 'bold' }}>[{evt.phase}]</span>
                <span style={{ color: '#22c55e', fontWeight: 'bold' }}>[{evt.agentPersona}]</span>
                <span style={{ color: '#f59e0b' }}>tool: {evt.toolAction}</span>
              </Box>
              <Box sx={{ color: '#e2e8f0', pl: 2, whiteSpace: 'pre-wrap' }}>
                💭 {evt.thoughtProcess}
              </Box>
              {evt.outputSnippet && (
                <Box sx={{ color: '#64748b', pl: 2, fontStyle: 'italic', mt: 0.5 }}>
                  ➔ {evt.outputSnippet}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
