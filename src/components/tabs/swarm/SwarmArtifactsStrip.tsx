import React from 'react';
import { Card, Box, Typography, Tooltip, IconButton, Chip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface SwarmArtifactsStripProps {
  darkMode: boolean;
  artifacts: string[];
  onCopy: () => void;
}

export const SwarmArtifactsStrip: React.FC<SwarmArtifactsStripProps> = ({
  darkMode,
  artifacts,
  onCopy,
}) => {
  if (artifacts.length === 0) return null;

  return (
    <Card
      variant="outlined"
      sx={{
        mt: 3,
        p: 2,
        borderRadius: 2,
        bgcolor: darkMode ? '#090d16' : '#ffffff',
        borderColor: darkMode ? '#1e293b' : '#e2e8f0',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Consolidated Artifacts Synthesized Across Threads ({artifacts.length})
        </Typography>
        <Tooltip title="Copy all artifact names">
          <IconButton size="small" onClick={onCopy}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {artifacts.map((art, idx) => (
          <Chip
            key={idx}
            label={art}
            size="small"
            variant="outlined"
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              borderColor: darkMode ? '#334155' : '#cbd5e1',
            }}
          />
        ))}
      </Box>
    </Card>
  );
};
