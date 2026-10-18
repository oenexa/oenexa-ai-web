import { AgentOsGoalRequest, AgentOsGoalResponse, OpenAiModelOption } from '../types';
import { oenexaCognitiveService } from './oenexaCognitiveService';

export const openAiNativeService = {
  executeGoal: async (payload: AgentOsGoalRequest, token?: string | null): Promise<AgentOsGoalResponse> => {
    return oenexaCognitiveService.executeGoal(payload, token);
  },

  listModels: async (): Promise<OpenAiModelOption[]> => {
    return oenexaCognitiveService.listModels();
  },
};
