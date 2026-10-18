// Compatibility mapping: Argon types alias to pure-own OENEXA autonomous agent types
import {
  OenexaPlanStep,
  OenexaExecutionEvent,
  OenexaSelfHealingCycle,
  OenexaAgentPlan,
  OenexaAutonomousGoalResponse,
  UserStory,
  ProductRequirementsDocument,
  LocalPrivacyConfig
} from './oenexaAgent';

export type ArgonPlanStep = OenexaPlanStep;
export type ArgonExecutionEvent = OenexaExecutionEvent;
export type ArgonSelfHealingCycle = OenexaSelfHealingCycle;
export type ArgonAgentPlan = OenexaAgentPlan;
export type ArgonAutonomousGoalResponse = OenexaAutonomousGoalResponse;

export type { UserStory, ProductRequirementsDocument, LocalPrivacyConfig };
