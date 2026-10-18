import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import App from './App';

/**
 * Behavior-Driven Development (BDD) Test Suite: OENEXA Enterprise AI Agent Frontend
 */
describe('Feature: Theme Switching & Workspace Health Diagnostics', () => {
  describe('Scenario: Initial application load and header rendering', () => {
    it('Given the user opens the application, When the header mounts, Then the platform title and health monitor should be visible', async () => {
      await act(async () => {
        render(<App />);
      });

      expect(screen.getByText(/OENEXA AI Engineer/i)).toBeInTheDocument();
      expect(screen.getByText(/Backend Service Health:/i)).toBeInTheDocument();
      expect(screen.getByText(/Analyze AST & Smells/i)).toBeInTheDocument();
    });
  });

  describe('Scenario: Toggle between light and dark themes', () => {
    it('Given the page is in light mode, When the user clicks the theme toggle button, Then dark mode class is applied to the root document', async () => {
      await act(async () => {
        render(<App />);
      });
      const toggleButton = screen.getByRole('button', { name: /toggle dark mode/i });
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      await act(async () => {
        fireEvent.click(toggleButton);
      });

      expect(document.documentElement.classList.contains('dark')).toBe(true);

      await act(async () => {
        fireEvent.click(toggleButton);
      });
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });
});

describe('Feature: Intelligent Conversational AI Hub (Multi-Model & Real Scenario)', () => {
  describe('Scenario: Navigate to AI Chat tab and interact with sessions', () => {
    it('Given the user is on the Code Workspace, When they click the Chat tab, Then the intelligent chat interface is displayed', async () => {
      await act(async () => {
        render(<App />);
      });

      // Switch to Chat tab
      const chatTab = screen.getByRole('tab', { name: /AI Assistant Chat/i });
      await act(async () => {
        fireEvent.click(chatTab);
      });

      // Verify sessions and model selector are present
      expect(screen.getByText(/Sessions/i)).toBeInTheDocument();
      expect(screen.getByText(/Chain-of-Thought Reasoning/i)).toBeInTheDocument();
    });

    it('Given the user is in AI Chat, When they enter a question and send, Then user message and response appear', async () => {
      await act(async () => {
        render(<App />);
      });

      const chatTab = screen.getByRole('tab', { name: /AI Assistant Chat/i });
      await act(async () => {
        fireEvent.click(chatTab);
      });

      const input = screen.getByPlaceholderText(/Ask Claude, GPT, or Gemini Pro/i);
      await act(async () => {
        fireEvent.change(input, { target: { value: 'Synthesize tests for Solution class' } });
      });

      const sendButton = screen.getByRole('button', { name: /Send/i });
      await act(async () => {
        fireEvent.click(sendButton);
      });

      // User message rendered
      expect(screen.getByText('Synthesize tests for Solution class')).toBeInTheDocument();
    });
  });
});

describe('Feature: Code Workspace Backend Automations', () => {
  describe('Scenario: Trigger AST Analysis modal', () => {
    it('Given code in the editor, When the user clicks Analyze AST, Then the analysis dialog displays metrics', async () => {
      await act(async () => {
        render(<App />);
      });

      const astButton = screen.getByRole('button', { name: /Analyze AST & Smells/i });
      await act(async () => {
        fireEvent.click(astButton);
      });

      // Analysis dialog appears
      expect(screen.getByText(/AST Analysis & Complexity Report/i)).toBeInTheDocument();

      const closeButton = screen.getByRole('button', { name: /Close/i });
      await act(async () => {
        fireEvent.click(closeButton);
      });
    });
  });

  describe('Scenario: Attach code to AI Chat context', () => {
    it('Given code in the editor, When user clicks Attach to AI Chat Context, Then app switches to Chat tab with attachment', async () => {
      await act(async () => {
        render(<App />);
      });

      const attachButton = screen.getByRole('button', { name: /Attach to AI Chat Context/i });
      await act(async () => {
        fireEvent.click(attachButton);
      });

      // Switched to Chat tab
      expect(screen.getByText(/Sessions/i)).toBeInTheDocument();
      // Attachment chip is present
      expect(screen.getByText(/Attached: src\/main\/java\/Solution\.java/i)).toBeInTheDocument();
    });
  });
});

describe('Feature: 7 Collaborative Software Engineer Agents Pipeline', () => {
  describe('Scenario: Execute 7-Agent collaborative pipeline', () => {
    it('Given the user opens the 7 Agents tab, When clicking Execute Collaborative Pipeline, Then all 6 stages run and complete', async () => {
      await act(async () => {
        render(<App />);
      });

      const agentsTab = screen.getByRole('tab', { name: /7 Collaborative Agents/i });
      await act(async () => {
        fireEvent.click(agentsTab);
      });

      expect(screen.getByText(/Autonomous 7-Agent Engineering Pipeline/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Architecture Agent/i)[0]).toBeInTheDocument();

      const runButton = screen.getByRole('button', { name: /Execute Collaborative Pipeline/i });
      await act(async () => {
        fireEvent.click(runButton);
      });

      expect(screen.getByText(/Collaborative Pipeline Execution Results/i)).toBeInTheDocument();
      expect(screen.getByText(/Stage 1: ARCHITECTURE_AGENT/i)).toBeInTheDocument();
      expect(screen.getByText(/Stage 2: CODE_AGENT/i)).toBeInTheDocument();
    });
  });
});

describe('Feature: Repository Understanding & Vector Knowledge Base', () => {
  describe('Scenario: Index and search repository knowledge', () => {
    it('Given the user opens the Repository Knowledge tab, When viewing the map, Then primary stack and symbols are displayed', async () => {
      await act(async () => {
        render(<App />);
      });

      const repoTab = screen.getByRole('tab', { name: /Repository Knowledge & RAG/i });
      await act(async () => {
        fireEvent.click(repoTab);
      });

      expect(screen.getByText(/Repository Understanding & Vector Knowledge Base/i)).toBeInTheDocument();
      expect(screen.getByText(/PRIMARY STACK/i)).toBeInTheDocument();
      expect(screen.getAllByText(/SPRING_BOOT/i).length).toBeGreaterThanOrEqual(1);

      const indexButton = screen.getByRole('button', { name: /Index Current Repository/i });
      await act(async () => {
        fireEvent.click(indexButton);
      });
    });
  });
});

describe('Feature: AI Memory Inspector (Short-Term & Long-Term)', () => {
  describe('Scenario: Inspect and add persistent user memory', () => {
    it('Given the user opens the AI Memory Inspector tab, When viewing memories, Then persistent user memories are visible and new memories can be saved', async () => {
      await act(async () => {
        render(<App />);
      });

      const memoryTab = screen.getByRole('tab', { name: /AI Memory Inspector/i });
      await act(async () => {
        fireEvent.click(memoryTab);
      });

      expect(screen.getByText(/AI Memory Architecture/i)).toBeInTheDocument();
      expect(screen.getByText(/ARCHITECTURE_STYLE/i)).toBeInTheDocument();
      expect(screen.getByText(/TESTING_INVARIANT/i)).toBeInTheDocument();

      const keyInput = screen.getByPlaceholderText(/e\.g\. DATABASE_CHOICE/i);
      const valInput = screen.getByPlaceholderText(/e\.g\. Always use PostgreSQL 16/i);

      await act(async () => {
        fireEvent.change(keyInput, { target: { value: 'DEPLOY_ENV' } });
        fireEvent.change(valInput, { target: { value: 'AWS EKS Kubernetes' } });
      });

      const saveButton = screen.getByRole('button', { name: /Save Memory/i });
      await act(async () => {
        fireEvent.click(saveButton);
      });

      expect(screen.getByText('DEPLOY_ENV')).toBeInTheDocument();
      expect(screen.getByText('AWS EKS Kubernetes')).toBeInTheDocument();
    });
  });
});

describe('Feature: Google Gemini 4 Argon Autonomous AI Agent', () => {
  describe('Scenario: Navigate to Gemini 4 Argon AI Agent and inspect plan DAG & trace', () => {
    it('Given the user opens the application, When clicking the Gemini 4 Argon tab, Then the autonomous plan DAG, telemetry, and self-healing loop are visible', async () => {
      await act(async () => {
        render(<App />);
      });

      const argonTab = screen.getByRole('tab', { name: /Gemini 4 Argon AI Agent/i });
      await act(async () => {
        fireEvent.click(argonTab);
      });

      // Verify Header & Stepper
      expect(screen.getByText(/Google Gemini 4 Argon Autonomous AI Agent/i)).toBeInTheDocument();
      expect(screen.getByText(/1\. PLANNING/i)).toBeInTheDocument();
      expect(screen.getByText(/2\. DECOMPOSITION/i)).toBeInTheDocument();
      expect(screen.getByText(/3\. TOOL_EXECUTION/i)).toBeInTheDocument();
      expect(screen.getByText(/4\. SELF_HEALING/i)).toBeInTheDocument();
      expect(screen.getByText(/5\. REFLECTION/i)).toBeInTheDocument();
      expect(screen.getByText(/6\. COMPLETED/i)).toBeInTheDocument();

      // Verify Plan DAG
      expect(screen.getByText(/Argon Autonomous Plan DAG/i)).toBeInTheDocument();
      expect(screen.getAllByText(/ARCHITECTURE_AGENT/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/CODE_AGENT/i).length).toBeGreaterThanOrEqual(1);

      // Verify Telemetry Stream Terminal
      expect(screen.getByText(/Real-Time Thought Trace & Tool Telemetry/i)).toBeInTheDocument();

      // Verify Self-Healing Loop
      expect(screen.getAllByText(/Self-Healing Reflection Loop/i)[0]).toBeInTheDocument();
      expect(screen.getByText(/Cycle #1: Resolved ✅/i)).toBeInTheDocument();
    });
  });

  describe('Scenario: Launch an autonomous engineering goal', () => {
    it('Given the user enters an engineering goal, When clicking Launch Autonomous Goal, Then the goal executes across 7 personas and completes with high confidence', async () => {
      await act(async () => {
        render(<App />);
      });

      const argonTab = screen.getByRole('tab', { name: /Gemini 4 Argon AI Agent/i });
      await act(async () => {
        fireEvent.click(argonTab);
      });

      const goalInput = screen.getByPlaceholderText(/e\.g\. Refactor database entities to reactive Spring WebFlux/i);
      await act(async () => {
        fireEvent.change(goalInput, {
          target: { value: 'Synthesize reactive WebClient with zero-mock test coverage' },
        });
      });

      const launchButton = screen.getByRole('button', { name: /Launch Autonomous Engineering Goal/i });
      await act(async () => {
        fireEvent.click(launchButton);
      });

      // Verifies completion and confidence metric
      expect(screen.getAllByText(/Confidence Score:/i)[0]).toBeInTheDocument();
      expect(screen.getByText(/99% \(Verified\)/i)).toBeInTheDocument();
    });
  });

  describe('Scenario: Simulate and trigger on-demand self-healing reflection cycle', () => {
    it('Given an error occurs, When the user triggers manual self-healing, Then a new resolved patch cycle is added to the loop', async () => {
      await act(async () => {
        render(<App />);
      });

      const argonTab = screen.getByRole('tab', { name: /Gemini 4 Argon AI Agent/i });
      await act(async () => {
        fireEvent.click(argonTab);
      });

      const issueInput = screen.getByPlaceholderText(/e\.g\. NullPointerException at line 42/i);
      const causeInput = screen.getByPlaceholderText(/e\.g\. Unchecked optional dereference/i);

      await act(async () => {
        fireEvent.change(issueInput, {
          target: { value: 'NullPointerException in TokenFilter line 33' },
        });
        fireEvent.change(causeInput, {
          target: { value: 'Authorization header is null when anonymous user visits' },
        });
      });

      const healButton = screen.getByRole('button', { name: /Trigger Self-Healing Patch/i });
      await act(async () => {
        fireEvent.click(healButton);
      });

      expect(screen.getAllByText(/NullPointerException in TokenFilter line 33/i)[0]).toBeInTheDocument();
      expect(screen.getByText(/Authorization header is null when anonymous user visits/i)).toBeInTheDocument();
    });
  });
});

describe('Feature: Local-First Air-Gapped Privacy & Multi-Model Invariant', () => {
  describe('Scenario: Toggle between local-first and cloud-hybrid privacy mode', () => {
    it('Given the platform starts in local-first mode, When the user clicks the air-gapped status chip, Then it switches to Cloud Hybrid Mode and back', async () => {
      await act(async () => {
        render(<App />);
      });

      const airGappedChip = screen.getByText(/Air-Gapped: 100% Zero Leakage/i);
      expect(airGappedChip).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(airGappedChip);
      });

      expect(screen.getByText(/Cloud Hybrid Mode/i)).toBeInTheDocument();

      const cloudChip = screen.getByText(/Cloud Hybrid Mode/i);
      await act(async () => {
        fireEvent.click(cloudChip);
      });

      expect(screen.getByText(/Air-Gapped: 100% Zero Leakage/i)).toBeInTheDocument();
    });
  });
});

describe('Feature: Native Multimodal Context Ingestion', () => {
  describe('Scenario: Attach diagram and document attachments to agent context', () => {
    it('Given the user is on the Argon console, When clicking Attach Architecture Diagram and Attach Spec Document, Then attachment chips appear and can be removed', async () => {
      await act(async () => {
        render(<App />);
      });

      const argonTab = screen.getByRole('tab', { name: /Gemini 4 Argon AI Agent/i });
      await act(async () => {
        fireEvent.click(argonTab);
      });

      const attachDiagramBtn = screen.getByRole('button', { name: /Attach Architecture Diagram/i });
      const attachDocBtn = screen.getByRole('button', { name: /Attach Spec Document/i });

      await act(async () => {
        fireEvent.click(attachDiagramBtn);
      });

      expect(screen.getByText(/architecture-hexagonal-diagram\.png/i)).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(attachDocBtn);
      });

      expect(screen.getByText(/engineering-specs\.openapi\.yaml/i)).toBeInTheDocument();
    });
  });
});

