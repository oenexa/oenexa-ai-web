import React, { useRef } from 'react';
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
  UploadFile,
  Code as CodeIcon,
  TableChart,
  PictureAsPdf,
} from '@mui/icons-material';
import {
  CodeContextAttachment,
  MultimodalAttachment,
  ParsedDocument,
} from '../../../types';
import { parseFileAttachment } from '../../../services/conversationCoreService';

export interface ChatInputBarProps {
  darkMode: boolean;
  chatInput: string;
  setChatInput: (val: string) => void;
  chatLoading: boolean;
  pendingAttachment: CodeContextAttachment | null;
  setPendingAttachment: (att: CodeContextAttachment | null) => void;
  parsedDocuments?: ParsedDocument[];
  onRemoveParsedDocument?: (id: string) => void;
  onAddParsedDocument?: (doc: ParsedDocument) => void;
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
  parsedDocuments = [],
  onRemoveParsedDocument,
  onAddParsedDocument,
  multimodalAttachments,
  handleRemoveMultimodalAttachment,
  handleAttachCodeToChat,
  handleAttachVoiceMemo,
  handleAttachDiagram,
  isRecordingVoice,
  onSendMessage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onAddParsedDocument) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const fullDataUrl = reader.result as string;
        const base64 = fullDataUrl.includes(',') ? fullDataUrl.split(',')[1] : fullDataUrl;
        const parsed = await parseFileAttachment({
          fileName: file.name,
          base64Content: base64,
        });
        onAddParsedDocument(parsed);
      } catch (err) {
        console.error('Failed to parse file attachment:', err);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const getDocIcon = (type: ParsedDocument['type']) => {
    switch (type) {
      case 'PDF':
        return <PictureAsPdf fontSize="small" sx={{ fontSize: 13 }} />;
      case 'XLSX':
      case 'CSV':
        return <TableChart fontSize="small" sx={{ fontSize: 13 }} />;
      case 'ZIP':
      case 'CODE':
        return <CodeIcon fontSize="small" sx={{ fontSize: 13 }} />;
      default:
        return <DescriptionIcon fontSize="small" sx={{ fontSize: 13 }} />;
    }
  };

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2 }, borderTop: 1, borderColor: 'divider', bgcolor: darkMode ? '#1e293b' : '#ffffff' }}>
      <Box sx={{ maxWidth: '860px', width: '100%', mx: 'auto' }}>
        {/* Hidden File Input for Multi-format Documents */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".pdf,.docx,.txt,.xlsx,.csv,.json,.xml,.zip,image/*"
          onChange={handleFileInputChange}
        />

        {/* Pending Code Context Attachment */}
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

        {/* Parsed Multi-format Document Chips */}
        {parsedDocuments.length > 0 && (
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            {parsedDocuments.map((doc) => (
              <Chip
                key={doc.documentId}
                icon={getDocIcon(doc.type)}
                label={`${doc.fileName} (${doc.type} • ~${doc.tokenCount} tokens)`}
                onDelete={() => onRemoveParsedDocument && onRemoveParsedDocument(doc.documentId)}
                color="secondary"
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        )}

        {/* Multimodal Attachments */}
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

        {/* Quick Engineering Prompts */}
        <Box sx={{ mb: 1.5, display: 'flex', gap: 0.8, flexWrap: 'wrap', alignItems: 'center' }}>
          <Chip
            label="⚡ Auto-Architect • OENEXA Sovereign"
            size="small"
            clickable
            color="primary"
            variant="outlined"
            onClick={() => onSendMessage('Architect system design blueprint with sealed records and zero-mock boundaries')}
          />
          <Chip
            label="🚀 Self-Upgrade • OENEXA Continuous"
            size="small"
            clickable
            color="secondary"
            variant="outlined"
            onClick={() => onSendMessage('/upgrade Run automated self-upgrade cycle: inspect health, verify zero regressions, bump version, and commit')}
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
          <Chip
            label="🔍 Auto-Review PR"
            size="small"
            clickable
            color="secondary"
            variant="outlined"
            onClick={() => onSendMessage('Review Pull Request diff for zero-mock compliance, security, and performance')}
          />
          <Chip
            label="🛠️ Auto-Fix & Refactor"
            size="small"
            clickable
            color="default"
            variant="outlined"
            onClick={() => onSendMessage('Refactor active code into defensive immutable records and fix NPE risks')}
          />
        </Box>

        {/* Input Bar & Actions */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <IconButton
            title="Upload Document or Codebase (PDF, DOCX, XLSX, CSV, JSON, XML, ZIP, Image)"
            color={parsedDocuments.length > 0 ? 'secondary' : 'default'}
            onClick={() => fileInputRef.current?.click()}
            size="small"
            sx={{ mb: 0.5 }}
          >
            <UploadFile />
          </IconButton>

          <IconButton
            title="Attach current editor code"
            color={pendingAttachment ? 'primary' : 'default'}
            onClick={handleAttachCodeToChat}
            size="small"
            sx={{ mb: 0.5 }}
          >
            <AttachFile />
          </IconButton>

          <IconButton
            title="Record Developer Voice Directive"
            color={isRecordingVoice ? 'secondary' : 'default'}
            onClick={handleAttachVoiceMemo}
            disabled={isRecordingVoice}
            size="small"
            sx={{ mb: 0.5 }}
          >
            <MicIcon />
          </IconButton>

          <IconButton
            title="Attach Architecture Diagram"
            color="default"
            onClick={handleAttachDiagram}
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
                if (chatInput.trim() || pendingAttachment || parsedDocuments.length > 0) {
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
            disabled={chatLoading || (!chatInput.trim() && !pendingAttachment && parsedDocuments.length === 0)}
            sx={{ minWidth: 90, height: 40, mb: 0.3 }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
