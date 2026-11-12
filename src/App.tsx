import React, { useState } from 'react';
import {
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import { PlatformNavigationBar } from './components/navigation';
import { OenexaEcosystemBar } from './components/navigation/OenexaEcosystemBar';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ChatTab } from './components/tabs/ChatTab';
import { OenexaAgentSwarmTab } from './components/tabs/OenexaAgentSwarmTab';
import { CoreBrainStudioTab } from './components/tabs/CoreBrainStudioTab';
import { AutonomousSelfHealingTab } from './components/tabs/AutonomousSelfHealingTab';
import { AuthDialog } from './components/auth';
import { SubscriptionBillingModal } from './components/billing/SubscriptionBillingModal';
import { MemoryMcpTelemetryModal } from './components/telemetry/MemoryMcpTelemetryModal';
import {
  CodeContextAttachment,
  CodeArtifact,
  MultimodalAttachment,
} from './types';

export * from './types';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  // SEC-05: JWT token kept strictly in memory; purge any legacy localStorage token on startup
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('oenexa_token');
    }
    return null;
  });
  const [username, setUsername] = useState<string>('engineer');
  const [authDialogOpen, setAuthDialogOpen] = useState<boolean>(false);
  const [billingModalOpen, setBillingModalOpen] = useState<boolean>(false);
  const [telemetryModalOpen, setTelemetryModalOpen] = useState<boolean>(false);
  const [pendingAttachment, setPendingAttachment] = useState<CodeContextAttachment | null>(null);
  const [multimodalAttachments, setMultimodalAttachments] = useState<MultimodalAttachment[]>([]);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'chat' | 'swarm' | 'brain' | 'healing'>('chat');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const notify = (msg: string) => setSnackbarMessage(msg);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('oenexa_token');
      localStorage.removeItem('oenexa_user');
    }
    if (typeof fetch === 'function' && import.meta.env?.MODE !== 'test') {
      fetch('/api/v1/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    }
    setToken(null);
    setUsername('engineer');
    notify('Logged out successfully');
  };

  const handleAttachCodeToChat = () => {
    setPendingAttachment({
      filePath: 'src/main/java/Solution.java',
      startLine: 1,
      endLine: 25,
      content: '// Attached Code Context for OENEXA Simple Chat',
      codeSnippet: '// Attached Code Context for OENEXA Simple Chat',
    });
    notify('Code attached to Chat context');
  };

  const handleAttachVoiceMemo = () => {
    setIsRecordingVoice(!isRecordingVoice);
    notify(isRecordingVoice ? 'Audio memo recorded' : 'Recording voice directive...');
  };

  const handleAttachDiagram = () => {
    notify('Diagram attachment ready');
  };

  const handleRemoveMultimodalAttachment = (id: string) => {
    setMultimodalAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleApplyArtifactToEditor = (artifact: { title?: string; code?: string } | CodeArtifact) => {
    notify(`Applied ${artifact.title || 'artifact'} to workspace`);
  };

  const handleCopyCode = (code: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(code);
    }
    notify('Code copied to clipboard');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: darkMode ? '#09090b' : '#fafafa',
        color: darkMode ? '#f4f4f5' : '#09090b',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <OenexaEcosystemBar activeProduct="ai" />
      <PlatformNavigationBar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        token={token}
        username={username}
        onOpenAuthDialog={() => setAuthDialogOpen(true)}
        onOpenBilling={() => setBillingModalOpen(true)}
        onOpenTelemetry={() => setTelemetryModalOpen(true)}
        onLogout={handleLogout}
        activeModel="deepseek-r1:8b"
        viewMode={viewMode}
        onSelectView={setViewMode}
      />

      <ErrorBoundary>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {viewMode === 'chat' && (
            <ChatTab
              darkMode={darkMode}
              token={token}
              username={username}
              repositoryId="default-repo"
              pendingAttachment={pendingAttachment}
              setPendingAttachment={setPendingAttachment}
              multimodalAttachments={multimodalAttachments}
              handleAttachCodeToChat={handleAttachCodeToChat}
              handleAttachVoiceMemo={handleAttachVoiceMemo}
              handleAttachDiagram={handleAttachDiagram}
              handleRemoveMultimodalAttachment={handleRemoveMultimodalAttachment}
              isRecordingVoice={isRecordingVoice}
              onApplyArtifactToEditor={handleApplyArtifactToEditor}
              onCopyCode={handleCopyCode}
              notify={notify}
            />
          )}
          {viewMode === 'swarm' && (
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              <OenexaAgentSwarmTab
                darkMode={darkMode}
                token={token}
                notify={notify}
              />
            </Box>
          )}
          {viewMode === 'brain' && (
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              <CoreBrainStudioTab
                darkMode={darkMode}
                token={token}
                notify={notify}
                onApplyArtifact={handleApplyArtifactToEditor}
                onCopyCode={handleCopyCode}
              />
            </Box>
          )}
          {viewMode === 'healing' && (
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              <AutonomousSelfHealingTab
                darkMode={darkMode}
                token={token}
                notify={notify}
                onCopyDiff={handleCopyCode}
              />
            </Box>
          )}
        </Box>
      </ErrorBoundary>

      <AuthDialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        onSuccess={(tk, user) => {
          setToken(tk);
          setUsername(user);
          notify(`Welcome back, ${user}!`);
        }}
        notify={notify}
      />

      <SubscriptionBillingModal
        open={billingModalOpen}
        onClose={() => setBillingModalOpen(false)}
        darkMode={darkMode}
        token={token}
        notify={notify}
      />

      <MemoryMcpTelemetryModal
        open={telemetryModalOpen}
        onClose={() => setTelemetryModalOpen(false)}
        darkMode={darkMode}
        token={token}
        notify={notify}
      />

      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setSnackbarMessage(null)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default App;
