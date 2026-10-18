import { CodeArtifact } from './index';

export type CognitiveStage =
  | 'INTENT_UNDERSTANDING'
  | 'MULTI_HYPOTHESIS_EXPLORATION'
  | 'DEEP_ANALYTICAL_REASONING'
  | 'SELF_CRITIQUE_ENGINE'
  | 'ANSWER_SYNTHESIS';

export type AgentPersonaType =
  | 'ARCHITECT_AGENT'
  | 'BACKEND_AGENT'
  | 'FRONTEND_AGENT'
  | 'SECURITY_AGENT'
  | 'QA_AGENT'
  | 'DEVOPS_AGENT'
  | 'DATABASE_AGENT'
  | 'DOCUMENTATION_AGENT'
  | 'REFACTORING_AGENT'
  | 'PERFORMANCE_AGENT';

export interface DeliberativeReasoningTrace {
  stage: CognitiveStage;
  hypothesesCount: number;
  selfCritiquePassed: boolean;
  confidenceScore: number;
  reasoningSummary: string;
  thoughtSteps: string[];
}

export interface AgentOsTaskStep {
  stepId: string;
  persona: AgentPersonaType;
  action: string;
  outputSnippet: string;
  status: string;
  durationMs: number;
}

export interface AgentOsMetrics {
  totalDurationMs: number;
  tokensGenerated: number;
  tokensPerSecond: number;
  airGappedVerified: boolean;
  zeroMockTestVerified: boolean;
  confidenceScore: number;
}

export interface AgentOsGoalResponse {
  executionId: string;
  goal: string;
  status: string;
  deliberativeTrace: DeliberativeReasoningTrace;
  executedSteps: AgentOsTaskStep[];
  synthesizedArtifacts: CodeArtifact[];
  metrics: AgentOsMetrics;
}

export interface AgentOsGoalRequest {
  goal: string;
  repositoryId?: string;
  userId?: string;
  localFirstAirGapped?: boolean;
  reasoningEffort?: string;
  selectedPersonas?: AgentPersonaType[];
}

export interface OpenAiModelOption {
  id: string;
  specialty: string;
  mode: string;
}
