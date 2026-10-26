import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Tabs,
  Tab,
  Chip,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Code as CodeIcon,
  Difference as DiffIcon,
  Terminal as TerminalIcon,
  Description as ArtifactIcon,
  Close as CloseIcon,
  Check as AcceptIcon,
  Clear as RevertIcon,
  ContentCopy as CopyIcon,
  PlayArrow as RunIcon,
} from '@mui/icons-material';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { CodeArtifact } from '../../types';

export interface TerminalLogEntry {
  id: string;
  command: string;
  output: string;
  exitCode: number;
  timestamp: string;
}

export interface AntigravitySidecarProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  activeFilePath?: string;
  activeCode?: string;
  originalCode?: string;
  activeLanguage?: string;
  onChangeCode?: (newCode: string) => void;
  onAcceptDiff?: () => void;
  onRejectDiff?: () => void;
  onRunTestCommand?: (command: string) => void;
  terminalLogs?: TerminalLogEntry[];
  artifacts?: CodeArtifact[];
  notify: (msg: string) => void;
}

export const AntigravitySidecar: React.FC<AntigravitySidecarProps> = ({
  darkMode,
  isOpen,
  onClose,
  activeFilePath = 'src/main/java/com/oenexa/application/UserService.java',
  activeCode = `package com.oenexa.application;

import com.oenexa.domain.User;
import com.oenexa.domain.UserRegistration;
import java.util.Objects;

/**
 * Enterprise User Application Service.
 * Implements Hexagonal Domain-Driven Architecture with Zero-Mock Validation.
 */
public class UserService {

    public User registerUser(UserRegistration registration) {
        Objects.requireNonNull(registration, "registration must not be null");
        return new User(
            registration.username(),
            registration.passwordHash(),
            registration.email()
        );
    }
}`,
  originalCode = `package com.oenexa.application;

import com.oenexa.domain.User;
import com.oenexa.domain.UserRegistration;

public class UserService {
    // Legacy implementation lacking defensive validations
    public User registerUser(UserRegistration registration) {
        return new User(registration.username(), registration.passwordHash(), registration.email());
    }
}`,
  activeLanguage = 'java',
  onChangeCode,
  onAcceptDiff,
  onRejectDiff,
  onRunTestCommand,
  terminalLogs = [
    {
      id: 'log-1',
      command: './gradlew :api:test --info',
      output: `> Task :api:test
DatabaseSchemaIntegrationTest > Should verify Flyway migration seeded default roles PASSED
DatabaseSchemaIntegrationTest > Should verify Flyway migration seeded default admin user PASSED
DatabaseSchemaIntegrationTest > Should persist and retrieve project and repository entities PASSED
BUILD SUCCESSFUL in 2.1s (19 actionable tasks: 19 up-to-date)`,
      exitCode: 0,
      timestamp: 'Just now',
    },
  ],
  artifacts = [
    {
      id: 'art-1',
      title: 'ARCHITECTURE_DECISION_RECORD.md',
      type: 'DOCUMENTATION',
      codeSnippet: `# ADR 004: Hexagonal Domain-Driven Architecture

## Status
Accepted

## Context
OENEXA AI requires an autonomous, decoupled software engineering engine.

## Decision
Adopt Clean Architecture with strict port-and-adapter boundaries:
- Domain layer holds invariant records with zero framework dependencies.
- Application layer orchestrates business logic and virtual thread execution.
- Infrastructure provides Flyway migrations and PostgreSQL/H2 persistence.
- API layer exposes declarative REST endpoints.`,
    },
  ],
  notify,
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'diff' | 'terminal' | 'artifacts'>('editor');
  const [customCommand, setCustomCommand] = useState('');
  const [selectedArtifactIndex, setSelectedArtifactIndex] = useState(0);

  if (!isOpen) return null;

  const bgHeader = darkMode ? '#18181b' : '#f4f4f5';
  const borderColor = darkMode ? '#27272a' : '#e4e4e7';
  const editorTheme = darkMode ? 'vs-dark' : 'light';

  const handleCopy = (text: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
    }
    notify('Copied to clipboard');
  };

  const handleExecuteCommand = (cmd: string) => {
    if (!cmd.trim()) return;
    if (onRunTestCommand) {
      onRunTestCommand(cmd);
    } else {
      notify(`Executing command: ${cmd}`);
    }
    setCustomCommand('');
  };

  return (
    <Box
      sx={{
        width: { xs: '100%', md: '50%', lg: '48%' },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: darkMode ? '#0e0e11' : '#ffffff',
        border: 1,
        borderColor: borderColor,
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 10,
        boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.05)',
      }}
    >
      {/* Top Sidecar Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 0.8,
          bgcolor: bgHeader,
          borderBottom: 1,
          borderColor: borderColor,
          minHeight: '48px',
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          sx={{
            minHeight: '36px',
            '& .MuiTab-root': {
              minHeight: '36px',
              textTransform: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
              px: 1.5,
              py: 0,
              gap: 0.8,
            },
          }}
        >
          <Tab
            value="editor"
            label="Editor"
            icon={<CodeIcon sx={{ fontSize: '1.05rem' }} />}
            iconPosition="start"
          />
          <Tab
            value="diff"
            label="Diffs"
            icon={<DiffIcon sx={{ fontSize: '1.05rem' }} />}
            iconPosition="start"
          />
          <Tab
            value="terminal"
            label="Terminal"
            icon={<TerminalIcon sx={{ fontSize: '1.05rem' }} />}
            iconPosition="start"
          />
          <Tab
            value="artifacts"
            label="Artifacts"
            icon={<ArtifactIcon sx={{ fontSize: '1.05rem' }} />}
            iconPosition="start"
          />
        </Tabs>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={activeLanguage.toUpperCase()}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              fontWeight: 800,
              bgcolor: darkMode ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)',
              color: '#3b82f6',
            }}
          />
          <Tooltip title="Close Worksurface Pane">
            <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Sub-Header: Active File / Action Controls */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 0.7,
          bgcolor: darkMode ? '#121216' : '#fafafa',
          borderBottom: 1,
          borderColor: borderColor,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: '0.78rem',
            color: darkMode ? '#a1a1aa' : '#52525b',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          📄 {activeFilePath}
        </Typography>

        {activeTab === 'diff' && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={<AcceptIcon />}
              onClick={() => {
                if (onAcceptDiff) onAcceptDiff();
                notify('Proposed changes accepted and applied to workspace');
              }}
              sx={{ textTransform: 'none', fontSize: '0.72rem', py: 0.2, px: 1, fontWeight: 700 }}
            >
              Accept Diff
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<RevertIcon />}
              onClick={() => {
                if (onRejectDiff) onRejectDiff();
                notify('Changes reverted to original version');
              }}
              sx={{ textTransform: 'none', fontSize: '0.72rem', py: 0.2, px: 1, fontWeight: 700 }}
            >
              Revert
            </Button>
          </Box>
        )}

        {activeTab === 'editor' && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<CopyIcon />}
              onClick={() => handleCopy(activeCode)}
              sx={{ textTransform: 'none', fontSize: '0.72rem', py: 0.2, px: 1 }}
            >
              Copy
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => notify(`Saved changes to ${activeFilePath}`)}
              sx={{ textTransform: 'none', fontSize: '0.72rem', py: 0.2, px: 1.2, fontWeight: 700 }}
            >
              Save File
            </Button>
          </Box>
        )}

        {activeTab === 'terminal' && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<RunIcon />}
              onClick={() => handleExecuteCommand('./gradlew test')}
              sx={{ textTransform: 'none', fontSize: '0.72rem', py: 0.2, px: 1 }}
            >
              Run Gradle Tests
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<RunIcon />}
              onClick={() => handleExecuteCommand('npm test')}
              sx={{ textTransform: 'none', fontSize: '0.72rem', py: 0.2, px: 1 }}
            >
              Run Web Tests
            </Button>
          </Box>
        )}
      </Box>

      {/* Main Tab Viewport */}
      <Box sx={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
        {/* 1. Monaco Code Editor */}
        {activeTab === 'editor' && (
          <Editor
            height="100%"
            language={activeLanguage}
            value={activeCode}
            theme={editorTheme}
            onChange={(val) => {
              if (onChangeCode && val !== undefined) {
                onChangeCode(val);
              }
            }}
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace",
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              renderWhitespace: 'selection',
              automaticLayout: true,
              tabSize: 4,
            }}
          />
        )}

        {/* 2. Monaco Diff Editor */}
        {activeTab === 'diff' && (
          <DiffEditor
            height="100%"
            language={activeLanguage}
            original={originalCode}
            modified={activeCode}
            theme={editorTheme}
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace",
              readOnly: false,
              renderSideBySide: true,
              automaticLayout: true,
            }}
          />
        )}

        {/* 3. Terminal Console */}
        {activeTab === 'terminal' && (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: darkMode ? '#0c0c0e' : '#1e1e1e',
              color: '#10b981',
              fontFamily: "'JetBrains Mono', Menlo, Consolas, monospace",
              p: 2,
              overflowY: 'auto',
            }}
          >
            <Box sx={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {terminalLogs.map((log) => (
                <Box key={log.id} sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#38bdf8', fontSize: '0.82rem' }}>
                    <span>❯</span>
                    <strong>{log.command}</strong>
                    <Typography variant="caption" sx={{ color: '#71717a', ml: 'auto' }}>
                      {log.timestamp}
                    </Typography>
                  </Box>
                  <Box
                    component="pre"
                    sx={{
                      m: 0,
                      mt: 0.5,
                      p: 1.5,
                      bgcolor: 'rgba(0,0,0,0.4)',
                      borderRadius: 1.5,
                      fontSize: '0.78rem',
                      color: log.exitCode === 0 ? '#86efac' : '#fca5a5',
                      whiteSpace: 'pre-wrap',
                      overflowX: 'auto',
                    }}
                  >
                    {log.output}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Terminal Input Bar */}
            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                handleExecuteCommand(customCommand);
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                pt: 1,
                borderTop: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Typography sx={{ color: '#38bdf8', fontSize: '0.9rem', fontWeight: 800 }}>❯</Typography>
              <Box
                component="input"
                value={customCommand}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomCommand(e.target.value)}
                placeholder="Type command (e.g., ./gradlew test, git status)..."
                sx={{
                  flexGrow: 1,
                  bgcolor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#f4f4f5',
                  fontFamily: 'inherit',
                  fontSize: '0.85rem',
                }}
              />
              <Button
                type="submit"
                size="small"
                variant="outlined"
                sx={{
                  color: '#38bdf8',
                  borderColor: '#38bdf8',
                  textTransform: 'none',
                  fontSize: '0.7rem',
                  py: 0.1,
                }}
              >
                Execute
              </Button>
            </Box>
          </Box>
        )}

        {/* 4. Artifacts / Architecture Plans */}
        {activeTab === 'artifacts' && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {artifacts.length > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  p: 1.5,
                  overflowX: 'auto',
                  borderBottom: 1,
                  borderColor: borderColor,
                }}
              >
                {artifacts.map((art, idx) => (
                  <Chip
                    key={art.id}
                    label={art.title}
                    clickable
                    color={selectedArtifactIndex === idx ? 'primary' : 'default'}
                    onClick={() => setSelectedArtifactIndex(idx)}
                    size="small"
                    sx={{ fontSize: '0.72rem' }}
                  />
                ))}
              </Box>
            )}

            <Box sx={{ flexGrow: 1, p: 2.5, overflowY: 'auto' }}>
              {artifacts[selectedArtifactIndex] ? (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem' }}>
                      {artifacts[selectedArtifactIndex].title}
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<CopyIcon />}
                      onClick={() => handleCopy(artifacts[selectedArtifactIndex].codeSnippet)}
                      sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                    >
                      Copy Markdown
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box
                    component="pre"
                    sx={{
                      m: 0,
                      p: 2,
                      bgcolor: darkMode ? '#18181b' : '#f4f4f5',
                      borderRadius: 2,
                      fontFamily: "'JetBrains Mono', Menlo, Consolas, monospace",
                      fontSize: '0.82rem',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      color: darkMode ? '#e4e4e7' : '#27272a',
                    }}
                  >
                    {artifacts[selectedArtifactIndex].codeSnippet}
                  </Box>
                </Box>
              ) : (
                <Typography color="text.secondary">No artifacts generated yet.</Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
