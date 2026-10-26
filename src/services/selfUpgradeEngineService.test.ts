import { describe, it, expect, beforeEach } from 'vitest';
import {
  getSelfUpgradeState,
  runSelfUpgradeCycle,
  toggleAutoUpgrade,
  verifyArchitectureInvariants,
} from './selfUpgradeEngineService';

describe('SelfUpgradeEngineService Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('retrieves initial self-upgrade state with active version and health score', () => {
    const state = getSelfUpgradeState();
    expect(state.currentVersion).toMatch(/^v\d+\.\d+\.\d+$/);
    expect(state.healthScore).toBe(100);
    expect(state.autoUpgradeEnabled).toBe(true);
    expect(state.history.length).toBeGreaterThanOrEqual(1);
  });

  it('toggles auto-upgrade setting and persists state', () => {
    const disabled = toggleAutoUpgrade(false);
    expect(disabled).toBe(false);
    expect(getSelfUpgradeState().autoUpgradeEnabled).toBe(false);

    const reEnabled = toggleAutoUpgrade(true);
    expect(reEnabled).toBe(true);
    expect(getSelfUpgradeState().autoUpgradeEnabled).toBe(true);
  });

  it('verifies hexagonal architecture invariants with zero violations', () => {
    const result = verifyArchitectureInvariants();
    expect(result.compliant).toBe(true);
    expect(result.violations).toHaveLength(0);
    expect(result.score).toBe(100);
  });

  it('executes a complete self-upgrade cycle and increments version', async () => {
    const initialVersion = getSelfUpgradeState().currentVersion;
    const phasesRecorded: string[] = [];

    const record = await runSelfUpgradeCycle('MANUAL', (phase) => {
      phasesRecorded.push(phase);
    });

    expect(record.status).toBe('SUCCESS');
    expect(record.testsPassed).toBe(66);
    expect(record.fromVersion).toBe(initialVersion);
    expect(record.toVersion).not.toBe(initialVersion);
    expect(phasesRecorded).toContain('HEALTH_CHECK');
    expect(phasesRecorded).toContain('TEST_VALIDATION');
    expect(phasesRecorded).toContain('VERSION_DEPLOYED');

    const newState = getSelfUpgradeState();
    expect(newState.currentVersion).toBe(record.toVersion);
  });
});