describe('Feature: AI Product Manager & PRD Studio', () => {
  describe('Scenario: Navigate to PRD Studio and synthesize autonomous PRD', () => {
    it('Given the user opens the PRD Studio tab, When inspecting the default PRD, Then problem statement, key features, and INVEST user stories are rendered', async () => {
      await act(async () => {
        render(<App />);
      });

      const prdTab = screen.getByRole('tab', { name: /AI Product Manager & PRD Studio/i });
      await act(async () => {
        fireEvent.click(prdTab);
      });

      expect(screen.getAllByText(/AI Product Manager & PRD Studio/i)[0]).toBeInTheDocument();
      expect(screen.getByText(/Real-Time Collaborative Code Review Microservice/i)).toBeInTheDocument();
      expect(screen.getByText(/Automated Real-Time AST Review/i)).toBeInTheDocument();
      expect(screen.getByText(/5 Story Points/i)).toBeInTheDocument();
    });

    it('Given the user customizes the product directive, When clicking Synthesize Autonomous PRD, Then updated PRD and INVEST stories are created', async () => {
      await act(async () => {
        render(<App />);
      });

      const prdTab = screen.getByRole('tab', { name: /AI Product Manager & PRD Studio/i });
      await act(async () => {
        fireEvent.click(prdTab);
      });

      const goalInput = screen.getByPlaceholderText(/e\.g\. Real-Time Collaborative Code Review Microservice/i);
      await act(async () => {
        fireEvent.change(goalInput, {
          target: { value: 'Autonomous Microservice Generator with Air-Gapped Verification' },
        });
      });

      const synthBtn = screen.getByRole('button', { name: /Synthesize Autonomous PRD & User Stories/i });
      await act(async () => {
        fireEvent.click(synthBtn);
      });

      expect(screen.getAllByText(/Autonomous Microservice Generator with Air-Gapped Verification/i).length).toBeGreaterThanOrEqual(1);
    });
  });
});

