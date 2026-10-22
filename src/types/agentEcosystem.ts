export type EnterpriseAgentType =
  | 'SOFTWARE_ENGINEER'
  | 'ARCHITECT'
  | 'DEVOPS'
  | 'SECURITY'
  | 'RESEARCH'
  | 'PRODUCT_MANAGER'
  | 'DATA_ENGINEER'
  | 'QA'
  | 'FINANCE'
  | 'CUSTOMER_SUPPORT'
  | 'MARKETING'
  | 'LEGAL_ASSISTANT';

export interface AgentProfile {
  agentType: EnterpriseAgentType;
  displayName: string;
  roleDescription: string;
  primaryTools: string[];
  autonomyLevel: string;
}

export type ExecutionStatus = 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILED' | 'BLOCKED';

export interface AgentReflectionResult {
  stepId: string;
  passed: boolean;
  confidenceScore: number;
  critique: string;
  correction: string;
}

export interface AgentPlanStep {
  stepId: string;
  agentType: EnterpriseAgentType;
  stepDescription: string;
  toolToInvoke: string;
  status: ExecutionStatus;
  output?: string;
  reflection?: AgentReflectionResult;
  retryCount: number;
}

export interface AgentCollaborationEvent {
  eventId: string;
  sourceAgent: EnterpriseAgentType;
  targetAgent: EnterpriseAgentType;
  handoffMessage: string;
  timestamp: string;
}

export interface AgentGoalExecutionPlan {
  planId: string;
  goalTitle: string;
  goalObjective: string;
  currentPhase: string;
  steps: AgentPlanStep[];
  collaborationLog: AgentCollaborationEvent[];
  learnedMemories: string[];
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface PlanGoalRequest {
  goalTitle: string;
  goalObjective: string;
  targetAgents?: EnterpriseAgentType[];
}

export interface ExecutePlanRequest {
  planId: string;
}

export interface ReflectStepRequest {
  stepId: string;
  output: string;
}

export type AgentThreadState = 'IDLE' | 'RUNNING' | 'WAITING' | 'COMPLETED' | 'FAILED';

export interface AgentThreadExecutionRecord {
  threadId: string;
  threadName: string;
  agentType: EnterpriseAgentType;
  taskDescription: string;
  state: AgentThreadState;
  startEpochMs: number;
  executionDurationMs: number;
  outputResult: string;
  memoryAllocatedKb: number;
}

export interface ConcurrentAgentSwarmResult {
  swarmId: string;
  goalTitle: string;
  concurrencyMode: string;
  activeThreadCount: number;
  wallClockDurationMs: number;
  sequentialDurationMs: number;
  speedupFactor: number;
  threadRecords: AgentThreadExecutionRecord[];
  consolidatedArtifacts: string[];
  allPassed: boolean;
}

export interface SwarmExecutionRequest {
  goalTitle: string;
  goalObjective?: string;
  targetAgents?: EnterpriseAgentType[];
}
