import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { CodeArtifact, AgentOsGoalResponse, OpenAiModelOption } from '../../types';
import { openAiNativeService } from '../../services/openAiNativeService';
import {
  OpenAiAgentGoalForm,
  OpenAiReasoningInspector,
  OpenAiAgentOsDagView,
  OpenAiArtifactsPanel,
  OpenAiMetricsCard,
} from './openai';

export interface OpenAiNativeTabProps {
  darkMode: boolean;
  token?: string | null;
  username: string;
  repositoryId: string;
  localFirstMode: boolean;
  setLocalFirstMode: (val: boolean) => void;
  onApplyArtifactToEditor: (artifact: CodeArtifact) => void;
  notify: (msg: string) => void;
}

export const OpenAiNativeTab: React.FC<OpenAiNativeTabProps> = ({
  darkMode,
  token,
  username,
  repositoryId,
  localFirstMode,
  setLocalFirstMode,
  onApplyArtifactToEditor,
  notify,
}) => {
  const [goalInput, setGoalInput] = useState<string>(
    'Synthesize reactive payment service with Spring Boot 3, sealed records, zero-mock tests, and Flyway migration'
  );
  const [selectedModel, setSelectedModel] = useState<string>('oenexa-neo-gpt-o1');
  const [reasoningEffort, setReasoningEffort] = useState<string>('high');
  const [running, setRunning] = useState<boolean>(false);
  const [modelOptions, setModelOptions] = useState<OpenAiModelOption[]>([
    { id: 'oenexa-neo-gpt-o1', specialty: 'o3 Deliberative Reasoning & Planning', mode: 'Local-First' },
    { id: 'qwen2.5-coder:32b', specialty: 'Autonomous Code Generation & Refactoring', mode: 'Air-Gapped Ollama' },
    { id: 'deepseek-r1:14b', specialty: 'Deep Architectural Invariants & Root Cause Analysis', mode: 'Air-Gapped Ollama' },
    { id: 'llama3.3:70b', specialty: 'Long-Context Synthesis & Repository Intelligence', mode: 'Air-Gapped Ollama' },
    { id: 'gpt-4o', specialty: 'Cloud Frontier Logic & Fast Responses', mode: 'Cloud Hybrid' },
  ]);
  const [goalResponse, setGoalResponse] = useState<AgentOsGoalResponse | null>(null);

  useEffect(() => {
    openAiNativeService.listModels().then(setModelOptions);
    // Initialize default execution state
    handleLaunch('Synthesize reactive payment service with Spring Boot 3, sealed records, zero-mock tests, and Flyway migration');
  }, []);

  const handleLaunch = async (presetGoal?: string) => {
    const goalToRun = presetGoal || goalInput;
    if (!goalToRun.trim()) return;

    setRunning(true);
    try {
      const resp = await openAiNativeService.executeGoal(
        {
          goal: goalToRun,
          repositoryId,
          userId: username || 'engineer',
          localFirstAirGapped: localFirstMode,
          reasoningEffort,
        },
        token
      );
      setGoalResponse(resp);
      notify(`Neo-GPT Goal executed with ${(resp.metrics.confidenceScore * 100).toFixed(0)}% confidence!`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1600, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* 1. Goal Configuration & Parameter Form */}
      <OpenAiAgentGoalForm
        darkMode={darkMode}
        goalInput={goalInput}
        setGoalInput={setGoalInput}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        reasoningEffort={reasoningEffort}
        setReasoningEffort={setReasoningEffort}
        localFirstMode={localFirstMode}
        setLocalFirstMode={setLocalFirstMode}
        running={running}
        modelOptions={modelOptions}
        onLaunch={handleLaunch}
      />

      {/* 2. o3 Deliberative Reasoning Trace Inspector */}
      {goalResponse?.deliberativeTrace && (
        <OpenAiReasoningInspector
          darkMode={darkMode}
          trace={goalResponse.deliberativeTrace}
        />
      )}

      {/* 3. 10-Persona Agent OS Task Graph & Telemetry */}
      {goalResponse && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <OpenAiAgentOsDagView
              darkMode={darkMode}
              steps={goalResponse.executedSteps}
            />
          </Grid>
          <Grid item xs={12} lg={4} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <OpenAiMetricsCard
              darkMode={darkMode}
              metrics={goalResponse.metrics}
            />
            <OpenAiArtifactsPanel
              darkMode={darkMode}
              artifacts={goalResponse.synthesizedArtifacts}
              onApplyArtifactToEditor={onApplyArtifactToEditor}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
