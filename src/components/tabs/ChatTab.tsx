import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper } from '@mui/material';
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
  sendAutoChatStep,
} from '../../services/chatService';
import {
  ChatSessionSidebar,
  ChatHeaderBar,
  ChatMessageStream,
  ChatInputBar,
} from './chat';

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
  const [selectedModel, setSelectedModel] = useState<string>('deepseek-r1:8b');
  const [includeThinking, setIncludeThinking] = useState<boolean>(true);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [autoChatActive, setAutoChatActive] = useState<boolean>(false);
  const [messagesByConv, setMessagesByConv] = useState<Record<string, ChatMessage[]>>({
    'conv-default': [createDefaultInitialMessage()],
  });
  const autoStepCountRef = useRef<number>(0);

  const activeMessages = messagesByConv[activeConvId] || [];
  const activeConversation = conversations.find((c) => c.conversationId === activeConvId);

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

    autoStepCountRef.current = 0;
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

  const handleAutoRunStep = async () => {
    setChatLoading(true);
    try {
      const result = await sendAutoChatStep({
        conversationId: activeConvId,
        contextCode: pendingAttachment ? pendingAttachment.content : null,
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
    <Box sx={{ p: 2, height: 'calc(100vh - 170px)', display: 'flex', gap: 2 }}>
      {/* 1. Conversation Sessions Sidebar */}
      <ChatSessionSidebar
        darkMode={darkMode}
        conversations={conversations}
        activeConvId={activeConvId}
        onSelectConversation={setActiveConvId}
        onCreateNewConversation={handleCreateNewConversation}
        onTogglePin={handleTogglePin}
        onForkConversation={handleForkConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      {/* 2. Main Chat Conversation Area */}
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
        {/* Model Selection & CoT Switch */}
        <ChatHeaderBar
          activeConversation={activeConversation}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          includeThinking={includeThinking}
          setIncludeThinking={setIncludeThinking}
          autoChatActive={autoChatActive}
          setAutoChatActive={setAutoChatActive}
          onAutoRunStep={handleAutoRunStep}
        />

        {/* Streaming Messages & Code Artifacts */}
        <ChatMessageStream
          darkMode={darkMode}
          messages={activeMessages}
          chatLoading={chatLoading}
          onCopyCode={onCopyCode}
          onApplyArtifactToEditor={onApplyArtifactToEditor}
          onSendFollowUp={handleSendMessage}
        />

        {/* Input Bar with Context & Attachments */}
        <ChatInputBar
          darkMode={darkMode}
          chatInput={chatInput}
          setChatInput={setChatInput}
          chatLoading={chatLoading}
          pendingAttachment={pendingAttachment}
          setPendingAttachment={setPendingAttachment}
          multimodalAttachments={multimodalAttachments}
          handleRemoveMultimodalAttachment={handleRemoveMultimodalAttachment}
          handleAttachCodeToChat={handleAttachCodeToChat}
          handleAttachVoiceMemo={handleAttachVoiceMemo}
          handleAttachDiagram={handleAttachDiagram}
          isRecordingVoice={isRecordingVoice}
          onSendMessage={handleSendMessage}
        />
      </Paper>
    </Box>
  );
};
