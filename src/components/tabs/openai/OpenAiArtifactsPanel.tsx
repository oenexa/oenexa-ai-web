import React from 'react';
import { Card, CardContent, Typography, Box, Button, Divider } from '@mui/material';
import { Code as CodeIcon } from '@mui/icons-material';
import { CodeArtifact } from '../../../types';

export interface OpenAiArtifactsPanelProps {
  darkMode: boolean;
  artifacts: CodeArtifact[];
  onApplyArtifactToEditor: (artifact: CodeArtifact) => void;
}

export const OpenAiArtifactsPanel: React.FC<OpenAiArtifactsPanelProps> = ({
  darkMode,
  artifacts,
  onApplyArtifactToEditor,
}) => {
  return (
    <Card elevation={2} sx={{ bgcolor: darkMode ? '#1e293b' : '#ffffff', borderRadius: 2 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
          💾 Synthesized Code Assets ({artifacts.length})
        </Typography>

        <Divider sx={{ mb: 1.5 }} />

        {artifacts.map((art, idx) => (
          <Box key={art.id || idx} sx={{ mb: 1 }}>
            <Button
              size="small"
              variant="outlined"
              fullWidth
              startIcon={<CodeIcon />}
              onClick={() => onApplyArtifactToEditor(art)}
            >
              Load {art.title} in Editor
            </Button>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};
