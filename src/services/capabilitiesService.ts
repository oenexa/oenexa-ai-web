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
} from '../types';

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

  async analyzeClaudeReasoning(objective: string, codeContext: string, token?: string | null): Promise<ClaudeReasoningTrace> {
    const res = await fetch('/api/v1/capabilities/reasoning/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        objective,
        codeContext,
      }),
    });
    if (!res.ok) throw new Error('Claude reasoning API error');
    return res.json();
  },

  async fuseMultimodalContext(
    audio: MultimodalAudioAnalysis | null,
    vision: MultimodalVisionAnalysis | null,
    specDocuments: MultimodalAttachment[],
    contextualTitle: string,
    token?: string | null
  ): Promise<MultimodalUnifiedContext> {
    const res = await fetch('/api/v1/capabilities/multimodal/fusion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        audio,
        vision,
        specDocuments,
        contextualTitle,
      }),
    });
    if (!res.ok) throw new Error('Fusion error');
    return res.json();
  },

  async curateCursorContext(promptOrQuery: string, repositoryId: string, token?: string | null): Promise<CursorContextReference[]> {
    const res = await fetch('/api/v1/capabilities/coding/context', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        promptOrQuery,
        repositoryId,
      }),
    });
    if (!res.ok) throw new Error('Cursor context error');
    return res.json();
  },

  async generateCursorPatch(objective: string, targetFilePaths: string[], token?: string | null): Promise<AtomicMultiFilePatch> {
    const res = await fetch('/api/v1/capabilities/coding/patch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        objective,
        targetFilePaths,
      }),
    });
    if (!res.ok) throw new Error('Cursor patch error');
    return res.json();
  },

  async executeDevinTask(taskGoal: string, repositoryId: string, enforceZeroMockPolicy: boolean, token?: string | null): Promise<DevinTaskExecutionPlan> {
    const res = await fetch('/api/v1/capabilities/execution/devin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        taskGoal,
        repositoryId,
        enforceZeroMockPolicy,
      }),
    });
    if (!res.ok) throw new Error('Devin task error');
    return res.json();
  },

  async generateCopilotCompletion(prefixCode: string, filePath: string, token?: string | null): Promise<CopilotCompletionResponse> {
    const res = await fetch('/api/v1/capabilities/copilot/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        prefixCode,
        suffixCode: '',
        filePath,
        language: 'java',
        cursorLine: 1,
        cursorColumn: prefixCode.length,
      }),
    });
    if (!res.ok) throw new Error('Copilot error');
    return res.json();
  },

  async executeOperatorWorkflow(workflowObjective: string, desiredActions: string[], token?: string | null): Promise<OperatorWorkflow> {
    const res = await fetch('/api/v1/capabilities/operator/automate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        workflowObjective,
        desiredActions,
      }),
    });
    if (!res.ok) throw new Error('Operator error');
    return res.json();
  },
};
