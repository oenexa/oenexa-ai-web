export type OptimizationStrategy =
  | 'AUTO'
  | 'COST_OPTIMIZED'
  | 'SPEED_OPTIMIZED'
  | 'QUALITY_REASONING'
  | 'MULTI_MODEL_COLLABORATION';

export type FallbackStatus =
  | 'PRIMARY_SUCCESS'
  | 'SECONDARY_FAILOVER'
  | 'LOCAL_AIR_GAPPED_FAILOVER'
  | 'ALL_FAILED';

export interface AiModelSpec {
  modelId: string;
  name: string;
  provider: string;
  contextWindowTokens: number;
  costPerMillionTokensUsd: number;
  avgLatencyMs: number;
  capabilities: string[];
  isAvailable: boolean;
  isLocal: boolean;
}

export interface SmartFallbackChain {
  primaryModelId: string;
  secondaryModelId: string;
  localAirGappedModelId: string;
}

export interface RoutingDecisionResult {
  selectedModelId: string;
  modelName: string;
  provider: string;
  detectedTask: string;
  strategyUsed: OptimizationStrategy;
  estimatedCostPerMillionTokensUsd: number;
  estimatedLatencyMs: number;
  rationale: string;
  fallbackChain: SmartFallbackChain;
}

export interface MultiModelCollaborationTurn {
  turnId: string;
  architectModel: string;
  architectBlueprint: string;
  coderModel: string;
  coderImplementation: string;
  securityModel: string;
  securityAudit: string;
  synthesizedFinalResponse: string;
  contributingModels: string[];
  timestamp: string;
}

export interface ExecutionWithFallbackResult {
  conversationId: string;
  executedModelId: string;
  executedProvider: string;
  fallbackStatus: FallbackStatus;
  failoverAttempts: number;
  responseContent: string;
  thoughtProcess: string;
  executionTrace: string[];
  timestamp: string;
}
