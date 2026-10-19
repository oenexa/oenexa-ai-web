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
import { OenexaCognitiveModelOption } from '../../../types';

export interface OenexaAgentOsGoalFormProps {
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
  modelOptions: OenexaCognitiveModelOption[];
  onLaunch: (presetGoal?: string) => void;
}

export const OenexaAgentOsGoalForm: React.FC<OenexaAgentOsGoalFormProps> = ({
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
              Pure Own AI Engine • Wire Protocol Compatible • 5-Stage Deliberative Reasoning • 10-Persona Agent OS • Local Sovereign
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="OpenAI Wire Compatible" color="primary" sx={{ fontWeight: 700 }} />
            <Chip label="o3 Deliberative Engine" color="secondary" sx={{ fontWeight: 700 }} />
            <Chip label="10-Persona Agent OS" color="success" sx={{ fontWeight: 700 }} />
            <Chip
              icon={localFirstMode ? <CloudOffIcon /> : <CloudQueueIcon />}
              label={localFirstMode ? 'Sovereign Air-Gapped (Zero Telemetry)' : 'Cloud Hybrid'}
              color={localFirstMode ? 'success' : 'warning'}
              sx={{ fontWeight: 700 }}
            />
            <Chip label="100% Zero-Mock Verified" color="info" variant="outlined" sx={{ fontWeight: 700 }} />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Autonomous Engineering Goal (OENEXA Neo-GPT Engine)"
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
              <FormControl size="small" sx={{ minWidth: 260 }}>
                <InputLabel>Inference Model</InputLabel>
                <Select
                  value={selectedModel}
                  label="Inference Model"
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  {modelOptions.map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      {m.id} ({m.specialty})
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
                  <MenuItem value="low">Low (1 Iteration)</MenuItem>
                  <MenuItem value="medium">Medium (3 Hypotheses)</MenuItem>
                  <MenuItem value="high">High (Deep 5-Stage Deliberation)</MenuItem>
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
                label="Air-Gapped Sovereign"
              />
            </Box>

            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={running ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
              onClick={() => onLaunch()}
              disabled={running || !goalInput.trim()}
              sx={{ fontWeight: 700, px: 3 }}
            >
              {running ? 'Deliberating & Executing...' : 'Launch Autonomous Neo-GPT Goal'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OenexaAgentOsGoalForm;
