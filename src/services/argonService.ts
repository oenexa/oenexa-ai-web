import { oenexaAgentService, LaunchOenexaGoalParams } from './oenexaAgentService';
import { ArgonAutonomousGoalResponse, ArgonSelfHealingCycle } from '../types';

export type LaunchArgonGoalParams = LaunchOenexaGoalParams;

export const argonService = {
  async launchGoal(params: LaunchArgonGoalParams): Promise<ArgonAutonomousGoalResponse> {
    return oenexaAgentService.launchGoal(params);
  },

  async triggerSelfHealing(
    goalId: string,
    issueDetected: string,
    rootCause?: string,
    token?: string | null
  ): Promise<ArgonSelfHealingCycle> {
    return oenexaAgentService.triggerSelfHealing(goalId, issueDetected, rootCause, token);
  },
};