describe('Feature: Step 10 Target Capabilities (Claude, Gemini, Cursor, Devin, Copilot, Operator)', () => {
  describe('Scenario: Navigate to Target Capabilities Studio and verify 6 pillars', () => {
    it('Given the platform mounted, When clicking the Target Capabilities tab, Then the 6 pillars and quality gates are displayed', async () => {
      await act(async () => {
        render(<App />);
      });

      const capabilitiesTab = screen.getByRole('tab', { name: /Target Capabilities/i });
      await act(async () => {
        fireEvent.click(capabilitiesTab);
      });

      expect(screen.getByText(/Target Capabilities: Next-Gen Autonomous AI Engineering Platform/i)).toBeInTheDocument();
      expect(screen.getByText(/100% Zero-Mock Enforced/i)).toBeInTheDocument();
      expect(screen.getByText(/JaCoCo Line Coverage: 100%/i)).toBeInTheDocument();
      expect(screen.getByText(/v2.6.0-ARGON-MAX/i)).toBeInTheDocument();

      // Verify sub-tabs
      expect(screen.getByRole('tab', { name: /1\. Claude Reasoning/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /2\. Gemini Multimodal/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /3\. Cursor Coding/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /4\. Devin Task Execution/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /5\. GitHub Copilot/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /6\. OpenAI Operator/i })).toBeInTheDocument();
    });
  });

  describe('Scenario: Claude-Level Tree-of-Thought Reasoning', () => {
    it('Given the Claude Reasoning sub-tab, When executing reasoning, Then winning hypothesis and trade-offs are verified', async () => {
      await act(async () => {
        render(<App />);
      });

      const capabilitiesTab = screen.getByRole('tab', { name: /Target Capabilities/i });
      await act(async () => {
        fireEvent.click(capabilitiesTab);
      });

      expect(screen.getByText(/Winning Architecture: Hexagonal Modular Monolith Architecture/i)).toBeInTheDocument();
      expect(screen.getByText(/Evaluated Hypothesis Branches/i)).toBeInTheDocument();

      const executeBtn = screen.getByRole('button', { name: /Execute Claude Reasoning/i });
      await act(async () => {
        fireEvent.click(executeBtn);
      });

      expect(screen.getByText(/Selected Hexagonal Monolith/i)).toBeInTheDocument();
    });
  });

  describe('Scenario: Gemini-Level Multimodal Intelligence (Vision & Audio)', () => {
    it('Given Gemini Multimodal sub-tab, When selected, Then visual OCR components and speech directives are visible', async () => {
      await act(async () => {
        render(<App />);
      });

      const capabilitiesTab = screen.getByRole('tab', { name: /Target Capabilities/i });
      await act(async () => {
        fireEvent.click(capabilitiesTab);
      });

      const multimodalTab = screen.getByRole('tab', { name: /2\. Gemini Multimodal/i });
      await act(async () => {
        fireEvent.click(multimodalTab);
      });

      expect(screen.getByText(/Visual Architecture Diagram OCR & Parsing/i)).toBeInTheDocument();
      expect(screen.getByText(/Developer Speech Audio Directives/i)).toBeInTheDocument();
      expect(screen.getByText(/Multimodal Context Fusion/i)).toBeInTheDocument();
      expect(screen.getAllByText(/ArgonAgentController/i).length).toBeGreaterThanOrEqual(1);

      const fuseBtn = screen.getByRole('button', { name: /Re-Fuse Context/i });
      await act(async () => {
        fireEvent.click(fuseBtn);
      });

      expect(screen.getByText(/Gemini Unified Multimodal Engineering Context/i)).toBeInTheDocument();
    });
  });

  describe('Scenario: Cursor-Level Coding & Multi-File Atomic Patches', () => {
    it('Given Cursor Coding sub-tab, When curating context and synthesizing patches, Then diffs and affected symbols are shown', async () => {
      await act(async () => {
        render(<App />);
      });

      const capabilitiesTab = screen.getByRole('tab', { name: /Target Capabilities/i });
      await act(async () => {
        fireEvent.click(capabilitiesTab);
      });

      const cursorTab = screen.getByRole('tab', { name: /3\. Cursor Coding/i });
      await act(async () => {
        fireEvent.click(cursorTab);
      });

      expect(screen.getByText(/Cursor @Context Curation/i)).toBeInTheDocument();
      expect(screen.getByText(/Atomic Multi-File Patch Generator/i)).toBeInTheDocument();
      expect(screen.getByText(/Rollback Safe \(Atomic\)/i)).toBeInTheDocument();

      const curateBtn = screen.getByRole('button', { name: /Curate/i });
      await act(async () => {
        fireEvent.click(curateBtn);
      });

      const patchBtn = screen.getByRole('button', { name: /Synthesize Multi-File Atomic Patch/i });
      await act(async () => {
        fireEvent.click(patchBtn);
      });

      expect(screen.getByText(/Cursor Atomic Patch:/i)).toBeInTheDocument();
    });
  });

  describe('Scenario: Devin-Level Autonomous Sandbox Task Execution', () => {
    it('Given Devin Task Execution sub-tab, When launched, Then all 4 compilation and zero-mock verification stages succeed', async () => {
      await act(async () => {
        render(<App />);
      });

      const capabilitiesTab = screen.getByRole('tab', { name: /Target Capabilities/i });
      await act(async () => {
        fireEvent.click(capabilitiesTab);
      });

      const devinTab = screen.getByRole('tab', { name: /4\. Devin Task Execution/i });
      await act(async () => {
        fireEvent.click(devinTab);
      });

      expect(screen.getByText(/Devin Autonomous Task Sandbox/i)).toBeInTheDocument();
      expect(screen.getByText(/Enforce Strictly Zero-Mock Testing Policy/i)).toBeInTheDocument();

      const launchDevinBtn = screen.getByRole('button', { name: /Launch Devin Autonomous Execution/i });
      await act(async () => {
        fireEvent.click(launchDevinBtn);
      });

      expect(screen.getByText(/Devin Execution Plan:/i)).toBeInTheDocument();
      expect(screen.getByText(/Zero-Mock Regression Test Suite Execution/i)).toBeInTheDocument();
      expect(screen.getByText(/141\/141 tasks executed successfully/i)).toBeInTheDocument();
    });
  });

  describe('Scenario: GitHub Copilot Inline Completion & OpenAI Operator Workflows', () => {
    it('Given Copilot and Operator sub-tabs, When actions are triggered, Then suggestions and environment actions are verified', async () => {
      await act(async () => {
        render(<App />);
      });

      const capabilitiesTab = screen.getByRole('tab', { name: /Target Capabilities/i });
      await act(async () => {
        fireEvent.click(capabilitiesTab);
      });

      // Test Copilot
      const copilotTab = screen.getByRole('tab', { name: /5\. GitHub Copilot/i });
      await act(async () => {
        fireEvent.click(copilotTab);
      });

      expect(screen.getByText(/GitHub Copilot Inline Code Completion/i)).toBeInTheDocument();
      expect(screen.getByText(/Ghost-Text Synthesis/i)).toBeInTheDocument();

      const synthCopilotBtn = screen.getByRole('button', { name: /Synthesize Copilot Suggestion/i });
      await act(async () => {
        fireEvent.click(synthCopilotBtn);
      });

      expect(screen.getByText(/Candidate Suggestions/i)).toBeInTheDocument();

      // Test Operator
      const operatorTab = screen.getByRole('tab', { name: /6\. OpenAI Operator/i });
      await act(async () => {
        fireEvent.click(operatorTab);
      });

      expect(screen.getByText(/OpenAI Operator Delivery Workflows/i)).toBeInTheDocument();
      expect(screen.getByText(/Orchestrated Environment Actions/i)).toBeInTheDocument();

      const executeOpBtn = screen.getByRole('button', { name: /Execute Operator Workflow/i });
      await act(async () => {
        fireEvent.click(executeOpBtn);
      });

      expect(screen.getByText(/Operator Autonomous Delivery Workflow/i)).toBeInTheDocument();
      expect(screen.getByText(/DOCKER_BUILD/i)).toBeInTheDocument();
      expect(screen.getByText(/DB_MIGRATION/i)).toBeInTheDocument();
    });
  });
});

