import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import {
  CodeArtifact,
  OenexaAgentOsGoalResponse,
  OenexaCognitiveModelOption,
} from '../../types';
import { oenexaCognitiveService } from '../../services/oenexaCognitiveService';
import {
  OenexaAgentOsGoalForm,
  OenexaReasoningInspector,
  OenexaAgentOsDagView,
  OenexaArtifactsPanel,
  OenexaMetricsCard,
} from './agentos';

export interface OenexaAgentOsTabProps {
  darkMode: boolean;
  token?: string | null;
  username: string;
  repositoryId: string;
  localFirstMode: boolean;
  setLocalFirstMode: (val: boolean) => void;
  onApplyArtifactToEditor: (artifact: CodeArtifact) => void;
  notify: (msg: string) => void;
}

export const OenexaAgentOsTab: React.FC<OenexaAgentOsTabProps> = ({
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
  const [selectedModel, setSelectedModel] = useState<string>('oenexa-neo-gpt-o3-max');
  const [reasoningEffort, setReasoningEffort] = useState<string>('high');
  const [running, setRunning] = useState<boolean>(false);
  const [modelOptions, setModelOptions] = useState<OenexaCognitiveModelOption[]>([
    { id: 'oenexa-neo-gpt-o3-max', specialty: 'Deliberative Reasoning & Planning', mode: 'Local Sovereign' },
    { id: 'oenexa-neo-gpt-coder-32b', specialty: 'Autonomous Code Generation & Refactoring', mode: 'Air-Gapped Local' },
    { id: 'oenexa-neo-gpt-architect-70b', specialty: 'Architectural Invariants & Root Cause Analysis', mode: 'Air-Gapped Local' },
    { id: 'oenexa-neo-gpt-reasoning-14b', specialty: 'Fast Analytical Deliberation', mode: 'Air-Gapped Local' },
  ]);
  const [goalResponse, setGoalResponse] = useState<OenexaAgentOsGoalResponse | null>(null);

  useEffect(() => {
    oenexaCognitiveService.listModels().then(setModelOptions);
    // Initialize default execution state
    handleLaunch('Synthesize reactive payment service with Spring Boot 3, sealed records, zero-mock tests, and Flyway migration');
  }, []);

  const handleLaunch = async (presetGoal?: string) => {
    const goalToRun = presetGoal || goalInput;
    if (!goalToRun.trim()) return;

    setRunning(true);
    try {
      const resp = await oenexaCognitiveService.executeGoal(
        {
          goal: goalToRun,
          repositoryId,
          userId: username || 'engineer',
          localFirstAirGapped: localFirstMode,
          sovereignAirGapped: localFirstMode,
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
      <OenexaAgentOsGoalForm
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

      {/* 2. OENEXA Deliberative Reasoning Trace Inspector */}
      {goalResponse?.deliberativeTrace && (
        <OenexaReasoningInspector
          darkMode={darkMode}
          trace={goalResponse.deliberativeTrace}
        />
      )}

      {/* 3. 10-Persona Agent OS Task Graph & Telemetry */}
      {goalResponse && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <OenexaAgentOsDagView
              darkMode={darkMode}
              steps={goalResponse.executedSteps}
            />
          </Grid>
          <Grid item xs={12} lg={4} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <OenexaMetricsCard
              darkMode={darkMode}
              metrics={goalResponse.metrics}
            />
            <OenexaArtifactsPanel
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

export default OenexaAgentOsTab;
