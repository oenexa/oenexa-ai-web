import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import {
  OenexaAutonomousGoalResponse,
  OenexaExecutionEvent,
  OenexaSelfHealingCycle,
  CodeArtifact,
  CodeContextAttachment,
  MultimodalAttachment,
  ProductRequirementsDocument,
} from '../../types';
import { oenexaAgentService } from '../../services';
import {
  OenexaGoalExecutionForm,
  OenexaPhaseStepper,
  OenexaPlanDagView,
  OenexaThoughtTraceTerminal,
  OenexaSelfHealingPanel,
  OenexaArtifactsPanel,
  OenexaPrdUserStoriesPanel,
  OenexaPrivacyAuditCard,
} from './oenexa';

export interface OenexaAgentTabProps {
  darkMode: boolean;
  token: string | null;
  username: string;
  repositoryId: string;
  localFirstMode: boolean;
  setLocalFirstMode: (val: boolean) => void;
  pendingAttachment: CodeContextAttachment | null;
  multimodalAttachments: MultimodalAttachment[];
  handleAttachVoiceMemo: () => void;
  handleAttachDiagram: () => void;
  handleAttachDocument: () => void;
  handleRemoveMultimodalAttachment: (id: string) => void;
  isRecordingVoice: boolean;
  currentPrd: ProductRequirementsDocument | null;
  onApplyPatchToEditor: (patchDiff: string) => void;
  onApplyArtifactToEditor: (artifact: CodeArtifact) => void;
  notify: (msg: string) => void;
}

