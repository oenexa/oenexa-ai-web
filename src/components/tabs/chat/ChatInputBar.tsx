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
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSendMessage()}
        />
        <Button
          variant="contained"
          endIcon={<Send />}
          onClick={() => onSendMessage()}
          disabled={chatLoading}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};
