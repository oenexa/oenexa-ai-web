import React from 'react';
import { Box, Paper } from '@mui/material';
import {
  CodeArtifact,
  CodeContextAttachment,
  MultimodalAttachment,
  UserMemoryRecord,
} from '../../types';
import {
  ChatSessionSidebar,
  ChatHeaderBar,
  ChatMessageStream,
  ChatInputBar,
} from './chat';
import { useChatSession } from './chat/useChatSession';
import { VoiceAssistantModal } from '../voice/VoiceAssistantModal';
import { MediaStudioModal } from '../media/MediaStudioModal';

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
  const {
    conversations,
    activeConvId,
    setActiveConvId,
    selectedModel,
    setSelectedModel,
    strategy,
    setStrategy,
    includeThinking,
    setIncludeThinking,
    chatInput,
    setChatInput,
    chatLoading,
    autoChatActive,
    setAutoChatActive,
    folders,
    selectedFolderId,
    setSelectedFolderId,
    parsedDocuments,
    setParsedDocuments,
    voiceModalOpen,
    setVoiceModalOpen,
    mediaModalOpen,
    setMediaModalOpen,
    activeMessages,
    activeConversation,
    handleCreateNewConversation,
    handleTogglePin,
    handleCreateFolder,
    handleShareConversation,
    handleToggleReaction,
    handleForkConversation,
    handleDeleteConversation,
    handleSendMessage,
    handleAutoRunStep,
  } = useChatSession({
    token,
    username,
    repositoryId,
    pendingAttachment,
    setPendingAttachment,
    setUserMemories,
    notify,
  });

  return (
    <Box sx={{ p: { xs: 1, md: 1.5 }, height: 'calc(100vh - 80px)', display: 'flex', gap: { xs: 1, md: 2 } }}>
      <ChatSessionSidebar
        darkMode={darkMode}
        conversations={conversations}
        activeConvId={activeConvId}
        folders={folders}
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
        onCreateFolder={handleCreateFolder}
        onSelectConversation={setActiveConvId}
        onCreateNewConversation={handleCreateNewConversation}
        onTogglePin={handleTogglePin}
        onForkConversation={handleForkConversation}
        onDeleteConversation={handleDeleteConversation}
        onShareConversation={handleShareConversation}
      />

      <Paper
        elevation={0}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: darkMode ? '#18181b' : '#ffffff',
          borderRadius: 3,
          overflow: 'hidden',
          border: 1,
          borderColor: darkMode ? '#27272a' : '#e4e4e7',
          boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.05)',
        }}
      >
        <ChatHeaderBar
          activeConversation={activeConversation}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          strategy={strategy}
          setStrategy={setStrategy}
          includeThinking={includeThinking}
          setIncludeThinking={setIncludeThinking}
          autoChatActive={autoChatActive}
          setAutoChatActive={setAutoChatActive}
          onAutoRunStep={handleAutoRunStep}
        />

        <ChatMessageStream
          darkMode={darkMode}
          messages={activeMessages}
          chatLoading={chatLoading}
          onCopyCode={onCopyCode}
          onApplyArtifactToEditor={onApplyArtifactToEditor}
          onSendFollowUp={handleSendMessage}
          onToggleReaction={handleToggleReaction}
        />

        <ChatInputBar
          darkMode={darkMode}
          chatInput={chatInput}
          setChatInput={setChatInput}
          chatLoading={chatLoading}
          pendingAttachment={pendingAttachment}
          setPendingAttachment={setPendingAttachment}
          parsedDocuments={parsedDocuments}
          onRemoveParsedDocument={(id) => setParsedDocuments((prev) => prev.filter((d) => d.documentId !== id))}
          onAddParsedDocument={(doc) => setParsedDocuments((prev) => [...prev, doc])}
          multimodalAttachments={multimodalAttachments}
          handleRemoveMultimodalAttachment={handleRemoveMultimodalAttachment}
          handleAttachCodeToChat={handleAttachCodeToChat}
          handleAttachVoiceMemo={() => setVoiceModalOpen(true)}
          handleAttachDiagram={() => setMediaModalOpen(true)}
          isRecordingVoice={isRecordingVoice}
          onSendMessage={handleSendMessage}
        />
      </Paper>

      <VoiceAssistantModal
        open={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        darkMode={darkMode}
        token={token}
        notify={notify}
        onTranscriptInsert={(text) => setChatInput((prev) => (prev ? `${prev} ${text}` : text))}
      />

      <MediaStudioModal
        open={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        darkMode={darkMode}
        token={token}
        notify={notify}
        onInsertImageIntoChat={(uri, prompt) => setChatInput((prev) => (prev ? `${prev}\n![${prompt}](${uri})` : `![${prompt}](${uri})`))}
      />
    </Box>
  );
};
