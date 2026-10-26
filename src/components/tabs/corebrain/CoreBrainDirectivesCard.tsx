import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { Send, Psychology, Bolt, Shield } from '@mui/icons-material';
import { CoreBrainDirective } from '../../../types/coreBrain';

interface CoreBrainDirectivesCardProps {
  darkMode: boolean;
  loading: boolean;
  onExecute: (directive: CoreBrainDirective) => void;
}

const PRESET_DIRECTIVES = [
  'Architect distributed CQRS event-sourcing platform',
  'Execute automated zero-mock self-audit across services',
  'Optimize L4 NVMe context cache with mmap zero-copy',
  'Deploy autonomous self-healing loop for deadlocks',
];

export const CoreBrainDirectivesCard: React.FC<CoreBrainDirectivesCardProps> = ({
  darkMode,
  loading,
  onExecute,
}) => {
  const [objective, setObjective] = useState<string>(PRESET_DIRECTIVES[0]);
  const [preferredModel, setPreferredModel] = useState<string>('oenexa-neo-gpt-o3-max');
  const [reasoningEffort, setReasoningEffort] = useState<'low' | 'medium' | 'high'>('high');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!objective.trim()) return;

    onExecute({
      objective: objective.trim(),
      preferredModel,
      reasoningEffort,
      localFirstRequired: true,
    });
  };

  return (
    <Card
      sx={{
        bgcolor: darkMode ? '#18181b' : '#ffffff',
        border: 1,
        borderColor: darkMode ? '#27272a' : '#e4e4e7',
        borderRadius: 2,
        boxShadow: 'none',
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Psychology sx={{ color: darkMode ? '#60a5fa' : '#2563eb', fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
              OENEXA Central Brain Directive Dispatcher
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              icon={<Shield sx={{ fontSize: '14px !important' }} />}
              label="Zero-Trust Enforced"
              size="small"
              sx={{ bgcolor: darkMode ? 'rgba(34,197,94,0.1)' : '#ecfdf5', color: '#16a34a', fontWeight: 600, fontSize: '0.72rem' }}
            />
            <Chip
              icon={<Bolt sx={{ fontSize: '14px !important' }} />}
              label="Virtual Threads"
              size="small"
              sx={{ bgcolor: darkMode ? 'rgba(59,130,246,0.1)' : '#eff6ff', color: '#2563eb', fontWeight: 600, fontSize: '0.72rem' }}
            />
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="System Objective / Directive"
            placeholder="Describe the high-level objective to be decomposed and orchestrated by the 12 core engines..."
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            multiline
            rows={2}
            size="small"
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Typography variant="caption" sx={{ color: darkMode ? '#a1a1aa' : '#71717a', alignSelf: 'center', mr: 0.5 }}>
              Presets:
            </Typography>
            {PRESET_DIRECTIVES.map((preset) => (
              <Chip
                key={preset}
                label={preset}
                size="small"
                onClick={() => setObjective(preset)}
                sx={{
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  bgcolor: darkMode ? '#27272a' : '#f4f4f5',
                  color: darkMode ? '#e4e4e7' : '#27272a',
                  '&:hover': { bgcolor: darkMode ? '#3f3f46' : '#e4e4e7' },
                }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              select
              size="small"
              label="Primary Reasoning Model"
              value={preferredModel}
              onChange={(e) => setPreferredModel(e.target.value)}
              sx={{ minWidth: 220 }}
            >
              <MenuItem value="oenexa-neo-gpt-o3-max">⚡ oenexa-neo-gpt-o3-max</MenuItem>
              <MenuItem value="deepseek-r1:8b">🧠 deepseek-r1:8b (Ollama)</MenuItem>
              <MenuItem value="qwen2.5-coder:7b">💻 qwen2.5-coder:7b (Local)</MenuItem>
              <MenuItem value="claude-3-7-sonnet">✨ claude-3-7-sonnet</MenuItem>
            </TextField>

            <TextField
              select
              size="small"
              label="Reasoning Effort"
              value={reasoningEffort}
              onChange={(e) => setReasoningEffort(e.target.value as 'low' | 'medium' | 'high')}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="low">Low (Fast)</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High (Deep CoT)</MenuItem>
            </TextField>

            <Box sx={{ flexGrow: 1 }} />

            <Button
              variant="contained"
              type="submit"
              disabled={loading || !objective.trim()}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Send />}
              sx={{
                bgcolor: '#2563eb',
                '&:hover': { bgcolor: '#1d4ed8' },
                fontWeight: 700,
                textTransform: 'none',
                px: 3,
              }}
            >
              {loading ? 'Synthesizing...' : 'Execute Brain Directive'}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};
