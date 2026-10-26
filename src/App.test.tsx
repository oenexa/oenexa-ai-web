import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import App from './App';

/**
 * Behavior-Driven Development (BDD) Test Suite: OENEXA Simple AI Chat
 */
describe('Feature: OENEXA Simple Chat Application', () => {
  describe('Scenario: Initial application load and header rendering', () => {
    it('Given the user opens the application, When the header mounts, Then the platform title and local model chip should be visible', async () => {
      await act(async () => {
        render(<App />);
      });

      expect(screen.getByText(/OENEXA Chat/i)).toBeInTheDocument();
      expect(screen.getByText(/deepseek-r1:8b • Local Ollama/i)).toBeInTheDocument();
      expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
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

  describe('Scenario: Default conversation and welcome message', () => {
    it('Given the user loads OENEXA Chat, When viewing the chat stream, Then the welcome greeting from DeepSeek-R1 should be displayed', async () => {
      await act(async () => {
        render(<App />);
      });

      expect(screen.getByText(/OENEXA AI/i)).toBeInTheDocument();
      expect(screen.getByText(/Hello! I'm OENEXA, powered by your local DeepSeek-R1 model/i)).toBeInTheDocument();
      expect(screen.getByText(/Sessions/i)).toBeInTheDocument();
    });
  });

  describe('Scenario: Create a new conversation session', () => {
    it('Given an ongoing conversation, When the user clicks New Chat, Then a fresh conversation is initialized and selected', async () => {
      await act(async () => {
        render(<App />);
      });

      const newChatBtn = screen.getByRole('button', { name: /New Chat/i });
      await act(async () => {
        fireEvent.click(newChatBtn);
      });

      expect(screen.getByText(/Started a fresh engineering session/i)).toBeInTheDocument();
    });
  });

  describe('Scenario: Send user message and receive AI response', () => {
    it('Given the user types a prompt, When clicking Send, Then the user message appears in the conversation stream', async () => {
      await act(async () => {
        render(<App />);
      });

      const input = screen.getByPlaceholderText(/(Ask OENEXA|Ask Claude, GPT, or Gemini Pro)/i);
      await act(async () => {
        fireEvent.change(input, { target: { value: 'Explain how to write a Python CSV parser' } });
      });

      const sendButton = screen.getByRole('button', { name: /Send/i });
      await act(async () => {
        fireEvent.click(sendButton);
      });

      expect(screen.getByText('Explain how to write a Python CSV parser')).toBeInTheDocument();
    });
  });

  describe('Scenario: Deliberative reasoning thought process toggle', () => {
    it('Given the user receives a response with thinking trace, When inspecting reasoning, Then thought process is accessible', async () => {
      await act(async () => {
        render(<App />);
      });

      expect(screen.getByText(/CoT Reasoning/i)).toBeInTheDocument();
      expect(screen.getByText(/Chain-of-Thought Reasoning/i)).toBeInTheDocument();
    });
  });

  describe('Scenario: Autonomous Auto-Chat controls and one-click chips', () => {
    it('Given the user is on the chat view, When clicking Auto-Run Next Step, Then autonomous AI turn executes', async () => {
      await act(async () => {
        render(<App />);
      });

      expect(screen.getByText(/Auto-Chat \(Real Scenario\)/i)).toBeInTheDocument();

      const autoRunBtn = screen.getByRole('button', { name: /Auto-Run Next Step/i });
      await act(async () => {
        fireEvent.click(autoRunBtn);
      });

      expect(screen.getByText(/AI Engineer \(Auto-Pilot\)/i)).toBeInTheDocument();
      expect(screen.getByText(/OENEXA Auto-Chat Step/i)).toBeInTheDocument();
    });

    it('Given one-click engineering chips, When clicking Auto-Architect, Then architectural prompt is populated', async () => {
      await act(async () => {
        render(<App />);
      });

      const architectChip = screen.getByText(/⚡ Auto-Architect/i);
      expect(architectChip).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(architectChip);
      });

      expect(screen.getByText(/Architect system design blueprint/i)).toBeInTheDocument();
    });
  });

  describe('Scenario: Attach code context to chat', () => {
    it('Given the user wants to attach code, When clicking attach file, Then pending attachment chip is displayed', async () => {
      await act(async () => {
        render(<App />);
      });

      const attachBtn = screen.getByTitle(/Attach current editor code/i);
      await act(async () => {
        fireEvent.click(attachBtn);
      });

      expect(screen.getByText(/Solution.java/i)).toBeInTheDocument();
      expect(screen.getByText(/Code attached to Chat context/i)).toBeInTheDocument();
    });
  });

  describe('Scenario: User authentication dialog', () => {
    it('Given the user is not signed in, When clicking Sign In, Then the authentication dialog opens', async () => {
      await act(async () => {
        render(<App />);
      });

      const signInBtn = screen.getByRole('button', { name: /Sign In/i });
      await act(async () => {
        fireEvent.click(signInBtn);
      });

      expect(screen.getByText(/Sign In to OENEXA/i)).toBeInTheDocument();
    });
  });

  describe('Scenario: OENEXA Multi-Agent Virtual Thread Swarm', () => {
    it('Given the user is on the platform, When clicking Swarm Threads, Then the OENEXA concurrent agent cockpit mounts and can dispatch swarm', async () => {
      await act(async () => {
        render(<App />);
      });

      const swarmBtn = screen.getByRole('button', { name: /Swarm Threads/i });
      await act(async () => {
        fireEvent.click(swarmBtn);
      });

      expect(screen.getByText(/OENEXA Multi-Agent Swarm/i)).toBeInTheDocument();
      expect(screen.getByText(/Java 25 Virtual Threads/i)).toBeInTheDocument();

      const dispatchBtn = screen.getByRole('button', { name: /Dispatch Swarm/i });
      await act(async () => {
        fireEvent.click(dispatchBtn);
      });

      expect(await screen.findByText(/Wall-Clock Duration/i)).toBeInTheDocument();
      expect(screen.getByText(/Sequential Equivalent/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Speedup/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Scenario: OENEXA Central Brain & 12-Engine Studio', () => {
    it('Given the user is on the platform, When clicking Core Brain, Then Central Brain studio mounts with 12 engines', async () => {
      await act(async () => {
        render(<App />);
      });

      const brainBtn = screen.getByRole('button', { name: /Core Brain/i });
      await act(async () => {
        fireEvent.click(brainBtn);
      });

      expect(screen.getByText(/OENEXA Central Brain & 12-Engine Studio/i)).toBeInTheDocument();
      expect(screen.getByText(/12 Core Engines Health & Throughput Matrix/i)).toBeInTheDocument();

      const execBtn = screen.getByRole('button', { name: /Execute Brain Directive/i });
      await act(async () => {
        fireEvent.click(execBtn);
      });

      expect(await screen.findByText(/Core Brain Directive Synthesis/i)).toBeInTheDocument();
      expect(screen.getByText(/Security Assessment/i)).toBeInTheDocument();
    });
  });

  describe('Scenario: Autonomous Issue Handling & Self-Healing Cockpit', () => {
    it('Given the user is on the platform, When clicking Self-Healing, Then the autonomous 10-pillar cockpit mounts', async () => {
      await act(async () => {
        render(<App />);
      });

      const healBtn = screen.getByRole('button', { name: /Self-Healing/i });
      await act(async () => {
        fireEvent.click(healBtn);
      });

      expect(screen.getByText(/Autonomous Issue Handling & Self-Healing Cockpit/i)).toBeInTheDocument();
      expect(screen.getByText(/Self-Learning Pattern Repository/i)).toBeInTheDocument();

      const triggerBtn = screen.getByRole('button', { name: /Trigger Self-Healing/i });
      await act(async () => {
        fireEvent.click(triggerBtn);
      });

      expect((await screen.findAllByText(/RESTORED/i)).length).toBeGreaterThanOrEqual(1);
    });
  });
});
