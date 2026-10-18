// Compatibility mapping: OpenAI domain types alias to pure-own OENEXA Cognitive & Agent OS types
import {
  OenexaCognitiveStage,
  OenexaAgentPersonaType,
  OenexaDeliberativeTrace,
  OenexaAgentOsTaskStep,
  OenexaAgentOsMetrics,
  OenexaAgentOsGoalResponse,
  OenexaAgentOsGoalRequest,
  OenexaCognitiveModelOption,
} from './oenexaCognitiveTypes';

export type CognitiveStage = OenexaCognitiveStage;
export type AgentPersonaType = OenexaAgentPersonaType;
export type DeliberativeReasoningTrace = OenexaDeliberativeTrace;
export type AgentOsTaskStep = OenexaAgentOsTaskStep;
export type AgentOsMetrics = OenexaAgentOsMetrics;
export type AgentOsGoalResponse = OenexaAgentOsGoalResponse;
export type AgentOsGoalRequest = OenexaAgentOsGoalRequest;
export type OpenAiModelOption = OenexaCognitiveModelOption;
