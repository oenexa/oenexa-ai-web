import { describe, it, expect } from 'vitest';
import {
  queryMemoryEngineV2,
  getMemoryEngineV2Stats,
  compressContextV2,
  getRepositoryGraphV2,
  storeHierarchicalMemory,
  retrieveHierarchicalMemory,
  getMemoryHierarchyStats,
} from './memoryHierarchyService';

describe('Feature: Memory Hierarchy & V2 Memory Engine Service', () => {
  it('should query V2 6-step data movement pipeline and return deterministic steps', async () => {
    const trace = await queryMemoryEngineV2('ws-test', 'UserService.java');
    expect(trace).toBeDefined();
    expect(trace.queryKey).toBe('UserService.java');
    expect(trace.found).toBe(true);
    expect(trace.steps.length).toBeGreaterThanOrEqual(4);
    expect(trace.totalDurationNanos).toBeGreaterThan(0);
  });

  it('should retrieve V2 memory engine statistics with effective memory multiplier', async () => {
    const stats = await getMemoryEngineV2Stats();
    expect(stats).toBeDefined();
    expect(stats.totalEffectiveMemoryBytes).toBeGreaterThan(500_000_000_000); // > 500 GB
    expect(stats.physicalRamUsedBytes).toBeGreaterThan(0);
    expect(stats.compressionRatio).toBeGreaterThan(50.0);
  });

  it('should compress raw context and report metrics with compression ratio', async () => {
    const rawCode = 'class Example { int x = 1; }\nclass Example { int x = 1; }\n'.repeat(10);
    const metrics = await compressContextV2(rawCode);
    expect(metrics).toBeDefined();
    expect(metrics.originalSizeBytes).toBeGreaterThan(0);
    expect(metrics.compressedSizeBytes).toBeLessThan(metrics.originalSizeBytes);
    expect(metrics.compressionRatioPercent).toBeGreaterThan(50.0);
  });

  it('should retrieve modular repository memory graph nodes', async () => {
    const modules = await getRepositoryGraphV2('ws-test');
    expect(modules).toBeDefined();
    expect(modules.length).toBeGreaterThanOrEqual(3);
    const domainMod = modules.find((m) => m.moduleId === 'mod-domain');
    expect(domainMod).toBeDefined();
    expect(domainMod?.isLoadedInRam).toBe(true);
  });

  it('should fallback gracefully for V1 hierarchical storage and stats', async () => {
    const stored = await storeHierarchicalMemory('ws-1', 'doc.txt', 'Content payload');
    expect(stored.memoryKey).toBe('doc.txt');

    const retrieved = await retrieveHierarchicalMemory('ws-1', 'doc.txt');
    expect(retrieved.hit).toBe(true);

    const stats = await getMemoryHierarchyStats();
    expect(stats.cacheHitRatio).toBeGreaterThan(90);
  });
});
