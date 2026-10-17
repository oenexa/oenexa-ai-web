// Domain types matching backend Chat, Code, and RAG contracts

export interface CodeContextAttachment {
  filePath: string;
  language?: string;
  startLine?: number;
  endLine?: number;
  content: string;
  branch?: string;
}

export interface CodeArtifact {
  id: string;
  title: string;
  filePath: string;
  language: string;
  code: string;
  action: 'CREATE' | 'PATCH';
}

export interface ToolCall {
  callId: string;
  toolName: string;
  parameters: Record<string, unknown>;
}

export interface ToolResult {
  callId: string;
  toolName: string;
  output: string;
  isError: boolean;
}

export interface UserMemoryRecord {
  memoryId?: string;
  userId: string;
  tenantId?: string;
  memoryKey: string;
  memoryValue: string;
  category?: string;
  confidence?: number;
  learnedAt?: string;
}

export interface ProjectKnowledgeChunk {
  chunkId: string;
  repositoryId: string;
  filePath: string;
  language: string;
  chunkIndex: number;
  content: string;
  embedding: number[];
  symbols: Record<string, string>;
  createdAt: string;
}

export interface RepositoryKnowledgeMap {
  repositoryId: string;
  primaryStack: string;
  detectedTechnologies: string[];
  modules: string[];
  fileTree: string[];
  symbolIndex: Record<string, string>;
  vectorChunksCount: number;
}

export interface AgentCollaborationTask {
  taskId: string;
  agentType: string;
  taskDescription: string;
  inputPayload: string;
  outputResult: string;
  status: string;
  timestamp: string;
}

export interface ConversationMetadata {
  conversationId: string;
  tenantId: string;
  title: string;
  model: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  pinned: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'You' | 'AI Engineer';
  role: 'USER' | 'ASSISTANT' | 'TOOL';
  content: string;
  thoughtProcess?: string;
  model?: string;
  provider?: string;
  taskType?: string;
  contextSummary?: string;
  attachments?: CodeContextAttachment[];
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
  artifacts?: CodeArtifact[];
  citations?: ProjectKnowledgeChunk[];
  confidenceScore?: number;
  rankingScore?: number;
  followUps?: string[];
  intent?: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface ModuleInfo {
  id: string;
  displayName: string;
  description: string;
  capabilities: string[];
  status: 'ACTIVE' | 'PLANNED';
}

export type MultimodalType = 'IMAGE' | 'AUDIO_VOICE' | 'FILE_DOCUMENT';

export interface MultimodalAttachment {
  id: string;
  type: MultimodalType;
  fileName: string;
  mimeType: string;
  base64DataOrUrl?: string;
  extractedTextOrTranscript?: string;
  uploadedAt: string;
}
