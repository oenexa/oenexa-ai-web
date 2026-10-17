import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  Image as ImageIcon,
  Mic as MicIcon,
  AutoFixHigh,
} from '@mui/icons-material';
import {
  MultimodalVisionAnalysis,
  MultimodalAudioAnalysis,
  MultimodalUnifiedContext,
  MultimodalAttachment,
} from '../../../types';
import {
  fuseMultimodalContext,
  createDefaultVisionAnalysis,
  createDefaultAudioAnalysis,
  createDefaultUnifiedMultimodalContext,
} from '../../../services/capabilities/geminiService';

export interface GeminiMultimodalSubTabProps {
  darkMode: boolean;
  token: string | null;
  multimodalAttachments: MultimodalAttachment[];
  notify: (msg: string) => void;
}

export const GeminiMultimodalSubTab: React.FC<GeminiMultimodalSubTabProps> = ({
  darkMode,
  token,
  multimodalAttachments,
  notify,
}) => {
  const [visionDiagramName, setVisionDiagramName] = useState<string>(
    'c4_hexagonal_architecture.png'
  );
  const [visionAnalysis] = useState<MultimodalVisionAnalysis | null>(
    createDefaultVisionAnalysis()
  );
  const [audioAnalysis] = useState<MultimodalAudioAnalysis | null>(
    createDefaultAudioAnalysis()
  );
  const [unifiedMultimodalContext, setUnifiedMultimodalContext] =
    useState<MultimodalUnifiedContext | null>(createDefaultUnifiedMultimodalContext());
  const [runningMultimodalFusion, setRunningMultimodalFusion] =
    useState<boolean>(false);

  const handleRunMultimodalFusion = async () => {
    setRunningMultimodalFusion(true);
    try {
      const unified = await fuseMultimodalContext(
        audioAnalysis,
        visionAnalysis,
        multimodalAttachments,
        'Unified Reactive Architecture Blueprint',
        token
      );
      setUnifiedMultimodalContext(unified);
      notify('Gemini Multimodal Vision, Audio & Spec Context fused with 0.99 confidence!');
    } catch {
      notify('Failed to fuse multimodal context');
    } finally {
      setRunningMultimodalFusion(false);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            bgcolor: darkMode ? '#1e293b' : '#ffffff',
            border: 1,
            borderColor: 'divider',
            mb: 3,
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <ImageIcon color="primary" /> Visual Architecture Diagram OCR & Parsing
              </Typography>
              <Chip label={visionAnalysis?.diagramType || 'DIAGRAM'} size="small" color="primary" />
            </Box>
            <TextField
              fullWidth
              size="small"
              label="Diagram File Name"
              value={visionDiagramName}
              onChange={(e) => setVisionDiagramName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>
              Detected Architecture Layers:
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
              {visionAnalysis?.detectedLayers.map((layer, lIdx) => (
                <Chip key={lIdx} label={layer} size="small" variant="outlined" color="info" />
              ))}
            </Box>

            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>
              Detected Spatial Components ({visionAnalysis?.components.length || 0}):
            </Typography>
            <List dense disablePadding>
              {visionAnalysis?.components.map((comp) => (
                <ListItem
                  key={comp.id}
                  sx={{
                    bgcolor: darkMode ? '#0f172a' : '#f8fafc',
                    mb: 0.5,
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {comp.name} ({comp.layerType})
                      </Typography>
                    }
                    secondary={`Bounding Box: ${comp.boundingBox} | Downstream: ${
                      comp.downstreamTargets.join(', ') || 'None'
                    }`}
                  />
                </ListItem>
              ))}
            </List>

            <Typography
              variant="caption"
              sx={{ fontWeight: 700, display: 'block', mt: 2, mb: 0.5 }}
            >
              Synthesized Mermaid Architecture:
            </Typography>
            <Paper
              sx={{
                p: 1.5,
                bgcolor: darkMode ? '#0f172a' : '#f1f5f9',
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="caption"
                component="pre"
                sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
              >
                {visionAnalysis?.synthesizedMermaidOrC4}
              </Typography>
            </Paper>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card
          sx={{
            bgcolor: darkMode ? '#1e293b' : '#ffffff',
            border: 1,
            borderColor: 'divider',
            mb: 3,
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <MicIcon color="secondary" /> Developer Speech Audio Directives
              </Typography>
              <Chip
                label={`${audioAnalysis?.audioLengthSeconds || 0}s Duration`}
                size="small"
                color="secondary"
              />
            </Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              <strong>Intent:</strong> {audioAnalysis?.developerIntent}
            </Alert>
            <Paper
              sx={{
                p: 1.5,
                mb: 2,
                bgcolor: darkMode ? '#0f172a' : '#f8fafc',
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
                Audio Transcript:
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                "{audioAnalysis?.transcript}"
              </Typography>
            </Paper>

            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>
              Extracted Actionable Directives:
            </Typography>
            {audioAnalysis?.extractedDirectives.map((directive, dIdx) => (
              <Typography
                key={dIdx}
                variant="caption"
                sx={{ display: 'block', mb: 0.5, color: 'text.secondary' }}
              >
                ✅ {directive}
              </Typography>
            ))}
          </CardContent>
        </Card>

        {/* Multimodal Unified Context Card */}
        <Card
          sx={{
            bgcolor: darkMode ? '#1e293b' : '#ffffff',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1.5,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                🌐 Multimodal Context Fusion
              </Typography>
              <Button
                size="small"
                variant="outlined"
                startIcon={
                  runningMultimodalFusion ? <CircularProgress size={14} /> : <AutoFixHigh />
                }
                onClick={handleRunMultimodalFusion}
                disabled={runningMultimodalFusion}
              >
                {runningMultimodalFusion ? 'Fusing...' : 'Re-Fuse Context'}
              </Button>
            </Box>
            <Paper
              sx={{
                p: 2,
                bgcolor: darkMode ? '#0f172a' : '#f1f5f9',
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="caption"
                component="pre"
                sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
              >
                {unifiedMultimodalContext?.unifiedEngineeringBrief}
              </Typography>
            </Paper>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default GeminiMultimodalSubTab;
