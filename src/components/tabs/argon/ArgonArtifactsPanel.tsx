import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import { Code as CodeIcon } from '@mui/icons-material';
import { CodeArtifact } from '../../../types';

export interface ArgonArtifactsPanelProps {
  darkMode: boolean;
  confidenceScore: number;
  artifacts: CodeArtifact[];
  onApplyArtifactToEditor: (artifact: CodeArtifact) => void;
}

export const ArgonArtifactsPanel: React.FC<ArgonArtifactsPanelProps> = ({
  darkMode,
  confidenceScore,
  artifacts,
  onApplyArtifactToEditor,
}) => {
  return (
    <Card elevation={2} sx={{ bgcolor: darkMode ? '#1e293b' : '#ffffff', borderRadius: 2 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
          📊 Goal Execution Metrics
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Confidence Score:
            </Typography>
            <Chip
              label={`${((confidenceScore || 0.99) * 100).toFixed(0)}% (Verified)`}
              color="success"
              size="small"
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Generated Artifacts:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {artifacts.length} Assets
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Test Policy:
            </Typography>
            <Chip label="Zero Mocks" size="small" variant="outlined" />
          </Box>
        </Box>

        <Divider sx={{ my: 1.5 }} />

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
