import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Shield as ShieldIcon,
  Speed,
  Psychology,
  Image as ImageIcon,
  Code as CodeIcon,
  Terminal as TerminalIcon,
  AutoFixHigh,
  Build,
} from '@mui/icons-material';
import { MultimodalAttachment } from '../../types';
import {
  ClaudeReasoningSubTab,
  GeminiMultimodalSubTab,
  CursorCodingSubTab,
  DevinExecutionSubTab,
  CopilotCompletionSubTab,
  OperatorDeliverySubTab,
} from './capabilities';

export interface TargetCapabilitiesTabProps {
  darkMode: boolean;
  token: string | null;
  repositoryId: string;
  multimodalAttachments: MultimodalAttachment[];
  notify: (msg: string) => void;
}

export const TargetCapabilitiesTab: React.FC<TargetCapabilitiesTabProps> = ({
  darkMode,
  token,
  repositoryId,
  multimodalAttachments,
  notify,
}) => {
  const [activeCapabilitySubTab, setActiveCapabilitySubTab] = useState<number>(0);

  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
      {/* Target Capabilities Header Banner */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          bgcolor: darkMode ? '#1e293b' : '#ffffff',
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}
            >
              ⚡ Target Capabilities: Next-Gen Autonomous AI Engineering Platform
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 850 }}>
              Equipped with OENEXA Tree-of-Thought deliberative reasoning, OENEXA multimodal spatial intelligence,
              OENEXA atomic code patching, OENEXA autonomous sandbox execution with zero-mock self-healing,
              OENEXA predictive ghost-text completion, and OENEXA cloud environment automations.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip icon={<ShieldIcon />} label="100% Zero-Mock Enforced" color="success" size="small" />
            <Chip icon={<Speed />} label="JaCoCo Line Coverage: 100%" color="primary" size="small" />
            <Chip label="v3.0.0-OENEXA-PURE-OWN" variant="outlined" size="small" />
            <Chip label="Confidence: 0.99" color="secondary" size="small" />
          </Box>
        </Box>

        {/* Capability Sub-Navigation Tabs */}
        <Tabs
          value={activeCapabilitySubTab}
          onChange={(_, val) => setActiveCapabilitySubTab(val)}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          sx={{ mt: 3, borderTop: 1, borderColor: 'divider', pt: 1 }}
        >
          <Tab
            icon={<Psychology />}
            iconPosition="start"
            label="1. Claude Reasoning (OENEXA Tree-of-Thought)"
            sx={{ fontWeight: 600 }}
          />
          <Tab
            icon={<ImageIcon />}
            iconPosition="start"
            label="2. Gemini Multimodal (OENEXA Spatial Engine)"
            sx={{ fontWeight: 600 }}
          />
          <Tab
            icon={<CodeIcon />}
            iconPosition="start"
            label="3. Cursor Coding (OENEXA Atomic Patching)"
            sx={{ fontWeight: 600 }}
          />
          <Tab
            icon={<TerminalIcon />}
            iconPosition="start"
            label="4. Devin Task Execution (OENEXA Autonomous Sandbox)"
            sx={{ fontWeight: 600 }}
          />
          <Tab
            icon={<AutoFixHigh />}
            iconPosition="start"
            label="5. GitHub Copilot (OENEXA Ghost-Text Prediction)"
            sx={{ fontWeight: 600 }}
          />
          <Tab
            icon={<Build />}
            iconPosition="start"
            label="6. OpenAI Operator (OENEXA Cloud Automations)"
            sx={{ fontWeight: 600 }}
          />
        </Tabs>
      </Paper>

      {/* Sub-tab 0: Claude-Level Reasoning */}
      {activeCapabilitySubTab === 0 && (
        <ClaudeReasoningSubTab
          darkMode={darkMode}
          token={token}
          notify={notify}
        />
      )}

      {/* Sub-tab 1: Gemini-Level Multimodal Intelligence */}
      {activeCapabilitySubTab === 1 && (
        <GeminiMultimodalSubTab
          darkMode={darkMode}
          token={token}
          multimodalAttachments={multimodalAttachments}
          notify={notify}
        />
      )}

      {/* Sub-tab 2: Cursor-Level Coding & Atomic Patches */}
      {activeCapabilitySubTab === 2 && (
        <CursorCodingSubTab
          darkMode={darkMode}
          token={token}
          repositoryId={repositoryId}
          notify={notify}
        />
      )}

      {/* Sub-tab 3: Devin-Level Autonomous Sandbox Execution */}
      {activeCapabilitySubTab === 3 && (
        <DevinExecutionSubTab
          darkMode={darkMode}
          token={token}
          repositoryId={repositoryId}
          notify={notify}
        />
      )}

      {/* Sub-tab 4: GitHub Copilot Inline Completion */}
      {activeCapabilitySubTab === 4 && (
        <CopilotCompletionSubTab
          darkMode={darkMode}
          token={token}
          notify={notify}
        />
      )}

      {/* Sub-tab 5: OpenAI Operator Automation Workflows */}
      {activeCapabilitySubTab === 5 && (
        <OperatorDeliverySubTab
          darkMode={darkMode}
          token={token}
          notify={notify}
        />
      )}
    </Box>
  );
};

export default TargetCapabilitiesTab;
