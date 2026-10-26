import React from 'react';
import {
  Box,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
} from '@mui/material';
import { SmartToy, Speed, Savings, Psychology, GroupWork, Tune, Laptop as WorksurfaceIcon } from '@mui/icons-material';
import { ConversationMetadata, OptimizationStrategy } from '../../../types';

export interface ChatHeaderBarProps {
  activeConversation?: ConversationMetadata;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  strategy?: OptimizationStrategy;
  setStrategy?: (strategy: OptimizationStrategy) => void;
  includeThinking: boolean;
  setIncludeThinking: (val: boolean) => void;
  autoChatActive?: boolean;
  setAutoChatActive?: (val: boolean) => void;
  onAutoRunStep?: () => void;
  sidecarOpen?: boolean;
  onToggleSidecar?: () => void;
}

export const ChatHeaderBar: React.FC<ChatHeaderBarProps> = ({
  activeConversation,
  selectedModel,
  setSelectedModel,
  strategy = 'AUTO',
  setStrategy,
  includeThinking,
  setIncludeThinking,
  autoChatActive = false,
  setAutoChatActive,
  onAutoRunStep,
  sidecarOpen = false,
  onToggleSidecar,
}) => {
  return (
    <Box
      sx={{
        p: 1.5,
        borderBottom: 1,
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {activeConversation?.title || 'Active Session'}
        </Typography>
        <Chip
          label={selectedModel === 'auto' ? 'Auto-Routing Engine' : selectedModel}
          size="small"
          color="primary"
          variant="outlined"
        />
        {strategy && strategy !== 'AUTO' && (
          <Chip
            label={strategy.replace('_', ' ')}
            size="small"
            color="secondary"
            variant="filled"
            sx={{ fontSize: '0.65rem', height: 20 }}
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
        {/* Strategy Selector */}
        {setStrategy && (
          <FormControl size="small" sx={{ minWidth: 155 }}>
            <InputLabel>Strategy</InputLabel>
            <Select
              value={strategy}
              label="Strategy"
              onChange={(e) => setStrategy(e.target.value as OptimizationStrategy)}
            >
              <MenuItem value="AUTO">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Tune sx={{ fontSize: 16 }} /> Auto-Adaptive
                </Box>
              </MenuItem>
              <MenuItem value="COST_OPTIMIZED">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Savings sx={{ fontSize: 16, color: 'success.main' }} /> Cost Optimized
                </Box>
              </MenuItem>
              <MenuItem value="SPEED_OPTIMIZED">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Speed sx={{ fontSize: 16, color: 'info.main' }} /> Speed Optimized
                </Box>
              </MenuItem>
              <MenuItem value="QUALITY_REASONING">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Psychology sx={{ fontSize: 16, color: 'secondary.main' }} /> Frontier Reasoning
                </Box>
              </MenuItem>
              <MenuItem value="MULTI_MODEL_COLLABORATION">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <GroupWork sx={{ fontSize: 16, color: 'warning.main' }} /> Multi-Model Collab
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Model Selection Dropdown */}
        <FormControl size="small" sx={{ minWidth: 215 }}>
          <InputLabel>Model Engine</InputLabel>
          <Select
            value={selectedModel}
            label="Model Engine"
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <MenuItem value="deepseek-r1:8b">⚡ OENEXA Sovereign Core (deepseek-r1:8b • Air-Gapped)</MenuItem>
            <MenuItem value="oenexa-core-neural-32b">⚡ OENEXA Core Neural Engine (32B • In-Process)</MenuItem>
            <MenuItem value="oenexa-high-reasoning-70b">🧠 OENEXA High-Reasoning Engine (70B)</MenuItem>
            <MenuItem value="oenexa-fast-matrix-8b">🚀 OENEXA Fast-Inference Matrix (8B • Real-Time)</MenuItem>
            <MenuItem value="oenexa-security-sast-v1">🛡️ OENEXA Invariant & Security Gate</MenuItem>
            <MenuItem value="auto">🌐 OENEXA Adaptive Neural Router</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Switch
              checked={includeThinking}
              onChange={(e) => setIncludeThinking(e.target.checked)}
              size="small"
            />
          }
          label={<Typography variant="caption">CoT Reasoning</Typography>}
        />

        {setAutoChatActive && (
          <FormControlLabel
            control={
              <Switch
                checked={autoChatActive}
                onChange={(e) => setAutoChatActive(e.target.checked)}
                size="small"
                color="success"
              />
            }
            label={
              <Typography variant="caption" sx={{ fontWeight: 700, color: autoChatActive ? 'success.main' : 'text.secondary' }}>
                🤖 Auto-Chat (Real Scenario)
              </Typography>
            }
          />
        )}

        {onAutoRunStep && (
          <Button
            variant="contained"
            size="small"
            color="secondary"
            startIcon={<SmartToy />}
            onClick={onAutoRunStep}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 1.5 }}
          >
            Auto-Run Next Step
          </Button>
        )}

        {onToggleSidecar && (
          <Button
            variant={sidecarOpen ? 'contained' : 'outlined'}
            size="small"
            color={sidecarOpen ? 'primary' : 'inherit'}
            startIcon={<WorksurfaceIcon sx={{ fontSize: 16 }} />}
            onClick={onToggleSidecar}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 1.5,
              fontSize: '0.75rem',
              ...(sidecarOpen ? { bgcolor: '#0284c7', color: '#fff' } : {}),
            }}
          >
            {sidecarOpen ? 'Worksurface (Open)' : 'Worksurface'}
          </Button>
        )}
      </Box>
    </Box>
  );
};
