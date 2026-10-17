import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material';
import {
  PushPin,
  ForkRight,
  Delete,
  Add,
  Send,
  AttachFile,
  Mic as MicIcon,
  Image as ImageIcon,
  Description as DescriptionIcon,
  ExpandMore,
  Psychology,
  Build,
  Code as CodeIcon,
  ContentCopy,
  FolderOpen,
} from '@mui/icons-material';
import {
  ChatMessage,
  ConversationMetadata,
  CodeArtifact,
  CodeContextAttachment,
  MultimodalAttachment,
  UserMemoryRecord,
} from '../../types';
import {
  createDefaultConversation,
  createDefaultInitialMessage,
  sendIntelligentChatMessage,
} from '../../services/chatService';

export interface ChatTabProps {
  darkMode: boolean;
  token?: string | null;
  username: string;
  repositoryId: string;
  pendingAttachment: CodeContextAttachment | null;
  setPendingAttachment: React.Dispatch<React.SetStateAction<CodeContextAttachment | null>>;
  multimodalAttachments: MultimodalAttachment[];
  handleAttachCodeToChat: () => void;
  handleAttachVoiceMemo: () => void;
  handleAttachDiagram: () => void;
  handleRemoveMultimodalAttachment: (id: string) => void;
  isRecordingVoice: boolean;
  onApplyArtifactToEditor: (artifact: CodeArtifact) => void;
  onCopyCode: (code: string) => void;
  setUserMemories?: React.Dispatch<React.SetStateAction<UserMemoryRecord[]>>;
  notify: (msg: string) => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  darkMode,
  token,
  username,
  repositoryId,
  pendingAttachment,
  setPendingAttachment,
  multimodalAttachments,
  handleAttachCodeToChat,
  handleAttachVoiceMemo,
  handleAttachDiagram,
  handleRemoveMultimodalAttachment,
  isRecordingVoice,
  onApplyArtifactToEditor,
  onCopyCode,
  setUserMemories,
  notify,
}) => {
  const [conversations, setConversations] = useState<ConversationMetadata[]>([
    createDefaultConversation(),
  ]);
  const [activeConvId, setActiveConvId] = useState<string>('conv-default');
  const [selectedModel, setSelectedModel] = useState<string>('auto');
  const [includeThinking, setIncludeThinking] = useState<boolean>(true);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [messagesByConv, setMessagesByConv] = useState<Record<string, ChatMessage[]>>({
    'conv-default': [createDefaultInitialMessage()],
  });

  const activeMessages = messagesByConv[activeConvId] || [];
  const activeConversation = conversations.find((c) => c.conversationId === activeConvId);

  const handleCreateNewConversation = () => {
    const newId = 'conv-' + Date.now();
    const newMeta: ConversationMetadata = {
      conversationId: newId,
      tenantId: 'default-tenant',
      title: 'New AI Engineering Session',
      model: selectedModel,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
      pinned: false,
    };

    setConversations((prev) => [newMeta, ...prev]);
    setActiveConvId(newId);
    setMessagesByConv((prev) => ({
      ...prev,
      [newId]: [
        {
          id: 'msg-' + Date.now(),
          sender: 'AI Engineer',
          role: 'ASSISTANT',
          content:
            'Started a fresh engineering session with active memory and repository indexing. What would you like to build or analyze?',
          model: selectedModel,
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    }));
    notify('Created new conversation session');
  };

  const handleTogglePin = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) =>
      prev.map((c) => (c.conversationId === convId ? { ...c, pinned: !c.pinned } : c))
    );
  };

  const handleForkConversation = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const forkedId = 'fork-' + Date.now();
    const sourceMeta = conversations.find((c) => c.conversationId === convId);
    const forkedMeta: ConversationMetadata = {
      conversationId: forkedId,
      tenantId: 'default-tenant',
      title: `Fork of ${sourceMeta?.title || 'Session'}`,
      model: selectedModel,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: (messagesByConv[convId] || []).length,
      pinned: false,
    };
    setConversations((prev) => [forkedMeta, ...prev]);
    setMessagesByConv((prev) => ({
      ...prev,
      [forkedId]: [...(prev[convId] || [])],
    }));
    setActiveConvId(forkedId);
    notify('Conversation branched successfully!');
  };

  const handleDeleteConversation = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (conversations.length <= 1) {
      notify('Cannot delete the last remaining conversation');
      return;
    }
    setConversations((prev) => prev.filter((c) => c.conversationId !== convId));
    if (activeConvId === convId) {
      const remaining = conversations.filter((c) => c.conversationId !== convId);
      if (remaining.length > 0) setActiveConvId(remaining[0].conversationId);
    }
    notify('Conversation deleted');
  };

  const handleSendMessage = async (presetText?: string) => {
    const textToSend = presetText || chatInput;
    if (!textToSend.trim() && !pendingAttachment) return;

    setChatInput('');
    const userMsgId = 'user-' + Date.now();
    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: 'You',
      role: 'USER',
      content: textToSend,
      attachments: pendingAttachment ? [pendingAttachment] : [],
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessagesByConv((prev) => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), userMessage],
    }));

    const attachmentCopy = pendingAttachment;
    setPendingAttachment(null);
    setChatLoading(true);

    try {
      const result = await sendIntelligentChatMessage({
        message: textToSend,
        conversationId: activeConvId,
        userId: username || 'engineer',
        repositoryId,
        preferredModel: selectedModel,
        includeThinking,
        token,
        attachment: attachmentCopy,
      });

      setMessagesByConv((prev) => ({
        ...prev,
        [activeConvId]: [...(prev[activeConvId] || []), result.assistantMessage],
      }));

      if (setUserMemories && result.learnedMemories && result.learnedMemories.length > 0) {
        setUserMemories((prev) => {
          const merged = [...prev];
          for (const m of result.learnedMemories!) {
            if (!merged.some((x) => x.memoryKey === m.memoryKey)) {
              merged.push(m);
            }
          }
          return merged;
        });
      }
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, height: 'calc(100vh - 170px)', display: 'flex', gap: 2 }}>
      {/* Conversation Sidebar */}
      <Paper
        sx={{
          width: 280,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: darkMode ? '#1e293b' : '#ffffff',
          borderRadius: 2,
          overflow: 'hidden',
          border: 1,
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            p: 1.5,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Sessions
          </Typography>
          <Button size="small" startIcon={<Add />} variant="contained" onClick={handleCreateNewConversation}>
            New
          </Button>
        </Box>
        <List sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
          {conversations.map((conv) => {
            const isActive = conv.conversationId === activeConvId;
            return (
              <ListItem
                key={conv.conversationId}
                button
                onClick={() => setActiveConvId(conv.conversationId)}
                sx={{
                  borderRadius: 1.5,
                  mb: 0.5,
                  bgcolor: isActive ? (darkMode ? '#334155' : '#e2e8f0') : 'transparent',
                  '&:hover': { bgcolor: darkMode ? '#1e293b' : '#f1f5f9' },
                }}
              >
                <ListItemText
                  disableTypography
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {conv.pinned && <PushPin fontSize="small" color="primary" sx={{ fontSize: 14 }} />}
                      <Typography variant="body2" noWrap sx={{ fontWeight: isActive ? 700 : 500, flexGrow: 1 }}>
                        {conv.title}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {conv.model}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton size="small" onClick={(e) => handleTogglePin(conv.conversationId, e)} title="Pin">
                          <PushPin
                            fontSize="small"
                            sx={{ fontSize: 13, color: conv.pinned ? 'primary.main' : 'inherit' }}
                          />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => handleForkConversation(conv.conversationId, e)}
                          title="Fork / Branch"
                        >
                          <ForkRight fontSize="small" sx={{ fontSize: 13 }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => handleDeleteConversation(conv.conversationId, e)}
                          title="Delete"
                        >
                          <Delete fontSize="small" sx={{ fontSize: 13 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Paper>

      {/* Main Chat Conversation Area */}
      <Paper
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: darkMode ? '#1e293b' : '#ffffff',
          borderRadius: 2,
          overflow: 'hidden',
          border: 1,
          borderColor: 'divider',
        }}
      >
        {/* Header: Multi-Model Selector & CoT Switch */}
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

        {/* Messages Scroll Area */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {activeMessages.map((msg) => (
            <Box key={msg.id} sx={{ alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
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
                      onClick={() => handleSendMessage(fu)}
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

        {/* Input Bar with Attachment Preview */}
        <Box sx={{ p: 1.5, borderTop: 1, borderColor: 'divider', bgcolor: darkMode ? '#1e293b' : '#ffffff' }}>
          {pendingAttachment && (
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={<AttachFile />}
                label={`Attached: ${pendingAttachment.filePath} (${pendingAttachment.endLine} lines)`}
                onDelete={() => setPendingAttachment(null)}
                color="primary"
                size="small"
              />
            </Box>
          )}

          {multimodalAttachments.length > 0 && (
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              {multimodalAttachments.map((att) => (
                <Chip
                  key={att.id}
                  icon={
                    att.type === 'AUDIO_VOICE' ? (
                      <MicIcon />
                    ) : att.type === 'IMAGE' ? (
                      <ImageIcon />
                    ) : (
                      <DescriptionIcon />
                    )
                  }
                  label={`${att.fileName} (${att.type})`}
                  onDelete={() => handleRemoveMultimodalAttachment(att.id)}
                  color={att.type === 'AUDIO_VOICE' ? 'secondary' : 'info'}
                  size="small"
                />
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              color={pendingAttachment ? 'primary' : 'default'}
              onClick={handleAttachCodeToChat}
              title="Attach current editor code"
            >
              <AttachFile />
            </IconButton>
            <IconButton
              color={isRecordingVoice ? 'secondary' : 'default'}
              onClick={handleAttachVoiceMemo}
              title="Record Developer Voice Directive"
              disabled={isRecordingVoice}
            >
              <MicIcon />
            </IconButton>
            <IconButton color="default" onClick={handleAttachDiagram} title="Attach Architecture Diagram">
              <ImageIcon />
            </IconButton>
            <TextField
              fullWidth
              size="small"
              placeholder="Ask Claude, GPT, or Gemini Pro regarding architecture, code refactoring, test synthesis, or security..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            />
            <Button
              variant="contained"
              endIcon={<Send />}
              onClick={() => handleSendMessage()}
              disabled={chatLoading}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
