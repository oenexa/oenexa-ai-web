/**
 * Enterprise Core Brain Types for OENEXA V4.
 * Aligns with backend OenexaCoreBrainDomain and CoreBrainDtos.
 */

export type CoreModuleType =
  | 'AI_GATEWAY'
  | 'MODEL_ROUTER'
  | 'REASONING_ENGINE'
  | 'AGENT_ENGINE'
  | 'MEMORY_ENGINE'
  | 'KNOWLEDGE_ENGINE'
  | 'TOOL_EXECUTION_ENGINE'
  | 'SELF_IMPROVEMENT_ENGINE'
  | 'CODE_INTELLIGENCE_ENGINE'
  | 'SECURITY_ENGINE'
  | 'PERFORMANCE_ENGINE'
  | 'OBSERVABILITY_ENGINE';

export type CoreModuleStatus = 'HEALTHY' | 'DEGRADED' | 'OPTIMIZING';

export interface CoreModuleInfo {
  type: CoreModuleType;
  displayName: string;
  mission: string;
  status: CoreModuleStatus;
  healthScore: number;
  processedRequests: number;
}

export interface CoreBrainDirective {
  directiveId?: string;
  tenantId?: string;
  userId?: string;
  objective: string;
  preferredModel?: string;
  localFirstRequired?: boolean;
  reasoningEffort?: 'low' | 'medium' | 'high';
  parameters?: Record<string, unknown>;
}

export interface GatewayRoutingDecision {
  selectedModel: string;
  provider: string;
  isLocalFirst: boolean;
  estimatedLatencyMs: number;
  securityCleared: boolean;
}

export interface SecurityAssessment {
  allowed: boolean;
  threatScore: number;
  threatClassification: string;
  integrityHash: string;
  checkedAt?: string;
}

export interface PerformanceSnapshot {
  cacheHit: boolean;
  compressionRatio: number;
  activeVirtualThreads: number;
  memoryAllocatedBytes: number;
  durationMs: number;
}

export interface ObservabilitySpan {
  traceId: string;
  spanId: string;
  engineName: string;
  operation: string;
  durationMs: number;
  status: string;
  tags?: Record<string, string>;
}

export interface CoreBrainSynthesis {
  directiveId: string;
  status: string;
  directive: CoreBrainDirective;
  routingDecision: GatewayRoutingDecision;
  securityAssessment: SecurityAssessment;
  reasoningSteps: string[];
  synthesizedArtifacts: Array<{
    id: string;
    title: string;
    language: string;
    code: string;
    explanation?: string;
  }>;
  performanceSnapshot: PerformanceSnapshot;
  telemetrySpan: ObservabilitySpan;
  confidenceScore: number;
}

export interface CoreBrainDirectiveResultDto {
  executionId: string;
  status: string;
  planSummary: string;
  executedPhases: string[];
  confidenceScore: number;
}

export interface IssueDetectionRequestDto {
  errorTrace: string;
  component: string;
  environment?: string;
  severity?: string;
}

export interface IssueResolutionResultDto {
  issueId: string;
  rootCause: string;
  resolutionPlan: string;
  autoHealed: boolean;
  patchDiff: string;
}

export interface SelfHealingTriggerRequestDto {
  cycleId: string;
  failureType: string;
  affectedResource?: string;
}

export interface SelfHealingStatusDto {
  cycleId: string;
  status: string;
  attemptCount: number;
  restored: boolean;
}
