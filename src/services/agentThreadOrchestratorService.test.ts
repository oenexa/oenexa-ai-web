import { describe, it, expect } from 'vitest';
import {
  executeConcurrentSwarm,
  fetchActiveThreads,
} from './agentThreadOrchestratorService';

describe('Feature: Antigravity Multi-Agent Thread Orchestration Service', () => {
  it('should execute concurrent agent swarm using virtual thread logic with speedup', async () => {
    const result = await executeConcurrentSwarm({
      goalTitle: 'Build Distributed High-Throughput Event Mesh',
      targetAgents: ['ARCHITECT', 'SOFTWARE_ENGINEER', 'SECURITY', 'QA', 'DEVOPS', 'DATA_ENGINEER'],
    });

    expect(result).toBeDefined();
    expect(result.goalTitle).toBe('Build Distributed High-Throughput Event Mesh');
    expect(result.concurrencyMode).toBe('JAVA_25_STRUCTURED_VIRTUAL_THREADS');
    expect(result.activeThreadCount).toBe(6);
    expect(result.allPassed).toBe(true);

    // Concurrency verification
    expect(result.wallClockDurationMs).toBeGreaterThan(0);
    expect(result.sequentialDurationMs).toBeGreaterThanOrEqual(result.wallClockDurationMs);
    expect(result.speedupFactor).toBeGreaterThanOrEqual(1.0);

    // Thread records verification
    expect(result.threadRecords).toHaveLength(6);
    result.threadRecords.forEach((tr) => {
      expect(tr.threadName).toContain('oenexa-vthread-');
      expect(tr.state).toBe('COMPLETED');
      expect(tr.executionDurationMs).toBeGreaterThan(0);
      expect(tr.memoryAllocatedKb).toBeGreaterThan(0);
      expect(tr.outputResult.length).toBeGreaterThan(10);
    });

    // Consolidated artifacts verification
    expect(result.consolidatedArtifacts.length).toBeGreaterThanOrEqual(4);
    expect(result.consolidatedArtifacts).toContain('DomainService.java');
    expect(result.consolidatedArtifacts).toContain('ArchitectureContext.puml');
  });

  it('should default to full core swarm when no target agents provided', async () => {
    const result = await executeConcurrentSwarm({
      goalTitle: 'Autonomous Financial Ledger',
    });

    expect(result.activeThreadCount).toBe(6);
    expect(result.threadRecords.map((t) => t.agentType)).toContain('ARCHITECT');
    expect(result.threadRecords.map((t) => t.agentType)).toContain('SOFTWARE_ENGINEER');
  });

  it('should fetch active virtual threads', async () => {
    const threads = await fetchActiveThreads();
    expect(threads).toBeDefined();
    expect(Array.isArray(threads)).toBe(true);
  });
});
