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
} from '@mui/material';
import { ConversationMetadata } from '../../../types';

export interface ChatHeaderBarProps {
  activeConversation?: ConversationMetadata;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  includeThinking: boolean;
  setIncludeThinking: (val: boolean) => void;
}

export const ChatHeaderBar: React.FC<ChatHeaderBarProps> = ({
  activeConversation,
  selectedModel,
  setSelectedModel,
  includeThinking,
  setIncludeThinking,
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
            <MenuItem value="auto">⚡ Auto (Autonomous Multi-Model Routing)</MenuItem>
            <MenuItem value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet (Coding & Reasoning)</MenuItem>
            <MenuItem value="gpt-4o">OpenAI GPT-4o (Bug Fixing & Logic)</MenuItem>
            <MenuItem value="gemini-2.5-pro">Gemini 2.5 Pro (Deep CoT & Architecture)</MenuItem>
            <MenuItem value="gemini-2.5-flash">Gemini 2.5 Flash (Fast Execution)</MenuItem>
            <MenuItem value="deepseek-v3">DeepSeek V3 (Fast Chat)</MenuItem>
            <MenuItem value="mistral-large">Mistral Large (High Precision)</MenuItem>
            <MenuItem value="llama-3.3-70b">Meta Llama 3.3 (Open Weights)</MenuItem>
            <MenuItem value="oenexa-expert-code-v1">OENEXA Custom Model (Specialist)</MenuItem>
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
      </Box>
    </Box>
  );
};
