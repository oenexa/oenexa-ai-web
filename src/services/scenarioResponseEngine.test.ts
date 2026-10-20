import { describe, it, expect } from 'vitest';
import { synthesizeRealScenarioResponse } from './scenarioResponseEngine';

describe('Feature: Real Scenario Response Engine', () => {
  it('should detect Python CSV parsing intent and synthesize python code artifact', () => {
    const result = synthesizeRealScenarioResponse({
      message: 'Write a python script to parse CSV files and compute average salary',
      conversationId: 'conv-python-test',
      preferredModel: 'claude-3-7-sonnet',
      includeThinking: true,
    });

    expect(result.intent).toBe('CODE_GENERATION');
    expect(result.reply.toLowerCase()).toContain('python');
    expect(result.artifacts).toHaveLength(1);
    expect(result.artifacts[0].language).toBe('python');
    expect(result.artifacts[0].code).toContain('import csv');
    expect(result.artifacts[0].filePath).toContain('.py');
  });

  it('should detect Spring Boot REST controller intent and synthesize Java controller artifact', () => {
    const result = synthesizeRealScenarioResponse({
      message: 'Create a Spring Boot REST controller for User profile management',
      conversationId: 'conv-spring-test',
      preferredModel: 'deepseek-r1:8b',
      includeThinking: true,
    });

    expect(result.intent).toBe('CODE_GENERATION');
    expect(result.reply).toContain('Spring Boot');
    expect(result.artifacts).toHaveLength(1);
    expect(result.artifacts[0].language).toBe('java');
    expect(result.artifacts[0].code).toContain('@RestController');
    expect(result.artifacts[0].code).toContain('@PostMapping');
  });

  it('should detect Java NullPointerException bug triage intent and synthesize defensive Java record', () => {
    const result = synthesizeRealScenarioResponse({
      message: 'Fix NullPointerException in User service when fetching profile',
      conversationId: 'conv-npe-test',
      preferredModel: 'deepseek-r1:8b',
      includeThinking: true,
    });

    expect(result.intent).toBe('BUG_FIX_ANALYSIS');
    expect(result.reply).toContain('NullPointerException');
    expect(result.artifacts).toHaveLength(1);
    expect(result.artifacts[0].language).toBe('java');
    expect(result.artifacts[0].code).toContain('Objects.requireNonNull');
  });

  it('should detect Architecture C4 blueprint intent and synthesize C4 architecture blueprint', () => {
    const result = synthesizeRealScenarioResponse({
      message: 'Design a clean hexagonal architecture blueprint for our enterprise microservices',
      conversationId: 'conv-arch-test',
      preferredModel: 'claude-3-7-sonnet',
      includeThinking: true,
    });

    expect(result.intent).toBe('ARCHITECTURE_DESIGN');
    expect(result.reply).toContain('Hexagonal');
    expect(result.artifacts).toHaveLength(1);
    expect(result.artifacts[0].code).toContain('Port');
  });

  it('should handle generalized fallback gracefully with dynamic context', () => {
    const result = synthesizeRealScenarioResponse({
      message: 'Explain quantum computing topological qubits',
      conversationId: 'conv-general-test',
      preferredModel: 'deepseek-r1:8b',
      includeThinking: true,
    });

    expect(result.intent).toBe('FAST_CHAT');
    expect(result.reply).toContain('quantum computing');
    expect(result.thoughtProcess).toBeDefined();
    expect(result.thoughtProcess?.length).toBeGreaterThan(50);
  });
});
