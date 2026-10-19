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
import { SmartToy } from '@mui/icons-material';
import { ConversationMetadata } from '../../../types';

export interface ChatHeaderBarProps {
  activeConversation?: ConversationMetadata;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  includeThinking: boolean;
  setIncludeThinking: (val: boolean) => void;
  autoChatActive?: boolean;
  setAutoChatActive?: (val: boolean) => void;
  onAutoRunStep?: () => void;
}

export const ChatHeaderBar: React.FC<ChatHeaderBarProps> = ({
  activeConversation,
  selectedModel,
  setSelectedModel,
  includeThinking,
  setIncludeThinking,
  autoChatActive = false,
  setAutoChatActive,
  onAutoRunStep,
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
          label={selectedModel === 'auto' ? 'Auto-Routing AI' : selectedModel}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Model Engine</InputLabel>
          <Select
            value={selectedModel}
            label="Model Engine"
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <MenuItem value="deepseek-r1:8b">🤖 DeepSeek-R1 8B (Local Ollama • Active)</MenuItem>
            <MenuItem value="qwen2.5-coder:7b">⚡ Qwen 2.5 Coder 7B (Local Ollama)</MenuItem>
            <MenuItem value="auto">⚡ Auto (OENEXA Local Ollama Routing)</MenuItem>
            <MenuItem value="oenexa-neo-gpt-o3-max">OENEXA Neo-GPT o3 Max (Deliberative)</MenuItem>
            <MenuItem value="oenexa-neo-gpt-coder-32b">OENEXA Neo-GPT Coder 32B (Coding)</MenuItem>
            <MenuItem value="oenexa-neo-gpt-architect-70b">OENEXA Neo-GPT Architect 70B (Architecture)</MenuItem>
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
      </Box>
    </Box>
  );
};
