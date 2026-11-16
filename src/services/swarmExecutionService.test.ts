import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  executeSwarm,
  getSwarmStatus,
  getSwarmTelemetry,
} from './swarmExecutionService';

describe('SwarmExecutionService Zero-Mock Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should execute swarm plan and return synthesized plan in fallback mode', async () => {
    const plan = await executeSwarm(
      'Deploy Zero-Trust Microservices',
      'PHASED_PIPELINE',
      ['SYSTEM_ARCHITECT', 'SOFTWARE_ENGINEER', 'QA_VERIFICATION']
    );

    expect(plan.planId).toContain('swarm-plan-');
    expect(plan.goal).toBe('Deploy Zero-Trust Microservices');
    expect(plan.tasks.length).toBe(3);
    expect(plan.overallStatus).toBe('COMPLETED');
    expect(plan.speedupFactor).toBeGreaterThanOrEqual(3.8);
    expect(Object.keys(plan.synthesizedArtifacts).length).toBe(3);
  });

  it('should execute parallel max speed strategy', async () => {
    const plan = await executeSwarm(
      'Instant Security Audit',
      'PARALLEL_MAX_SPEED',
      ['SECURITY_AUDITOR', 'DEVOPS_ENGINEER']
    );

    expect(plan.tasks.length).toBe(2);
    for (const t of plan.tasks) {
      expect(t.stage).toBe(0);
      expect(t.status).toBe('COMPLETED');
    }
  });

  it('should retrieve status and telemetry safely with fallbacks', async () => {
    const status = await getSwarmStatus('test-plan-1');
    expect(status).toBeNull();

    const telemetry = await getSwarmTelemetry('test-plan-1');
    expect(telemetry.planId).toBe('test-plan-1');
    expect(telemetry.activeThreads).toBe(3);
    expect(telemetry.concurrencySpeedup).toBe(4.8);
  });
});
