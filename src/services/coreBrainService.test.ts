import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  executeDirective,
  executeDirectiveV2,
  getCoreModulesStatus,
  getObservabilityTelemetry,
} from './coreBrainService';

describe('coreBrainService Zero-Mock Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('executes directive with fallback simulation when offline', async () => {
    const directive = {
      objective: 'Verify zero-mock hexagonal boundaries across all modules',
      preferredModel: 'oenexa-neo-gpt-o3-max',
      reasoningEffort: 'high' as const,
    };

    const res = await executeDirective(directive);

    expect(res).toBeDefined();
    expect(res.status).toBe('COMPLETED');
    expect(res.routingDecision.selectedModel).toBe('oenexa-neo-gpt-o3-max');
    expect(res.securityAssessment.allowed).toBe(true);
    expect(res.reasoningSteps.length).toBeGreaterThan(0);
    expect(res.performanceSnapshot.activeVirtualThreads).toBeGreaterThan(0);
    expect(res.synthesizedArtifacts.length).toBeGreaterThan(0);
  });

  it('executes directive V2 adhering to 11-layer architecture', async () => {
    const res = await executeDirectiveV2('dir-test-01', 'Test 11-Layer Clean Architecture', 'HIGH');

    expect(res.executionId).toBe('dir-test-01');
    expect(res.status).toBe('COMPLETED');
    expect(res.executedPhases).toContain('SECURITY_POLICY');
    expect(res.confidenceScore).toBeGreaterThan(0.9);
  });

  it('retrieves status for all 12 core engines', async () => {
    const modules = await getCoreModulesStatus();

    expect(modules).toHaveLength(12);
    expect(modules.map((m) => m.type)).toContain('AI_GATEWAY');
    expect(modules.map((m) => m.type)).toContain('MODEL_ROUTER');
    expect(modules.map((m) => m.type)).toContain('REASONING_ENGINE');
    expect(modules.map((m) => m.type)).toContain('OBSERVABILITY_ENGINE');

    modules.forEach((mod) => {
      expect(mod.healthScore).toBeGreaterThanOrEqual(0.9);
      expect(mod.status).toBe('HEALTHY');
      expect(mod.processedRequests).toBeGreaterThan(0);
    });
  });

  it('retrieves system observability telemetry', async () => {
    const telemetry = await getObservabilityTelemetry();

    expect(telemetry.status).toBe('OPTIMAL');
    expect(telemetry.zeroMockCompliance).toBe('100%');
    expect(telemetry.speedupFactor).toBeGreaterThan(4.0);
  });
});
