import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper } from '@mui/material';
import {
  ChatMessage,
  ConversationMetadata,
  CodeArtifact,
  CodeContextAttachment,
  MultimodalAttachment,
  UserMemoryRecord,
  ChatFolder,
  ParsedDocument,
  OptimizationStrategy,
} from '../../types';
import {
  createDefaultConversation,
  createDefaultInitialMessage,
  sendIntelligentChatMessage,
  sendAutoChatStep,
} from '../../services/chatService';
import {
  fetchChatFolders,
  createChatFolder,
  toggleConversationPin,
  shareConversationSession,
  toggleMessageReaction,
} from '../../services/conversationCoreService';
import {
  ChatSessionSidebar,
  ChatHeaderBar,
  ChatMessageStream,
  ChatInputBar,
} from './chat';
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
  const [conversations, setConversations] = useState<ConversationMetadata[]>([createDefaultConversation()]);
  const [activeConvId, setActiveConvId] = useState<string>('conv-default');
  const [selectedModel, setSelectedModel] = useState<string>('deepseek-r1:8b');
  const [strategy, setStrategy] = useState<OptimizationStrategy>('AUTO');
  const [includeThinking, setIncludeThinking] = useState<boolean>(true);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [autoChatActive, setAutoChatActive] = useState<boolean>(false);
  const [folders, setFolders] = useState<ChatFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [parsedDocuments, setParsedDocuments] = useState<ParsedDocument[]>([]);
  const [voiceModalOpen, setVoiceModalOpen] = useState<boolean>(false);
  const [mediaModalOpen, setMediaModalOpen] = useState<boolean>(false);
  const [messagesByConv, setMessagesByConv] = useState<Record<string, ChatMessage[]>>({
    'conv-default': [createDefaultInitialMessage()],
  });
  const autoStepCountRef = useRef<number>(0);

  const activeMessages = messagesByConv[activeConvId] || [];
  const activeConversation = conversations.find((c) => c.conversationId === activeConvId);

  useEffect(() => {
    fetchChatFolders(token).then((res) => {
      if (res && res.length > 0) setFolders(res);
    });
  }, [token]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (autoChatActive && !chatLoading) {
      if (autoStepCountRef.current >= 10) {
        setAutoChatActive(false);
        autoStepCountRef.current = 0;
        notify('Auto-Chat completed 10 continuous autonomous reasoning cycles.');
        return;
      }
      const lastMsg = activeMessages[activeMessages.length - 1];
      if (!lastMsg || lastMsg.role === 'ASSISTANT') {
        timer = setTimeout(() => {
          autoStepCountRef.current += 1;
          handleAutoRunStep();
        }, 1500);
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoChatActive, chatLoading, activeMessages.length]);

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
      [newId]: [{
        id: 'msg-' + Date.now(),
        sender: 'AI Engineer',
        role: 'ASSISTANT',
        content: 'Started a fresh engineering session with active memory. What would you like to build?',
        model: selectedModel,
        timestamp: new Date().toLocaleTimeString(),
      }],
    }));
    notify('Created new conversation session');
  };

  const handleTogglePin = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = conversations.find((c) => c.conversationId === convId);
    const newPinned = !target?.pinned;
    setConversations((prev) => prev.map((c) => (c.conversationId === convId ? { ...c, pinned: newPinned } : c)));
    await toggleConversationPin(convId, newPinned, token);
  };

  const handleCreateFolder = async (name: string, color?: string) => {
    const created = await createChatFolder({ name, color }, token);
    setFolders((prev) => [...prev, created]);
    notify(`Created folder "${name}"`);
  };

  const handleShareConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { shareUrl } = await shareConversationSession(convId, token);
    if (navigator?.clipboard?.writeText) navigator.clipboard.writeText(shareUrl).catch(() => {});
    notify(`Share link generated: ${shareUrl}`);
  };

  const handleToggleReaction = async (messageId: string, emoji: string) => {
    const currentMsgs = messagesByConv[activeConvId] || [];
    const msgIdx = currentMsgs.findIndex((m) => m.id === messageId);
    if (msgIdx === -1) return;

    setMessagesByConv((prev) => {
      const convMsgs = [...(prev[activeConvId] || [])];
      const targetMsg = { ...convMsgs[msgIdx] };
      const currentReactions = { ...(targetMsg.reactions || {}) };
      const isCurrent = targetMsg.userReaction === emoji;

      if (isCurrent) {
        currentReactions[emoji] = Math.max(0, (currentReactions[emoji] || 1) - 1);
        targetMsg.userReaction = undefined;
      } else {
        if (targetMsg.userReaction && currentReactions[targetMsg.userReaction]) {
          currentReactions[targetMsg.userReaction] = Math.max(0, currentReactions[targetMsg.userReaction] - 1);
        }
        currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;
        targetMsg.userReaction = emoji;
      }
      targetMsg.reactions = currentReactions;
      convMsgs[msgIdx] = targetMsg;
      return { ...prev, [activeConvId]: convMsgs };
    });

    await toggleMessageReaction(activeConvId, msgIdx, emoji, token);
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
    let textToSend = presetText || chatInput;
    if (!textToSend.trim() && !pendingAttachment && parsedDocuments.length === 0) return;

    if (parsedDocuments.length > 0) {
      const docContext = parsedDocuments
        .map((d) => `[Document ${d.fileName} (${d.type})]:\n${d.extractedContent}`)
        .join('\n\n');
      textToSend = textToSend ? `${textToSend}\n\n---\n${docContext}` : docContext;
    }

    autoStepCountRef.current = 0;
    setChatInput('');
    setParsedDocuments([]);
    const userMsgId = 'user-' + Date.now();
    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: 'You',
      role: 'USER',
      content: textToSend,
      attachments: pendingAttachment ? [pendingAttachment] : [],
      timestamp: new Date().toLocaleTimeString(),
    };

    // Auto-update conversation title if it's the initial session title
    setConversations((prev) =>
      prev.map((c) => {
        if (c.conversationId === activeConvId && (c.title === 'New AI Engineering Session' || c.messageCount === 0)) {
          const generatedTitle = textToSend.length > 36 ? textToSend.substring(0, 36) + '...' : textToSend;
          return { ...c, title: generatedTitle, messageCount: c.messageCount + 1 };
        }
        return c;
      })
    );

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

  const handleAutoRunStep = async () => {
    setChatLoading(true);
    try {
      const result = await sendAutoChatStep({
        conversationId: activeConvId,
        contextCode: pendingAttachment ? pendingAttachment.codeSnippet : null,
        goal: activeConversation?.title,
        preferredModel: selectedModel,
        includeThinking,
        token,
      });

      setMessagesByConv((prev) => ({
        ...prev,
        [activeConvId]: [...(prev[activeConvId] || []), result.assistantMessage],
      }));
      notify('Auto-Chat executed next real-scenario engineering step!');
    } finally {
      setChatLoading(false);
    }
  };

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
