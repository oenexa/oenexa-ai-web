import { CodeArtifact } from './index';

export type OenexaCognitiveStage =
  | 'INTENT_UNDERSTANDING'
  | 'MULTI_HYPOTHESIS_EXPLORATION'
  | 'DEEP_ANALYTICAL_REASONING'
  | 'SELF_CRITIQUE_ENGINE'
  | 'ANSWER_SYNTHESIS';

export type OenexaAgentPersonaType =
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

export interface OenexaDeliberativeTrace {
  stage: OenexaCognitiveStage;
  hypothesesCount: number;
  selfCritiquePassed: boolean;
  confidenceScore: number;
  reasoningSummary: string;
  thoughtSteps: string[];
}

export interface OenexaAgentOsTaskStep {
  stepId: string;
  persona: OenexaAgentPersonaType;
  action: string;
  outputSnippet: string;
  status: string;
  durationMs: number;
}

export interface OenexaAgentOsMetrics {
  totalDurationMs: number;
  tokensGenerated: number;
  tokensPerSecond: number;
  airGappedVerified: boolean;
  zeroMockTestVerified: boolean;
  confidenceScore: number;
}

export interface OenexaAgentOsGoalResponse {
  executionId: string;
  goal: string;
  status: string;
  deliberativeTrace: OenexaDeliberativeTrace;
  executedSteps: OenexaAgentOsTaskStep[];
  synthesizedArtifacts: CodeArtifact[];
  metrics: OenexaAgentOsMetrics;
}

export interface OenexaAgentOsGoalRequest {
  goal: string;
  repositoryId?: string;
  userId?: string;
  localFirstAirGapped?: boolean;
  sovereignAirGapped?: boolean;
  reasoningEffort?: string;
  selectedPersonas?: OenexaAgentPersonaType[];
}

export interface OenexaCognitiveModelOption {
  id: string;
  specialty: string;
  mode: string;
}
