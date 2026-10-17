import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Paper,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material';
import {
  AttachFile,
  ExpandMore,
  Psychology,
  Build,
  Code as CodeIcon,
  ContentCopy,
  FolderOpen,
} from '@mui/icons-material';
import { ChatMessage, CodeArtifact } from '../../../types';

export interface ChatMessageStreamProps {
  darkMode: boolean;
  messages: ChatMessage[];
  chatLoading: boolean;
  onCopyCode: (code: string) => void;
  onApplyArtifactToEditor: (artifact: CodeArtifact) => void;
  onSendFollowUp: (text: string) => void;
}

export const ChatMessageStream: React.FC<ChatMessageStreamProps> = ({
  darkMode,
  messages,
  chatLoading,
  onCopyCode,
  onApplyArtifactToEditor,
  onSendFollowUp,
}) => {
  return (
    <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {messages.map((msg) => (
        <Box
          key={msg.id}
          sx={{
            alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 0.5,
              justifyContent: msg.sender === 'You' ? 'flex-end' : 'flex-start',
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: msg.sender === 'You' ? 'primary.main' : 'secondary.main' }}
            >
              {msg.sender}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {msg.timestamp}
            </Typography>
            {msg.provider && (
              <Chip label={msg.provider} size="small" color="primary" sx={{ height: 18, fontSize: '0.65rem' }} />
            )}
            {msg.taskType && (
              <Chip
                label={msg.taskType}
                size="small"
                color="info"
                variant="outlined"
                sx={{ height: 18, fontSize: '0.65rem' }}
              />
            )}
            {msg.rankingScore && (
              <Chip
                label={`Rank: ${(msg.rankingScore * 100).toFixed(0)}%`}
                size="small"
                color="success"
                sx={{ height: 18, fontSize: '0.65rem' }}
              />
            )}
          </Box>

          {/* Context Attachments on User Message */}
          {msg.attachments && msg.attachments.length > 0 && (
            <Paper
              sx={{
                p: 1,
                mb: 1,
                bgcolor: darkMode ? '#0f172a' : '#f1f5f9',
                borderLeft: 3,
                borderColor: 'primary.main',
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <AttachFile fontSize="small" sx={{ fontSize: 12 }} />
                Attached: {msg.attachments[0].filePath} (Lines {msg.attachments[0].startLine}-
                {msg.attachments[0].endLine})
              </Typography>
            </Paper>
          )}

          {/* Context Auto-Summarization Badge */}
          {msg.contextSummary && (
            <Box sx={{ mb: 1 }}>
              <Chip label={`Context: ${msg.contextSummary}`} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
            </Box>
          )}

          {/* Collapsible Chain-of-Thought (CoT) */}
          {msg.thoughtProcess && (
            <Accordion
              sx={{
                mb: 1.5,
                bgcolor: darkMode ? '#0f172a' : '#f8fafc',
                border: 1,
                borderColor: 'divider',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore fontSize="small" />} sx={{ minHeight: 32, py: 0 }}>
                <Typography
                  variant="caption"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 700, color: 'secondary.main' }}
                >
                  <Psychology fontSize="small" sx={{ fontSize: 14 }} />
                  Chain-of-Thought Reasoning
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, pb: 1 }}>
                <Typography
                  variant="caption"
                  component="pre"
                  sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: 'text.secondary' }}
                >
                  {msg.thoughtProcess}
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Tool Invocations */}
          {msg.toolCalls && msg.toolCalls.length > 0 && (
            <Box sx={{ mb: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {msg.toolCalls.map((tc, idx) => (
                <Paper key={idx} sx={{ p: 1, bgcolor: darkMode ? '#1e293b' : '#f1f5f9', border: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Build fontSize="small" sx={{ fontSize: 13, color: 'primary.main' }} />
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      Tool: {tc.toolName}
                    </Typography>
                    <Chip label="SUCCESS" size="small" color="success" sx={{ height: 16, fontSize: '0.6rem' }} />
                  </Box>
                </Paper>
              ))}
            </Box>
          )}

          {/* Message Bubble */}
          <Paper
            sx={{
              p: 2,
              bgcolor: msg.sender === 'You' ? (darkMode ? '#1e3a8a' : '#e0e7ff') : (darkMode ? '#1e293b' : '#f8fafc'),
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {msg.content}
            </Typography>
          </Paper>

          {/* Repository Knowledge Citations */}
          {msg.citations && msg.citations.length > 0 && (
            <Paper sx={{ mt: 1, p: 1, bgcolor: darkMode ? '#0f172a' : '#f1f5f9', border: 1, borderColor: 'divider' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                📚 Referenced Repository Citations:
              </Typography>
              {msg.citations.map((c, cidx) => (
                <Chip
                  key={cidx}
                  label={`${c.filePath} (${c.language})`}
                  size="small"
                  variant="outlined"
                  sx={{ mr: 0.5, mb: 0.5, fontSize: '0.65rem' }}
                />
              ))}
            </Paper>
          )}

          {/* Monaco Code Artifacts */}
          {msg.artifacts && msg.artifacts.length > 0 && (
            <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {msg.artifacts.map((art) => (
                <Paper
                  key={art.id}
                  sx={{
                    p: 1.5,
                    bgcolor: darkMode ? '#0f172a' : '#f1f5f9',
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CodeIcon fontSize="small" color="primary" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {art.title}
                      </Typography>
                      <Chip
                        label={art.action}
                        size="small"
                        color={art.action === 'CREATE' ? 'success' : 'warning'}
                        sx={{ height: 18, fontSize: '0.65rem' }}
                      />
                      <Chip label={art.language} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.65rem' }} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Button size="small" startIcon={<ContentCopy />} onClick={() => onCopyCode(art.code)}>
                        Copy
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<FolderOpen />}
                        onClick={() => onApplyArtifactToEditor(art)}
                      >
                        Load in Editor
                      </Button>
                    </Box>
                  </Box>
                  <Typography
                    variant="caption"
                    component="pre"
                    sx={{
                      maxHeight: 150,
                      overflowY: 'auto',
                      p: 1,
                      bgcolor: darkMode ? '#1e293b' : '#ffffff',
                      borderRadius: 1,
                      fontFamily: 'monospace',
                    }}
                  >
                    {art.code}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}

          {/* Follow-up Suggestions */}
          {msg.followUps && msg.followUps.length > 0 && (
            <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {msg.followUps.map((fu, fidx) => (
                <Chip
                  key={fidx}
                  label={fu}
                  size="small"
                  clickable
                  onClick={() => onSendFollowUp(fu)}
                  sx={{ fontSize: '0.75rem', bgcolor: darkMode ? '#334155' : '#e2e8f0' }}
                />
              ))}
            </Box>
          )}
        </Box>
      ))}

      {chatLoading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
          <CircularProgress size={16} />
          <Typography variant="caption" color="text.secondary">
            AI Agent is reasoning across multi-turn memory & repository knowledge...
          </Typography>
        </Box>
      )}
    </Box>
  );
};
