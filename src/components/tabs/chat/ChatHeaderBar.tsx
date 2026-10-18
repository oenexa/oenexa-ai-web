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
            <MenuItem value="auto">⚡ Auto (OENEXA Autonomous Cognitive Routing)</MenuItem>
            <MenuItem value="oenexa-neo-gpt-o3-max">OENEXA Neo-GPT o3 Max (Deliberative Reasoning & Planning)</MenuItem>
            <MenuItem value="oenexa-neo-gpt-coder-32b">OENEXA Neo-GPT Coder 32B (Code Synthesis & Refactoring)</MenuItem>
            <MenuItem value="oenexa-neo-gpt-architect-70b">OENEXA Neo-GPT Architect 70B (Deep Invariants & C4 Modeling)</MenuItem>
            <MenuItem value="oenexa-neo-gpt-reasoning-14b">OENEXA Neo-GPT Reasoning 14B (High-Speed Tree-of-Thought)</MenuItem>
            <MenuItem value="oenexa-security-sast-v1">OENEXA Security SAST v1 (Vulnerability & Secrets Audit)</MenuItem>
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
