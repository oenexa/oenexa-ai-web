import React, { useRef, useEffect } from 'react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatLoading]);

  return (
    <Box sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 1.5, sm: 3 } }}>
      <Box sx={{ maxWidth: '860px', width: '100%', mx: 'auto', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {messages.map((msg) => (
        <Box
          key={msg.id}
          sx={{
            alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start',
            maxWidth: msg.sender === 'You' ? '82%' : '100%',
            width: msg.sender === 'You' ? 'auto' : '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 0.6,
              justifyContent: msg.sender === 'You' ? 'flex-end' : 'flex-start',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: '0.8rem',
                color: msg.sender === 'You' ? 'primary.main' : 'secondary.main',
              }}
            >
              {msg.sender === 'You' ? 'You' : msg.sender}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
              {msg.timestamp}
            </Typography>
            {msg.model && (
              <Chip
                label={msg.model}
                size="small"
                variant="outlined"
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
              defaultExpanded={false}
              sx={{
                mb: 1.5,
                bgcolor: darkMode ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.7)',
                border: 1,
                borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                borderRadius: '10px !important',
                overflow: 'hidden',
                '&:before': { display: 'none' },
                boxShadow: 'none',
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore fontSize="small" />} sx={{ minHeight: 34, py: 0.5, px: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Psychology fontSize="small" sx={{ fontSize: 16, color: 'secondary.main' }} />
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: '0.02em' }}
                  >
                    🧠 Deliberative Chain-of-Thought Reasoning
                  </Typography>
                  <Chip
                    label="Sovereign CoT"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.62rem',
                      bgcolor: darkMode ? 'rgba(147, 51, 234, 0.2)' : '#f3e8ff',
                      color: 'secondary.main',
                    }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, pb: 1.5, px: 2 }}>
                <Typography
                  variant="caption"
                  component="pre"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'Consolas, "Fira Code", monospace',
                    fontSize: '0.75rem',
                    lineHeight: 1.6,
                    color: darkMode ? '#cbd5e1' : '#475569',
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: darkMode ? '#0b0f19' : '#f8fafc',
                  }}
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
            elevation={0}
            sx={{
              p: 2.2,
              bgcolor:
                msg.sender === 'You'
                  ? (darkMode ? '#1e3a8a' : '#e0e7ff')
                  : (darkMode ? '#1e293b' : '#ffffff'),
              border: 1,
              borderColor:
                msg.sender === 'You'
                  ? (darkMode ? '#2563eb' : '#bfdbfe')
                  : (darkMode ? '#334155' : '#e2e8f0'),
              borderRadius: msg.sender === 'You' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              boxShadow: msg.sender === 'You' ? 'none' : (darkMode ? '0 2px 8px rgba(0,0,0,0.25)' : '0 1px 3px rgba(0,0,0,0.04)'),
            }}
          >
            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'pre-wrap',
                lineHeight: 1.7,
                fontSize: '0.93rem',
                color: msg.sender === 'You' ? (darkMode ? '#ffffff' : '#1e3a8a') : 'text.primary',
              }}
            >
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5 }}>
          <CircularProgress size={18} />
          <Typography variant="body2" color="text.secondary">
            AI Agent is reasoning and synthesizing next response...
          </Typography>
        </Box>
      )}
        <div ref={messagesEndRef} />
      </Box>
    </Box>
  );
};
