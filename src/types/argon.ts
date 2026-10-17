// Google Gemini 4 Argon Autonomous Agent Contracts
import { CodeArtifact } from './chat';

export interface ArgonPlanStep {
  stepId: string;
  agentPersona: string;
  description: string;
  toolToInvoke?: string;
  status: string;
  output?: string;
  retryCount: number;
}

export interface ArgonExecutionEvent {
  eventId: string;
  goalId: string;
  phase: string;
  agentPersona: string;
  thoughtProcess?: string;
  toolAction?: string;
  outputSnippet?: string;
  status: string;
  timestamp: string;
}

export interface ArgonSelfHealingCycle {
  cycleId: string;
  goalId: string;
  issueDetected: string;
  rootCause: string;
  patchDiff: string;
  resolved: boolean;
  timestamp: string;
}

export interface ArgonAgentPlan {
  planId: string;
  goalId: string;
  goalDescription: string;
  steps: ArgonPlanStep[];
  currentPhase: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStory {
  id: string;
  title: string;
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string[];
  storyPoints: number;
  status: string;
}

export interface ProductRequirementsDocument {
  prdId: string;
  title: string;
  targetAudience: string;
  problemStatement: string;
  keyFeatures: string[];
  userStories: UserStory[];
  technicalConstraints: string[];
  releaseRoadmap: string;
  createdAt: string;
}

export interface LocalPrivacyConfig {
  localOnlyMode: boolean;
  telemetryDisabled: boolean;
  localModelEndpoint: string;
  selectedLocalModel: string;
  maxVramAllocationMb: number;
  airGappedVerification: boolean;
}

export interface ArgonAutonomousGoalResponse {
  goalId: string;
  goalDescription: string;
  plan: ArgonAgentPlan;
  events: ArgonExecutionEvent[];
  selfHealingCycles: ArgonSelfHealingCycle[];
  artifacts: CodeArtifact[];
  userStories?: UserStory[];
  prd?: ProductRequirementsDocument;
  privacyAudit?: LocalPrivacyConfig;
  confidenceScore: number;
  finalSummary: string;
  completedAt: string;
}
