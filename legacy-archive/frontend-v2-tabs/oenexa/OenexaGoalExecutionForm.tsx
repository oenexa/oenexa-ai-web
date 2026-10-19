import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  TextField,
  Paper,
  Button,
  Chip,
  FormControlLabel,
  Switch,
  CircularProgress,
} from '@mui/material';
import {
  PlayArrow,
  Mic as MicIcon,
  Image as ImageIcon,
  Description as DescriptionIcon,
  CloudOff as CloudOffIcon,
  CloudQueue as CloudQueueIcon,
} from '@mui/icons-material';
import { MultimodalAttachment } from '../../../types';

export interface OenexaGoalExecutionFormProps {
  darkMode: boolean;
  goalInput: string;
  setGoalInput: (val: string) => void;
  isRunning: boolean;
  localFirstMode: boolean;
  setLocalFirstMode: (val: boolean) => void;
  autonomousHealing: boolean;
  setAutonomousHealing: (val: boolean) => void;
  extendedThinking: boolean;
  setExtendedThinking: (val: boolean) => void;
  multimodalAttachments: MultimodalAttachment[];
  isRecordingVoice: boolean;
  handleAttachVoiceMemo: () => void;
  handleAttachDiagram: () => void;
  handleAttachDocument: () => void;
  handleRemoveMultimodalAttachment: (id: string) => void;
  onLaunch: (presetGoal?: string) => void;
}

export const OenexaGoalExecutionForm: React.FC<OenexaGoalExecutionFormProps> = ({
  darkMode,
  goalInput,
  setGoalInput,
  isRunning,
  localFirstMode,
  setLocalFirstMode,
  autonomousHealing,
  setAutonomousHealing,
  extendedThinking,
  setExtendedThinking,
  multimodalAttachments,
  isRecordingVoice,
  handleAttachVoiceMemo,
  handleAttachDiagram,
  handleAttachDocument,
  handleRemoveMultimodalAttachment,
  onLaunch,
}) => {
  return (
    <Card elevation={2} sx={{ bgcolor: darkMode ? '#1e293b' : '#ffffff', borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
              🧬 OENEXA Neo-GPT Autonomous AI Agent (Pure Own AI Engine)
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Autonomous ReAct Goal Decomposition • Dynamic Multi-Persona DAG • Live Trace Telemetry • Self-Healing Reflection Loop • 0 External AI Dependencies
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="Neo-GPT Pure ReAct Engine" color="primary" sx={{ fontWeight: 700 }} />
            <Chip label="Self-Healing Reflection" color="success" sx={{ fontWeight: 700 }} />
            <Chip label="7-Persona Coordination" variant="outlined" sx={{ fontWeight: 700 }} />
            <Chip
              icon={localFirstMode ? <CloudOffIcon /> : <CloudQueueIcon />}
              label={localFirstMode ? 'Sovereign: In-Process Neural Engine' : 'Local Hybrid Active'}
              color={localFirstMode ? 'success' : 'warning'}
              sx={{ fontWeight: 700 }}
            />
            <Chip label="100% Zero-Mock Verified" color="info" variant="outlined" sx={{ fontWeight: 700 }} />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Autonomous Engineering Goal (OENEXA Engine)"
            placeholder="e.g. Refactor database entities to reactive Spring WebFlux and synthesize zero-mock test suite"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            fullWidth
            variant="outlined"
            multiline
            rows={2}
          />

          {/* Native Multimodal Ingestion Tray */}
          <Paper
            variant="outlined"
            sx={{ p: 1.5, borderRadius: 2, bgcolor: darkMode ? '#0f172a' : '#f8fafc' }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                🎙️ Native Multimodal Context Ingestion (Voice Directives, Diagrams, Specs)
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  startIcon={isRecordingVoice ? <CircularProgress size={14} color="inherit" /> : <MicIcon />}
                  onClick={handleAttachVoiceMemo}
                  disabled={isRecordingVoice}
                >
                  {isRecordingVoice ? 'Recording Directive...' : 'Record Voice Directive'}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="info"
                  startIcon={<ImageIcon />}
                  onClick={handleAttachDiagram}
                >
                  Attach Architecture Diagram
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  startIcon={<DescriptionIcon />}
                  onClick={handleAttachDocument}
                >
                  Attach Spec Document
                </Button>
              </Box>
            </Box>

            {multimodalAttachments.length > 0 ? (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                {multimodalAttachments.map((att) => (
                  <Chip
                    key={att.id}
                    icon={att.type === 'AUDIO_VOICE' ? <MicIcon /> : att.type === 'IMAGE' ? <ImageIcon /> : <DescriptionIcon />}
                    label={`${att.fileName} (${att.type})`}
                    onDelete={() => handleRemoveMultimodalAttachment(att.id)}
                    color={att.type === 'AUDIO_VOICE' ? 'secondary' : att.type === 'IMAGE' ? 'info' : 'primary'}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                No multimodal attachments active. Click above to attach developer speech directives, architecture PNG diagrams, or OpenAPI specifications.
              </Typography>
            )}
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={localFirstMode}
                    onChange={(e) => setLocalFirstMode(e.target.checked)}
                    color="success"
                  />
                }
                label="Air-Gapped Sovereign In-Process Neural Engine (Zero External AI Leakage)"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={autonomousHealing}
                    onChange={(e) => setAutonomousHealing(e.target.checked)}
                    color="success"
                  />
                }
                label="Autonomous Self-Healing Reflection"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={extendedThinking}
                    onChange={(e) => setExtendedThinking(e.target.checked)}
                    color="primary"
                  />
                }
                label="OENEXA Extended Thinking (Chain-of-Thought)"
              />
            </Box>

            <Button
              variant="contained"
              size="large"
              color="primary"
              startIcon={isRunning ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
              onClick={() => onLaunch()}
              disabled={isRunning || !goalInput.trim()}
              sx={{ px: 4, py: 1.2, fontWeight: 700, borderRadius: 2 }}
            >
              {isRunning ? 'Executing OENEXA Reasoning Loop...' : 'Launch Autonomous Engineering Goal'}
            </Button>
          </Box>

          {/* Quick Presets */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', pt: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Quick Goals:</Typography>
            <Chip
              label="Fix Compilation NPE Bug & Patch"
              size="small"
              onClick={() => {
                setGoalInput('Fix compilation NPE bug in payment service and apply minimal patch');
                onLaunch('Fix compilation NPE bug in payment service and apply minimal patch');
              }}
              clickable
            />
            <Chip
              label="Refactor to Hexagonal Architecture"
              size="small"
              onClick={() => {
                setGoalInput('Refactor monolith domain records to Hexagonal Architecture with sealed contracts');
                onLaunch('Refactor monolith domain records to Hexagonal Architecture with sealed contracts');
              }}
              clickable
            />
            <Chip
              label="Synthesize 100% Zero-Mock Tests"
              size="small"
              onClick={() => {
                setGoalInput('Synthesize zero-mock JUnit 5 test suite verifying 100% JaCoCo line coverage');
                onLaunch('Synthesize zero-mock JUnit 5 test suite verifying 100% JaCoCo line coverage');
              }}
              clickable
            />
            <Chip
              label="Multi-Stage Docker & K8s Pipeline"
              size="small"
              onClick={() => {
                setGoalInput('Configure multi-stage Dockerfile and Kubernetes manifests with EKS terraform');
                onLaunch('Configure multi-stage Dockerfile and Kubernetes manifests with EKS terraform');
              }}
              clickable
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
