import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Divider,
  TextField,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
} from '@mui/material';
import { PlayArrow, CloudOff as CloudOffIcon, CloudQueue as CloudQueueIcon } from '@mui/icons-material';
import { OpenAiModelOption } from '../../../types';

export interface OpenAiAgentGoalFormProps {
  darkMode: boolean;
  goalInput: string;
  setGoalInput: (val: string) => void;
  selectedModel: string;
  setSelectedModel: (val: string) => void;
  reasoningEffort: string;
  setReasoningEffort: (val: string) => void;
  localFirstMode: boolean;
  setLocalFirstMode: (val: boolean) => void;
  running: boolean;
  modelOptions: OpenAiModelOption[];
  onLaunch: (presetGoal?: string) => void;
}

export const OpenAiAgentGoalForm: React.FC<OpenAiAgentGoalFormProps> = ({
  darkMode,
  goalInput,
  setGoalInput,
  selectedModel,
  setSelectedModel,
  reasoningEffort,
  setReasoningEffort,
  localFirstMode,
  setLocalFirstMode,
  running,
  modelOptions,
  onLaunch,
}) => {
  return (
    <Card elevation={2} sx={{ bgcolor: darkMode ? '#1e293b' : '#ffffff', borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
              ⚡ OENEXA Neo-GPT Autonomous Agent OS
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              100% OpenAI Protocol Compatible • o3 Multi-Stage Deliberative Reasoning • 10-Persona Agent OS • Local-First Air-Gapped
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="OpenAI Wire Compatible" color="primary" sx={{ fontWeight: 700 }} />
            <Chip label="o3 Deliberative Engine" color="secondary" sx={{ fontWeight: 700 }} />
            <Chip label="10-Persona Agent OS" color="success" sx={{ fontWeight: 700 }} />
            <Chip
              icon={localFirstMode ? <CloudOffIcon /> : <CloudQueueIcon />}
              label={localFirstMode ? 'Air-Gapped: Ollama localhost:11434' : 'Cloud Hybrid'}
              color={localFirstMode ? 'success' : 'warning'}
              sx={{ fontWeight: 700 }}
            />
            <Chip label="100% Zero-Mock Verified" color="info" variant="outlined" sx={{ fontWeight: 700 }} />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Autonomous Engineering Goal (Neo-GPT Engine)"
            placeholder="e.g. Design reactive microservice architecture with sealed records, zero-mock tests, and K8s manifests"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            fullWidth
            variant="outlined"
            multiline
            rows={2}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 220 }}>
                <InputLabel>Inference Model</InputLabel>
                <Select
                  value={selectedModel}
                  label="Inference Model"
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  {modelOptions.map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      {m.id} ({m.mode})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Reasoning Effort</InputLabel>
                <Select
                  value={reasoningEffort}
                  label="Reasoning Effort"
                  onChange={(e) => setReasoningEffort(e.target.value)}
                >
                  <MenuItem value="low">Low (Fast)</MenuItem>
                  <MenuItem value="medium">Medium (Balanced)</MenuItem>
                  <MenuItem value="high">High (Deep o3)</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={localFirstMode}
                    onChange={(e) => setLocalFirstMode(e.target.checked)}
                    color="success"
                  />
                }
                label="Air-Gapped Local Inference (Zero Telemetry)"
              />
            </Box>

            <Button
              variant="contained"
              size="large"
              color="primary"
              startIcon={running ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
              onClick={() => onLaunch()}
              disabled={running || !goalInput.trim()}
              sx={{ px: 4, py: 1.2, fontWeight: 700, borderRadius: 2 }}
            >
              {running ? 'Executing Neo-GPT Deliberation...' : 'Launch Autonomous Neo-GPT Goal'}
            </Button>
          </Box>

          {/* Quick Presets */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', pt: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Quick Goals:</Typography>
            <Chip
              label="Synthesize Reactive Hexagonal Service"
              size="small"
              onClick={() => {
                const g = 'Design and synthesize reactive Hexagonal service with Java 25 records and zero-mock tests';
                setGoalInput(g);
                onLaunch(g);
              }}
              clickable
            />
            <Chip
              label="SAST Security & Secret Audit"
              size="small"
              onClick={() => {
                const g = 'Run comprehensive SAST security audit and secret leak detection across all endpoints';
                setGoalInput(g);
                onLaunch(g);
              }}
              clickable
            />
            <Chip
              label="Synthesize 100% Zero-Mock Test Suite"
              size="small"
              onClick={() => {
                const g = 'Generate JUnit 5 & AssertJ unit test suite guaranteeing 100% JaCoCo coverage with zero mocks';
                setGoalInput(g);
                onLaunch(g);
              }}
              clickable
            />
            <Chip
              label="Multi-Stage Docker & Kubernetes Manifests"
              size="small"
              onClick={() => {
                const g = 'Generate multi-stage Eclipse Temurin Dockerfile and Kubernetes deployment manifests with non-root user';
                setGoalInput(g);
                onLaunch(g);
              }}
              clickable
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
