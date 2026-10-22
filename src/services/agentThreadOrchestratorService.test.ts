import { describe, it, expect } from 'vitest';
import {
  executeConcurrentSwarm,
  fetchActiveThreads,
} from './agentThreadOrchestratorService';

describe('Feature: OENEXA Multi-Agent Thread Orchestration Service', () => {
  it('should execute concurrent agent swarm using virtual thread logic with speedup', async () => {
    const result = await executeConcurrentSwarm({
      goalTitle: 'Build Distributed High-Throughput Event Mesh',
      strategy: 'PARALLEL_MAX_SPEED',
      targetAgents: ['ARCHITECT', 'SOFTWARE_ENGINEER', 'SECURITY', 'QA', 'DEVOPS', 'DATA_ENGINEER'],
    });

    expect(result).toBeDefined();
    expect(result.goalTitle).toBe('Build Distributed High-Throughput Event Mesh');
    expect(result.concurrencyMode).toBe('PARALLEL_MAX_SPEED');
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
      expect(tr.stageName).toBe('Parallel Swarm');
      expect(tr.executionDurationMs).toBeGreaterThan(0);
      expect(tr.memoryAllocatedKb).toBeGreaterThan(0);
      expect(tr.outputResult.length).toBeGreaterThan(10);
    });

    // Consolidated artifacts verification
    expect(result.consolidatedArtifacts.length).toBeGreaterThanOrEqual(4);
    expect(result.consolidatedArtifacts).toContain('DomainService.java');
    expect(result.consolidatedArtifacts).toContain('ArchitectureContext.puml');
  });

  it('should execute phased pipeline swarm with stage categorization', async () => {
    const result = await executeConcurrentSwarm({
      goalTitle: 'Design and Verify Zero-Trust Engine',
      strategy: 'PHASED_PIPELINE',
      targetAgents: ['ARCHITECT', 'SOFTWARE_ENGINEER', 'QA'],
    });

    expect(result.concurrencyMode).toBe('PHASED_PIPELINE');
    expect(result.activeThreadCount).toBe(3);
    expect(result.threadRecords.some((t) => t.stageName?.includes('Stage 1'))).toBe(true);
    expect(result.threadRecords.some((t) => t.stageName?.includes('Stage 2'))).toBe(true);
    expect(result.threadRecords.some((t) => t.stageName?.includes('Stage 3'))).toBe(true);
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
