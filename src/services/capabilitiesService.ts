import {
  ClaudeReasoningTrace,
  MultimodalVisionAnalysis,
  MultimodalAudioAnalysis,
  MultimodalUnifiedContext,
  CursorContextReference,
  AtomicMultiFilePatch,
  DevinTaskExecutionPlan,
  CopilotCompletionResponse,
  OperatorWorkflow,
  MultimodalAttachment,
  OperatorActionType,
} from '../types';
import {
  analyzeClaudeReasoning,
  fuseMultimodalContext,
  curateCursorContext,
  generateCursorPatch,
  executeDevinTask,
  generateCopilotCompletion,
  executeOperatorWorkflow,
} from './capabilities';

export * from './capabilities';

export const capabilitiesService = {
  async fetchOverview(token?: string | null) {
    const res = await fetch('/api/v1/capabilities/overview', {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) throw new Error('Overview error');
    return res.json();
  },

  async analyzeClaudeReasoning(
    objective: string,
    codeContext: string,
    token?: string | null
  ): Promise<ClaudeReasoningTrace> {
    return analyzeClaudeReasoning(objective, codeContext, token);
  },

  async fuseMultimodalContext(
    audio: MultimodalAudioAnalysis | null,
    vision: MultimodalVisionAnalysis | null,
    specDocuments: MultimodalAttachment[],
    contextualTitle: string,
    token?: string | null
  ): Promise<MultimodalUnifiedContext> {
    return fuseMultimodalContext(audio, vision, specDocuments, contextualTitle, token);
  },

  async curateCursorContext(
    promptOrQuery: string,
    repositoryId: string,
    token?: string | null
  ): Promise<CursorContextReference[]> {
    return curateCursorContext(promptOrQuery, repositoryId, token);
  },

  async generateCursorPatch(
    objective: string,
    targetFilePaths: string[],
    token?: string | null
  ): Promise<AtomicMultiFilePatch> {
    return generateCursorPatch(objective, targetFilePaths, token);
  },

  async executeDevinTask(
    taskGoal: string,
    repositoryId: string,
    enforceZeroMockPolicy: boolean,
    token?: string | null
  ): Promise<DevinTaskExecutionPlan> {
    return executeDevinTask(taskGoal, repositoryId, enforceZeroMockPolicy, null, token);
  },

  async generateCopilotCompletion(
    prefixCode: string,
    filePath: string,
    token?: string | null
  ): Promise<CopilotCompletionResponse> {
    return generateCopilotCompletion(prefixCode, filePath, token);
  },

  async executeOperatorWorkflow(
    workflowObjective: string,
    desiredActions: string[],
    token?: string | null
  ): Promise<OperatorWorkflow> {
    return executeOperatorWorkflow(
      workflowObjective,
      desiredActions as OperatorActionType[],
      token
    );
  },
};
