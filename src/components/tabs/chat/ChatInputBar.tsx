import React from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Send,
  AttachFile,
  Mic as MicIcon,
  Image as ImageIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { CodeContextAttachment, MultimodalAttachment } from '../../../types';

export interface ChatInputBarProps {
  darkMode: boolean;
  chatInput: string;
  setChatInput: (val: string) => void;
  chatLoading: boolean;
  pendingAttachment: CodeContextAttachment | null;
  setPendingAttachment: (att: CodeContextAttachment | null) => void;
  multimodalAttachments: MultimodalAttachment[];
  handleRemoveMultimodalAttachment: (id: string) => void;
  handleAttachCodeToChat: () => void;
  handleAttachVoiceMemo: () => void;
  handleAttachDiagram: () => void;
  isRecordingVoice: boolean;
  onSendMessage: (presetText?: string) => void;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  darkMode,
  chatInput,
  setChatInput,
  chatLoading,
  pendingAttachment,
  setPendingAttachment,
  multimodalAttachments,
  handleRemoveMultimodalAttachment,
  handleAttachCodeToChat,
  handleAttachVoiceMemo,
  handleAttachDiagram,
  isRecordingVoice,
  onSendMessage,
}) => {
  return (
    <Box sx={{ p: { xs: 1.5, sm: 2 }, borderTop: 1, borderColor: 'divider', bgcolor: darkMode ? '#1e293b' : '#ffffff' }}>
      <Box sx={{ maxWidth: '860px', width: '100%', mx: 'auto' }}>
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

        <Box sx={{ mb: 1.5, display: 'flex', gap: 0.8, flexWrap: 'wrap', alignItems: 'center' }}>
          <Chip
            label="⚡ Auto-Architect"
            size="small"
            clickable
            color="primary"
            variant="outlined"
            onClick={() => onSendMessage('Architect system design blueprint with sealed records and zero-mock boundaries')}
          />
          <Chip
            label="🧪 Auto-Synthesize Tests"
            size="small"
            clickable
            color="success"
            variant="outlined"
            onClick={() => onSendMessage('Synthesize zero-mock JUnit 5 test suite verifying 100% line coverage')}
          />
          <Chip
            label="🛡️ Auto-Audit Security"
            size="small"
            clickable
            color="warning"
            variant="outlined"
            onClick={() => onSendMessage('Perform SAST security scan and vulnerability audit on the codebase')}
          />
          <Chip
            label="🐳 Auto-DevOps Pipeline"
            size="small"
            clickable
            color="info"
            variant="outlined"
            onClick={() => onSendMessage('Generate Docker and Kubernetes deployment pipeline for the container deployment')}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <IconButton
            color={pendingAttachment ? 'primary' : 'default'}
            onClick={handleAttachCodeToChat}
            title="Attach current editor code"
            size="small"
            sx={{ mb: 0.5 }}
          >
            <AttachFile />
          </IconButton>
          <IconButton
            color={isRecordingVoice ? 'secondary' : 'default'}
            onClick={handleAttachVoiceMemo}
            title="Record Developer Voice Directive"
            disabled={isRecordingVoice}
            size="small"
            sx={{ mb: 0.5 }}
          >
            <MicIcon />
          </IconButton>
          <IconButton
            color="default"
            onClick={handleAttachDiagram}
            title="Attach Architecture Diagram"
            size="small"
            sx={{ mb: 0.5 }}
          >
            <ImageIcon />
          </IconButton>
          <TextField
            fullWidth
            multiline
            maxRows={5}
            size="small"
            placeholder="Ask OENEXA regarding architecture, refactoring, tests, or security... (Enter to send, Shift+Enter for new line)"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (chatInput.trim() || pendingAttachment) {
                  onSendMessage();
                }
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <Button
            variant="contained"
            endIcon={<Send />}
            onClick={() => onSendMessage()}
            disabled={chatLoading || (!chatInput.trim() && !pendingAttachment)}
            sx={{ minWidth: 90, height: 40, mb: 0.3 }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