export const OenexaAgentTab: React.FC<OenexaAgentTabProps> = ({
  darkMode,
  token,
  username,
  repositoryId,
  localFirstMode,
  setLocalFirstMode,
  pendingAttachment,
  multimodalAttachments,
  handleAttachVoiceMemo,
  handleAttachDiagram,
  handleAttachDocument,
  handleRemoveMultimodalAttachment,
  isRecordingVoice,
  currentPrd,
  onApplyPatchToEditor,
  onApplyArtifactToEditor,
  notify,
}) => {
  const [goalInput, setGoalInput] = useState<string>(
    'Synthesize reactive payment service with Spring Boot 3, sealed records, zero-mock tests, and Flyway migration'
  );
  const [autonomousHealing, setAutonomousHealing] = useState<boolean>(true);
  const [extendedThinking, setExtendedThinking] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activePhase, setActivePhase] = useState<string>('COMPLETED');
  const [currentGoal, setCurrentGoal] = useState<OenexaAutonomousGoalResponse | null>({
    goalId: 'goal-initial',
    goalDescription:
      'Synthesize reactive payment service with Spring Boot 3, sealed records, zero-mock tests, and Flyway migration',
    plan: {
      planId: 'plan-001',
      goalId: 'goal-initial',
      goalDescription:
        'Synthesize reactive payment service with Spring Boot 3, sealed records, zero-mock tests, and Flyway migration',
      steps: [
        {
          stepId: 'step-0',
          agentPersona: 'PRODUCT_MANAGER_AGENT',
          description: 'Synthesize PRD specifications and INVEST-compliant user stories',
          toolToInvoke: 'GENERATE_PRD',
          status: 'COMPLETED',
          output: 'Synthesized PRD & 2 INVEST user stories with Gherkin acceptance criteria.',
          retryCount: 0,
        },
        {
          stepId: 'step-1',
          agentPersona: 'ARCHITECTURE_AGENT',
          description: 'Define domain boundaries and sealed records',
          toolToInvoke: 'DESIGN_ARCHITECTURE',
          status: 'COMPLETED',
          output: 'Defined Hexagonal architecture boundaries and C4 Component contracts.',
          retryCount: 0,
        },
        {
          stepId: 'step-2',
          agentPersona: 'CODE_AGENT',
          description: 'Implement reactive services and REST endpoints',
          toolToInvoke: 'GENERATE_CODE',
          status: 'COMPLETED',
          output: 'Generated Java 25 domain records and reactive repository adapters.',
          retryCount: 0,
        },
        {
          stepId: 'step-3',
          agentPersona: 'TEST_AGENT',
          description: 'Synthesize zero-mock JUnit 5 test suites',
          toolToInvoke: 'RUN_TESTS',
          status: 'COMPLETED',
          output: 'Compiled JUnit 5 tests; 100% line coverage verified with zero mocks.',
          retryCount: 0,
        },
        {
          stepId: 'step-4',
          agentPersona: 'SECURITY_AGENT',
          description: 'Perform SAST static security analysis',
          toolToInvoke: 'SECURITY_SCAN',
          status: 'COMPLETED',
          output: 'SAST Audit: 0 vulnerabilities, 0 credential leaks identified.',
          retryCount: 0,
        },
        {
          stepId: 'step-5',
          agentPersona: 'DEVOPS_AGENT',
          description: 'Configure multi-stage Dockerfile and K8s manifests',
          toolToInvoke: 'DOCKER_BUILD',
          status: 'COMPLETED',
          output: 'Generated multi-stage Dockerfile with eclipse-temurin:25 and Kubernetes deployment.',
          retryCount: 0,
        },
        {
          stepId: 'step-6',
          agentPersona: 'DOCUMENTATION_AGENT',
          description: 'Generate OpenAPI specifications and sequence diagrams',
          toolToInvoke: 'GENERATE_DOCS',
          status: 'COMPLETED',
          output: 'Formulated OpenAPI 3.0 specification and Mermaid sequence traces.',
          retryCount: 0,
        },
      ],
      currentPhase: 'COMPLETED',
      createdAt: '12:00:00 AM',
      updatedAt: '12:00:05 AM',
    },
    events: [
      {
        eventId: 'evt-001',
        goalId: 'goal-initial',
        phase: 'PLANNING',
        agentPersona: 'PRODUCT_MANAGER_AGENT',
        thoughtProcess: 'OENEXA Neo-GPT initialized. Parsing developer goal and synthesizing PRD.',
        toolAction: 'GENERATE_PRD',
        outputSnippet: 'PRD created with 2 INVEST user stories and Gherkin scenarios.',
        status: 'SUCCESS',
        timestamp: '12:00:01 AM',
      },
      {
        eventId: 'evt-002',
        goalId: 'goal-initial',
        phase: 'DECOMPOSITION',
        agentPersona: 'ARCHITECTURE_AGENT',
        thoughtProcess: 'Formulating 7-Persona execution plan DAG with 0 cyclic dependencies.',
        toolAction: 'BUILD_PLAN_DAG',
        outputSnippet: 'Dependency graph resolved.',
        status: 'SUCCESS',
        timestamp: '12:00:02 AM',
      },
      {
        eventId: 'evt-003',
        goalId: 'goal-initial',
        phase: 'TOOL_EXECUTION',
        agentPersona: 'CODE_AGENT',
        thoughtProcess: 'Implementing clean Java 25 records and Spring controllers.',
        toolAction: 'GENERATE_CODE',
        outputSnippet: 'PaymentService.java and PaymentRecord.java compiled.',
        status: 'SUCCESS',
        timestamp: '12:00:03 AM',
      },
      {
        eventId: 'evt-004',
        goalId: 'goal-initial',
        phase: 'SELF_HEALING_VERIFICATION',
        agentPersona: 'BUG_FIX_AGENT',
        thoughtProcess: 'Verifying test assertions and compiler diagnostics. All tests pass.',
        toolAction: 'RUN_TESTS',
        outputSnippet: 'All assertions green: 100% line coverage.',
        status: 'SUCCESS',
        timestamp: '12:00:04 AM',
      },
      {
        eventId: 'evt-005',
        goalId: 'goal-initial',
        phase: 'COMPLETED',
        agentPersona: 'ARCHITECTURE_AGENT',
        thoughtProcess: 'Goal resolved with 0 defects and zero external AI telemetry leakage.',
        toolAction: 'FINALIZE_GOAL',
        outputSnippet: 'Confidence: 0.99',
        status: 'SUCCESS',
        timestamp: '12:00:05 AM',
      },
    ],
    selfHealingCycles: [
      {
        cycleId: 'cycle-001',
        goalId: 'goal-initial',
        issueDetected: 'Pre-flight invariant check: validating non-null requirements.',
        rootCause: 'Defensive null check missing in request body binding.',
        patchDiff: '--- a/PaymentService.java\n+++ b/PaymentService.java\n@@ -10,3 +10,4 @@\n+ Objects.requireNonNull(request, "request must not be null");',
        resolved: true,
        timestamp: '12:00:04 AM',
      },
    ],
    artifacts: [
      {
        id: 'art-001',
        name: 'PaymentService.java',
        filePath: 'src/main/java/com/oenexa/payment/PaymentService.java',
        language: 'JAVA',
        content: 'package com.oenexa.payment;\n\npublic class PaymentService {\n    // Generated by OENEXA Neo-GPT\n}',
        action: 'CREATE',
      },
    ],
    confidenceScore: 0.99,
    finalSummary: '### 🚀 OENEXA Neo-GPT Autonomous Goal Execution Succeeded\n- **Confidence**: 0.99 (Zero-Mock Verified)\n- **Invariants**: 100% Preserved',
    completedAt: '12:00:05 AM',
  });

  const [thoughtEvents, setThoughtEvents] = useState<OenexaExecutionEvent[]>(currentGoal?.events || []);
  const [healingCycles, setHealingCycles] = useState<OenexaSelfHealingCycle[]>(currentGoal?.selfHealingCycles || []);
  const [manualIssueInput, setManualIssueInput] = useState<string>('');
  const [manualCauseInput, setManualCauseInput] = useState<string>('');

  const handleLaunchGoal = async (presetGoal?: string) => {
    const effectiveGoal = presetGoal || goalInput;
    if (!effectiveGoal.trim()) {
      notify('Please specify an engineering goal for OENEXA Autonomous Agent.');
      return;
    }

    setIsRunning(true);
    setActivePhase('PLANNING');
    notify(`🧬 OENEXA Neo-GPT Agent initialized: '${effectiveGoal}'`);

    try {
      const response = await oenexaAgentService.launchGoal({
        goal: effectiveGoal,
        repositoryId,
        userId: username,
        autonomousSelfHealing: autonomousHealing,
        extendedThinking,
        attachments: pendingAttachment ? [pendingAttachment] : [],
        localFirstMode,
        multimodalAttachments,
        token,
        currentPrd,
      });

      setCurrentGoal(response);
      setThoughtEvents(response.events || []);
      setHealingCycles(response.selfHealingCycles || []);
      setActivePhase('COMPLETED');
      notify(`✅ OENEXA Agent Goal '${effectiveGoal}' completed successfully with 0 defects!`);
    } catch {
      notify('Failed to execute autonomous goal.');
      setActivePhase('FAILED');
    } finally {
      setIsRunning(false);
    }
  };

  const handleTriggerManualHeal = async () => {
    if (!manualIssueInput.trim()) {
      notify('Please enter an issue description to trigger self-healing reflection.');
      return;
    }

    const goalId = currentGoal?.goalId || 'active-goal';
    notify('Triggering on-demand self-healing reflection cycle...');

    try {
      const cycle = await oenexaAgentService.triggerSelfHealing(
        goalId,
        manualIssueInput,
        manualCauseInput,
        token
      );
      setHealingCycles((prev) => [cycle, ...prev]);
      setManualIssueInput('');
      setManualCauseInput('');
      notify('Self-Healing cycle resolved! Patch generated.');
    } catch {
      notify('Failed to trigger self-healing reflection.');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 1 }}>
      {/* 1. Goal Launch & Config Form */}
      <OenexaGoalExecutionForm
        darkMode={darkMode}
        goalInput={goalInput}
        setGoalInput={setGoalInput}
        isRunning={isRunning}
        localFirstMode={localFirstMode}
        setLocalFirstMode={setLocalFirstMode}
        autonomousHealing={autonomousHealing}
        setAutonomousHealing={setAutonomousHealing}
        extendedThinking={extendedThinking}
        setExtendedThinking={setExtendedThinking}
        multimodalAttachments={multimodalAttachments}
        isRecordingVoice={isRecordingVoice}
        handleAttachVoiceMemo={handleAttachVoiceMemo}
        handleAttachDiagram={handleAttachDiagram}
        handleAttachDocument={handleAttachDocument}
        handleRemoveMultimodalAttachment={handleRemoveMultimodalAttachment}
        onLaunch={handleLaunchGoal}
      />

      {/* 2. ReAct Phase Stepper */}
      <OenexaPhaseStepper darkMode={darkMode} activePhase={activePhase} />

      {/* 3. Main Dashboard: DAG & Telemetry */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <OenexaPlanDagView darkMode={darkMode} steps={currentGoal?.plan?.steps || []} />
            <OenexaThoughtTraceTerminal darkMode={darkMode} events={thoughtEvents} />
          </Box>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <OenexaArtifactsPanel
              darkMode={darkMode}
              confidenceScore={currentGoal?.confidenceScore || 0.99}
              artifacts={currentGoal?.artifacts || []}
              onApplyArtifactToEditor={onApplyArtifactToEditor}
            />

            <OenexaSelfHealingPanel
              darkMode={darkMode}
              cycles={healingCycles}
              manualIssueInput={manualIssueInput}
              setManualIssueInput={setManualIssueInput}
              manualCauseInput={manualCauseInput}
              setManualCauseInput={setManualCauseInput}
              onTriggerManualHeal={handleTriggerManualHeal}
              onApplyPatchToEditor={onApplyPatchToEditor}
            />

            {currentGoal?.privacyAudit && (
              <OenexaPrivacyAuditCard darkMode={darkMode} privacyAudit={currentGoal.privacyAudit} />
            )}
          </Box>
        </Grid>
      </Grid>

      {/* 4. PM & PRD Section */}
      {currentGoal?.prd && currentGoal?.userStories && (
        <OenexaPrdUserStoriesPanel
          darkMode={darkMode}
          prd={currentGoal.prd}
          userStories={currentGoal.userStories}
        />
      )}
    </Box>
  );
};
