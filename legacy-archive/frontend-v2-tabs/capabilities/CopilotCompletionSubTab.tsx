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
  Paper,
} from '@mui/material';
import { AutoFixHigh } from '@mui/icons-material';
import { CopilotCompletionResponse } from '../../../types';
import {
  generateCopilotCompletion,
  createDefaultCopilotResponse,
} from '../../../services/capabilities/copilotService';

export interface CopilotCompletionSubTabProps {
  darkMode: boolean;
  token: string | null;
  notify: (msg: string) => void;
}

export const CopilotCompletionSubTab: React.FC<CopilotCompletionSubTabProps> = ({
  darkMode,
  token,
  notify,
}) => {
  const [copilotPrefixInput, setCopilotPrefixInput] = useState<string>(
    'public record UserSubscription(UUID id, String tier, Instant expiresAt) {\n    public boolean isExpired() {\n        return '
  );
  const [copilotFilePathInput, setCopilotFilePathInput] = useState<string>(
    'src/main/java/com/oenexa/domain/UserSubscription.java'
  );
  const [copilotResponse, setCopilotResponse] =
    useState<CopilotCompletionResponse | null>(createDefaultCopilotResponse());
  const [runningCopilot, setRunningCopilot] = useState<boolean>(false);

  const handleGenerateCopilotCompletion = async () => {
    if (!copilotPrefixInput.trim()) return;
    setRunningCopilot(true);
    try {
      const resp = await generateCopilotCompletion(
        copilotPrefixInput,
        copilotFilePathInput,
        token
      );
      setCopilotResponse(resp);
      notify(`Copilot Ghost-Text synthesized in ${resp.generationLatencyMs}ms!`);
    } catch {
      notify('Failed to synthesize Copilot completion');
    } finally {
      setRunningCopilot(false);
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
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              ✨ GitHub Copilot Inline Code Completion
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
              Synthesize ghost-text completions, record signatures, docstrings, and test assertions in real-time.
            </Typography>
            <TextField
              fullWidth
              size="small"
              label="Active File Path"
              value={copilotFilePathInput}
              onChange={(e) => setCopilotFilePathInput(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Prefix Code (Code before cursor)"
              value={copilotPrefixInput}
              onChange={(e) => setCopilotPrefixInput(e.target.value)}
              sx={{ mb: 2, fontFamily: 'monospace' }}
            />
            <Button
              fullWidth
              variant="contained"
              startIcon={runningCopilot ? <CircularProgress size={16} /> : <AutoFixHigh />}
              onClick={handleGenerateCopilotCompletion}
              disabled={runningCopilot || !copilotPrefixInput.trim()}
            >
              {runningCopilot ? 'Synthesizing Suggestions...' : 'Synthesize Copilot Suggestion'}
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        {copilotResponse ? (
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
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Ghost-Text Synthesis
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={`${copilotResponse.generationLatencyMs} ms`}
                    size="small"
                    color="success"
                  />
                  <Chip
                    label={`Confidence: ${copilotResponse.confidenceScore}`}
                    size="small"
                    color="primary"
                  />
                </Box>
              </Box>

              <Paper
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: darkMode ? '#0f172a' : '#f8fafc',
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}
                >
                  Suggested Ghost Text:
                </Typography>
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    color: darkMode ? '#38bdf8' : '#0284c7',
                  }}
                >
                  {copilotResponse.ghostText}
                </Typography>
              </Paper>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Candidate Suggestions ({copilotResponse.suggestions.length}):
              </Typography>
              {copilotResponse.suggestions.map((item, iIdx) => (
                <Paper
                  key={iIdx}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    bgcolor: darkMode ? '#0f172a' : '#f1f5f9',
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {item.label}
                    </Typography>
                    <Chip label={item.kind} size="small" variant="outlined" />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}
                  >
                    {item.documentation}
                  </Typography>
                  <Typography
                    variant="caption"
                    component="pre"
                    sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
                  >
                    {item.text}
                  </Typography>
                </Paper>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Alert severity="info">
            No completions generated yet. Click 'Synthesize Copilot Suggestion'.
          </Alert>
        )}
      </Grid>
    </Grid>
  );
};

export default CopilotCompletionSubTab;
