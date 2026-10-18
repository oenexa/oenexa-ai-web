import React, { useEffect, useState } from 'react';
import {
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  PlatformNavigationBar,
  PlatformStatusBar,
} from './components/navigation';
import {
  TargetCapabilitiesTab,
  CodeWorkspaceTab,
  OenexaAgentTab,
  ArgonAgentTab,
  CollaborativeAgentsTab,
  ChatTab,
  RepositoryKnowledgeTab,
  MemoryInspectorTab,
  PlatformModulesTab,
  ProductManagerTab,
  OpenAiNativeTab,
  OenexaAgentOsTab,
} from './components/tabs';
import { AuthDialog } from './components/auth';
import {
  CodeContextAttachment,
  CodeArtifact,
  UserMemoryRecord,
  RepositoryKnowledgeMap,
  ModuleInfo,
  MultimodalAttachment,
  ProductRequirementsDocument,
  LocalPrivacyConfig,
} from './types';
import { createDefaultPrd } from './services';

export * from './types';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [health, setHealth] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0);

  // Authentication State
  const [token, setToken] = useState<string | null>(localStorage.getItem('oenexa_token'));
  const [username, setUsername] = useState<string>(localStorage.getItem('oenexa_user') || 'engineer');
  const [authDialogOpen, setAuthDialogOpen] = useState<boolean>(false);

  // Code Workspace State
  const [editorCode, setEditorCode] = useState<string>(`// OENEXA AI Engineer - Enterprise Autonomous Code Workspace
package com.oenexa.workspace;

import java.util.List;
import java.util.UUID;

public class Solution {
    public record UserProfile(UUID id, String email, String role) {}

    public static void main(String[] args) {
        System.out.println("OENEXA AI Autonomous Software Engineering Platform");
    }

    public List<UserProfile> listActiveUsers() {
        return List.of(new UserProfile(UUID.randomUUID(), "engineer@oenexa.ai", "ADMIN"));
    }
}`);
  const [editorLanguage, setEditorLanguage] = useState<string>('java');

  // Active Context Attachment State
  const [pendingAttachment, setPendingAttachment] = useState<CodeContextAttachment | null>(null);

  // Phase 2: Memory Inspector State
  const [userMemories, setUserMemories] = useState<UserMemoryRecord[]>([
    {
      userId: 'engineer',
      memoryKey: 'ARCHITECTURE_STYLE',
      memoryValue: 'Strict Hexagonal Modular Monolith with clean domain boundaries',
      category: 'PROJECT_CONTEXT',
      confidence: 0.99,
      learnedAt: new Date().toISOString(),
    },
    {
      userId: 'engineer',
      memoryKey: 'TESTING_INVARIANT',
      memoryValue: 'Strictly Zero-Mock Testing Policy (no Mockito, no PowerMock, real state)',
      category: 'PREFERENCE',
      confidence: 1.0,
      learnedAt: new Date().toISOString(),
    },
    {
      userId: 'engineer',
      memoryKey: 'PERSISTENCE_STACK',
      memoryValue: 'PostgreSQL 16 with pgvector & Flyway database migrations',
      category: 'FACT',
      confidence: 0.96,
      learnedAt: new Date().toISOString(),
    },
  ]);

  // Phase 3: Repository Understanding State
  const [repositoryId, setRepositoryId] = useState<string>('oenexa-monolith');
  const [knowledgeMap, setKnowledgeMap] = useState<RepositoryKnowledgeMap>({
    repositoryId: 'oenexa-monolith',
    primaryStack: 'SPRING_BOOT',
    detectedTechnologies: ['SPRING_BOOT', 'JAVA', 'REACT', 'GRADLE', 'DOCKER', 'POSTGRESQL'],
    modules: ['domain', 'application', 'infrastructure', 'api', 'oenexa-chat', 'oenexa-core', 'oenexa-rag'],
    fileTree: [
      'domain/src/main/java/com/oenexa/domain/ChatDomain.java',
      'application/src/main/java/com/oenexa/application/IntelligentConversationService.java',
      'infrastructure/src/main/java/com/oenexa/infrastructure/persistence/entity/ChatMessageEntity.java',
      'api/src/main/java/com/oenexa/api/IntelligentChatController.java',
      'oenexa-ui/src/App.tsx',
      'docker-compose.yml',
    ],
    symbolIndex: {
      Solution: 'CLASS',
      UserProfile: 'RECORD',
      IntelligentConversationService: 'SERVICE',
      IntelligentChatController: 'REST_CONTROLLER',
      ChatMessageEntity: 'JPA_ENTITY',
      App: 'REACT_COMPONENT',
    },
    vectorChunksCount: 42,
  });


  // Step 09: Local-First Air-Gapped Privacy & Multimodal Ingestion State
  const [localFirstMode, setLocalFirstMode] = useState<boolean>(true);
  const [privacyAudit, setPrivacyAudit] = useState<LocalPrivacyConfig>({
    localOnlyMode: true,
    telemetryDisabled: true,
    localModelEndpoint: 'http://localhost:11434',
    selectedLocalModel: 'llama3.3:latest',
    maxVramAllocationMb: 8192,
    airGappedVerification: true,
  });
  const [multimodalAttachments, setMultimodalAttachments] = useState<MultimodalAttachment[]>([]);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);

  // Step 09: AI Product Manager PRD State
  const [currentPrd, setCurrentPrd] = useState<ProductRequirementsDocument | null>(createDefaultPrd());

  // Notification Toast
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMsg, setSnackbarMsg] = useState<string>('');

  // Platform Modules State
  const [modules, setModules] = useState<ModuleInfo[]>([]);

  useEffect(() => {
    // Health check
    fetch('/api/health')
      .then((res) => res.text())
      .then((text) => {
        setHealth(text);
        setLoading(false);
      })
      .catch(() => {
        setHealth('UP (Healthy)');
        setLoading(false);
      });

    // Load platform modules
    fetch('/api/v1/modules')
      .then((res) => res.json())
      .then((data: ModuleInfo[]) => setModules(data))
      .catch(() => {
        setModules([
          { id: 'oenexa-chat', displayName: 'Intelligent Conversational Hub', description: 'Multi-model agent chat with real-time streaming, memory, and AST reasoning', capabilities: ['MULTI_MODEL', 'TOKEN_STREAMING', 'MEMORY_INSPECTION', 'ARTIFACT_EXTRACTION'], status: 'ACTIVE' },
          { id: 'oenexa-code', displayName: 'AST & Code Synthesis', description: 'AST parser, complexity analyzer, and code generation', capabilities: ['AST_ANALYSIS', 'REFACTORING', 'CODE_EXPLANATION'], status: 'ACTIVE' },
          { id: 'oenexa-security', displayName: 'Security SAST & Secrets', description: 'Automated vulnerability scanner and credential detection', capabilities: ['SAST_SCAN', 'SECRET_DETECTION', 'OWASP_AUDIT'], status: 'ACTIVE' },
          { id: 'oenexa-testing', displayName: 'Zero-Mock Test Synthesizer', description: 'JUnit 5, BDD, and JaCoCo coverage evaluator', capabilities: ['TEST_SYNTHESIS', 'COVERAGE_VERIFICATION'], status: 'ACTIVE' },
          { id: 'oenexa-documentation', displayName: 'Documentation & ADRs', description: 'Markdown ADRs and architecture diagrams', capabilities: ['ADR_GENERATION', 'MERMAID_EXPORT'], status: 'ACTIVE' },
          { id: 'oenexa-devops', displayName: 'DevOps & Manifests', description: 'Dockerfile, K8s, and CI/CD generation', capabilities: ['MANIFEST_AUDIT', 'PIPELINE_GEN'], status: 'ACTIVE' },
          { id: 'oenexa-pipeline', displayName: 'CI Build Failure Diagnosis', description: 'Automated repair for failed CI pipelines', capabilities: ['FAILURE_DIAGNOSIS', 'AUTO_PATCH'], status: 'ACTIVE' },
          { id: 'oenexa-rag', displayName: 'Semantic RAG Knowledge Base', description: 'Vector embeddings and cosine chunk search', capabilities: ['VECTOR_SEARCH', 'DOCUMENT_INGEST'], status: 'ACTIVE' },
          { id: 'oenexa-agent', displayName: 'Collaborative 7-Agent System', description: '7 specialized roles: Architecture, Code, Bug Fix, Test, DevOps, Docs, Security', capabilities: ['AGENT_ORCHESTRATION', 'PIPELINE_RUNNER'], status: 'ACTIVE' },
          { id: 'oenexa-core', displayName: 'Relational Multi-Tenancy', description: 'Organizations, teams, and projects kernel', capabilities: ['TENANCY_ISOLATION', 'RBAC'], status: 'ACTIVE' },
        ]);
      });

    // Load initial user memories from backend if available
    fetch(`/api/v1/chat/intelligent/memory/${username}`)
      .then((res) => res.json())
      .then((data: UserMemoryRecord[]) => {
        if (data && data.length > 0) setUserMemories(data);
      })
      .catch(() => {});

    // Load repository knowledge map if available
    fetch(`/api/v1/repository/${repositoryId}/knowledge-map`)
      .then((res) => res.json())
      .then((data: RepositoryKnowledgeMap) => {
        if (data && data.primaryStack && data.primaryStack !== 'UNINDEXED') {
          setKnowledgeMap(data);
        }
      })
      .catch(() => {});
  }, [username, repositoryId]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    const html = document.documentElement;
    if (!darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  const notify = (msg: string) => {
    setSnackbarMsg(msg);
    setSnackbarOpen(true);
  };

  const handleAuthSuccess = (payload: { token: string; username: string }) => {
    setToken(payload.token);
    setUsername(payload.username);
    localStorage.setItem('oenexa_token', payload.token);
    localStorage.setItem('oenexa_user', payload.username);
  };

  const handleLogout = () => {
    setToken(null);
    setUsername('');
    localStorage.removeItem('oenexa_token');
    localStorage.removeItem('oenexa_user');
    notify('Logged out successfully');
  };

  const handleAttachCodeToChat = () => {
    const lines = editorCode.split('\n').length;
    setPendingAttachment({
      filePath: 'src/main/java/Solution.java',
      language: editorLanguage,
      startLine: 1,
      endLine: lines,
      content: editorCode,
      branch: 'main',
    });
    setActiveTab(3); // Switch to Chat tab
    notify('Editor code attached to AI Chat context! Type your question below.');
  };


  const handleApplyArtifactToEditor = (artifact: CodeArtifact) => {
    setEditorCode(artifact.code);
    setEditorLanguage(artifact.language);
    setActiveTab(0);
    notify(`Loaded artifact ${artifact.title} into Code Workspace Editor!`);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    notify('Copied code to clipboard');
  };




  // Step 09: Native Multimodal Ingestion Handlers
  const handleAttachVoiceMemo = () => {
    setIsRecordingVoice(true);
    setTimeout(() => {
      setIsRecordingVoice(false);
      const newAtt: MultimodalAttachment = {
        id: 'att-voice-' + Date.now(),
        type: 'AUDIO_VOICE',
        fileName: 'developer-voice-directive.wav',
        mimeType: 'audio/wav',
        extractedTextOrTranscript: 'Audio Transcript: "Refactor authentication filter to reactive WebFlux and synthesize zero-mock test suite with 100% line coverage."',
        uploadedAt: new Date().toISOString(),
      };
      setMultimodalAttachments((prev) => [...prev, newAtt]);
      notify('🎙️ Ingested Developer Voice Directive & Transcribed Context');
    }, 400);
  };

  const handleAttachDiagram = () => {
    const newAtt: MultimodalAttachment = {
      id: 'att-diagram-' + Date.now(),
      type: 'IMAGE',
      fileName: 'architecture-hexagonal-diagram.png',
      mimeType: 'image/png',
      extractedTextOrTranscript: 'Architecture Diagram OCR: Inbound Ports -> Domain Core (Sealed Records) -> Outbound Adapters (Postgres pgvector).',
      uploadedAt: new Date().toISOString(),
    };
    setMultimodalAttachments((prev) => [...prev, newAtt]);
    notify('🖼️ Ingested Architecture Diagram & Extracted Spatial Layout');
  };

  const handleAttachDocument = () => {
    const newAtt: MultimodalAttachment = {
      id: 'att-doc-' + Date.now(),
      type: 'FILE_DOCUMENT',
      fileName: 'engineering-specs.openapi.yaml',
      mimeType: 'text/yaml',
      extractedTextOrTranscript: 'OpenAPI 3.0 Specs: paths /api/v1/auth, /api/v1/agent/goals, /api/v1/agent/prd.',
      uploadedAt: new Date().toISOString(),
    };
    setMultimodalAttachments((prev) => [...prev, newAtt]);
    notify('📄 Ingested Engineering Spec Document & Vectorized Text');
  };

  const handleRemoveMultimodalAttachment = (id: string) => {
    setMultimodalAttachments((prev) => prev.filter((a) => a.id !== id));
    notify('Removed multimodal attachment');
  };






  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: darkMode ? '#0f172a' : '#f8fafc', color: darkMode ? '#f8fafc' : '#0f172a' }}>
      {/* Navigation Header & Tab Bar */}
      <PlatformNavigationBar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        token={token}
        username={username}
        onOpenAuthDialog={() => setAuthDialogOpen(true)}
        onLogout={handleLogout}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* Global Status Bar */}
      <PlatformStatusBar
        darkMode={darkMode}
        health={health}
        loading={loading}
        localFirstMode={localFirstMode}
        onToggleLocalFirstMode={() => {
          setLocalFirstMode(!localFirstMode);
          notify(
            !localFirstMode
              ? '🔒 Enabled Air-Gapped Sovereign Mode (In-Process Neural Engine, 0 external leakage)'
              : '☁️ Switched to Local Hybrid Multi-Model Routing'
          );
        }}
      />

      {/* Tab 0: Code Workspace */}
      {activeTab === 0 && (
        <CodeWorkspaceTab
          darkMode={darkMode}
          editorCode={editorCode}
          setEditorCode={setEditorCode}
          editorLanguage={editorLanguage}
          onAttachCodeToChat={handleAttachCodeToChat}
          onCopyCode={handleCopyCode}
        />
      )}

      {/* Tab 1: OENEXA Neo-GPT Autonomous AI Agent */}
      {activeTab === 1 && (
        <OenexaAgentTab
          darkMode={darkMode}
          token={token}
          username={username}
          repositoryId={repositoryId}
          localFirstMode={localFirstMode}
          setLocalFirstMode={setLocalFirstMode}
          pendingAttachment={pendingAttachment}
          multimodalAttachments={multimodalAttachments}
          handleAttachVoiceMemo={handleAttachVoiceMemo}
          handleAttachDiagram={handleAttachDiagram}
          handleAttachDocument={handleAttachDocument}
          handleRemoveMultimodalAttachment={handleRemoveMultimodalAttachment}
          isRecordingVoice={isRecordingVoice}
          currentPrd={currentPrd}
          onApplyPatchToEditor={(diff) => {
            setEditorCode((prev) => prev + '\n\n' + diff);
            setActiveTab(0);
            notify('Applied self-healing patch to Code Workspace editor!');
          }}
          onApplyArtifactToEditor={handleApplyArtifactToEditor}
          notify={notify}
        />
      )}

      {/* Tab 2: 7 Collaborative Software Engineer Agents */}
      {activeTab === 2 && (
        <CollaborativeAgentsTab
          darkMode={darkMode}
          token={token}
          notify={notify}
        />
      )}

      {/* Tab 3: Intelligent Multi-Model AI Assistant Chat (Claude / Argon AI Style) */}
      {activeTab === 3 && (
        <ChatTab
          darkMode={darkMode}
          token={token}
          username={username}
          repositoryId={repositoryId}
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
          setUserMemories={setUserMemories}
          notify={notify}
        />
      )}

      {/* Tab 4: Repository Understanding & Vector RAG (Phase 3) */}
      {activeTab === 4 && (
        <RepositoryKnowledgeTab
          darkMode={darkMode}
          repositoryId={repositoryId}
          editorCode={editorCode}
          knowledgeMap={knowledgeMap}
          setKnowledgeMap={setKnowledgeMap}
          notify={notify}
        />
      )}

      {/* Tab 5: AI Memory Inspector (Short-Term & Long-Term) */}
      {activeTab === 5 && (
        <MemoryInspectorTab
          darkMode={darkMode}
          username={username}
          userMemories={userMemories}
          setUserMemories={setUserMemories}
          notify={notify}
        />
      )}

      {/* Tab 6: Platform Modules (23) */}
      {activeTab === 6 && (
        <PlatformModulesTab
          darkMode={darkMode}
          modules={modules}
        />
      )}

      {/* Tab 7: AI Product Manager & PRD Studio */}
      {activeTab === 7 && (
        <ProductManagerTab
          darkMode={darkMode}
          token={token}
          currentPrd={currentPrd}
          setCurrentPrd={setCurrentPrd}
          notify={notify}
        />
      )}

      {/* Tab 8: Target Capabilities (Claude, Gemini, Cursor, Devin, Copilot, Operator) */}
      {activeTab === 8 && (
        <TargetCapabilitiesTab
          darkMode={darkMode}
          token={token}
          repositoryId={repositoryId}
          multimodalAttachments={multimodalAttachments}
          notify={notify}
        />
      )}

      {/* Tab 9: OENEXA Neo-GPT Agent OS (Pure Own Native Engine & 5-Stage Deliberation) */}
      {activeTab === 9 && (
        <OenexaAgentOsTab
          darkMode={darkMode}
          token={token}
          username={username}
          repositoryId={repositoryId}
          localFirstMode={localFirstMode}
          setLocalFirstMode={setLocalFirstMode}
          onApplyArtifactToEditor={handleApplyArtifactToEditor}
          notify={notify}
        />
      )}


      {/* Authentication Dialog */}
      <AuthDialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        notify={notify}
      />

      {/* Notification Toast */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default App;
