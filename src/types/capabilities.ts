// Target Capabilities (Claude, Gemini, Cursor, Devin, Copilot, Operator) Domain Types
import { MultimodalAttachment } from './chat';

export interface HypothesisBranch {
  branchId: string;
  hypothesis: string;
  rationale: string;
  pros: string[];
  cons: string[];
  architecturalScore: number;
  feasibilityScore: number;
  confidenceScore: number;
}

export interface ClaudeReasoningTrace {
  traceId: string;
  objective: string;
  hypotheses: HypothesisBranch[];
  selectedBranch: HypothesisBranch;
  tradeOffAnalysis: string;
  reflectionVerdict: string;
  calibratedConfidence: number;
  timestamp: string;
}

export interface DetectedComponent {
  id: string;
  name: string;
  layerType: string;
  boundingBox: string;
  downstreamTargets: string[];
}

export interface MultimodalVisionAnalysis {
  analysisId: string;
  diagramType: string;
  detectedLayers: string[];
  components: DetectedComponent[];
  synthesizedMermaidOrC4: string;
  synthesizedCodeOrDdl: string;
  confidence: number;
}

export interface MultimodalAudioAnalysis {
  analysisId: string;
  audioLengthSeconds: number;
  transcript: string;
  developerIntent: string;
  extractedDirectives: string[];
  confidence: number;
}

export interface MultimodalUnifiedContext {
  contextId: string;
  audioContext: MultimodalAudioAnalysis;
  visualContext: MultimodalVisionAnalysis;
  documentContexts: MultimodalAttachment[];
  unifiedEngineeringBrief: string;
  createdAt: string;
}

export type CursorContextType = 'FILE' | 'FOLDER' | 'SYMBOL' | 'GIT_DIFF' | 'CODEBASE_INDEX';

export interface CursorContextReference {
  refId: string;
  type: CursorContextType;
  targetPathOrSymbol: string;
  extractedSnippet: string;
  relevanceScore: number;
}

export interface FileDiff {
  filePath: string;
  originalHash: string;
  patchContent: string;
  action: string;
}

export interface AtomicMultiFilePatch {
  patchId: string;
  description: string;
  fileDiffs: FileDiff[];
  affectedSymbols: string[];
  rollbackSafe: boolean;
  createdAt: string;
}

export interface DevinExecutionStage {
  stageId: string;
  name: string;
  commandExecuted: string;
  outputLog: string;
  status: string;
  retryAttempt: number;
  timestamp: string;
}

export interface DevinTaskExecutionPlan {
  taskId: string;
  goal: string;
  repositoryId: string;
  stages: DevinExecutionStage[];
  buildPassed: boolean;
  zeroMockVerificationPassed: boolean;
  appliedPatch?: AtomicMultiFilePatch;
  finalSummary: string;
  completedAt: string;
}

export interface CopilotCompletionItem {
  text: string;
  label: string;
  kind: string;
  documentation: string;
  confidence: number;
}

export interface CopilotCompletionResponse {
  completionId: string;
  suggestions: CopilotCompletionItem[];
  ghostText: string;
  generationLatencyMs: number;
  confidenceScore: number;
}

export type OperatorActionType =
  | 'CLI_COMMAND'
  | 'DOCKER_BUILD'
  | 'K8S_DEPLOY'
  | 'DB_MIGRATION'
  | 'SAST_SECURITY_SCAN'
  | 'TEST_VERIFICATION'
  | 'API_CALL';

export interface OperatorAction {
  actionId: string;
  actionType: OperatorActionType;
  targetResource: string;
  payload: Record<string, string>;
  resultStatus: string;
  executionOutput: string;
  timestamp: string;
}

export interface OperatorWorkflow {
  workflowId: string;
  title: string;
  objective: string;
  actions: OperatorAction[];
  status: string;
  startedAt: string;
  completedAt: string;
}

export interface TargetCapabilitiesOverview {
  claudeReasoningActive: boolean;
  geminiMultimodalActive: boolean;
  cursorCodingActive: boolean;
  devinExecutionActive: boolean;
  copilotCompletionActive: boolean;
  operatorAutomationActive: boolean;
  platformVersion: string;
  overallConfidenceScore: number;
}