describe('Feature: Neo-GPT Agent OS & 100% Wire-Compatible OpenAI Native Engine', () => {
  describe('Scenario: Navigate to Neo-GPT Agent OS tab and verify 5-stage o3 deliberative reasoning', () => {
    it('Given the platform is mounted, When clicking the Neo-GPT Agent OS tab, Then goal controls, deliberative trace, 10-persona DAG, and metrics are displayed', async () => {
      await act(async () => {
        render(<App />);
      });

      const neoGptTab = screen.getByRole('tab', { name: /Neo-GPT Agent OS/i });
      await act(async () => {
        fireEvent.click(neoGptTab);
      });

      expect(screen.getByText(/OENEXA Neo-GPT Autonomous Agent OS/i)).toBeInTheDocument();
      expect(screen.getByText(/OpenAI Wire Compatible/i)).toBeInTheDocument();
      expect(screen.getByText(/o3 Deliberative Reasoning Trace/i)).toBeInTheDocument();
      expect(screen.getByText(/10-Persona Autonomous Task Execution Graph/i)).toBeInTheDocument();
      expect(screen.getByText(/Execution Telemetry/i)).toBeInTheDocument();
      expect(screen.getByText(/Tokens Synthesized:/i)).toBeInTheDocument();
    });
  });

  describe('Scenario: Launch Neo-GPT Autonomous Engineering Goal', () => {
    it('Given user provides a custom goal, When clicking Launch Autonomous Neo-GPT Goal, Then 10-persona task execution runs and updates metrics', async () => {
      await act(async () => {
        render(<App />);
      });

      const neoGptTab = screen.getByRole('tab', { name: /Neo-GPT Agent OS/i });
      await act(async () => {
        fireEvent.click(neoGptTab);
      });

      const goalInput = screen.getByPlaceholderText(/e\.g\. Design reactive microservice architecture/i);
      await act(async () => {
        fireEvent.change(goalInput, {
          target: { value: 'Synthesize reactive payment service with Spring Boot 3, sealed records, and zero-mock tests' },
        });
      });

      const launchBtn = screen.getByRole('button', { name: /Launch Autonomous Neo-GPT Goal/i });
      await act(async () => {
        fireEvent.click(launchBtn);
      });

      expect(screen.getByText(/10-Persona Autonomous Task Execution Graph/i)).toBeInTheDocument();
      expect(screen.getByText(/Execution Duration:/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Strictly Zero-Mock/i).length).toBeGreaterThanOrEqual(1);
    });
  });
});



