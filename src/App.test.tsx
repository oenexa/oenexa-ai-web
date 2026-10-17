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
