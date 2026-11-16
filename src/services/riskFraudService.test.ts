import { describe, it, expect } from 'vitest';
import {
  evaluateDeploymentRisk,
  assessFraudRisk,
  getDeploymentEvaluation,
  getFraudDossier,
} from './riskFraudService';

describe('riskFraudService Zero-Mock Unit Tests', () => {
  it('should evaluate destructive DDL deployment as blocked CRITICAL risk', async () => {
    const evalResult = await evaluateDeploymentRisk({
      serviceName: 'oenexa-wallet',
      diffSummary: 'DROP TABLE balances;',
      hasDatabaseMigration: true,
    });

    expect(evalResult).toBeDefined();
    expect(evalResult.deploymentBlocked).toBe(true);
    expect(evalResult.riskLevel).toBe('CRITICAL');
    expect(evalResult.overallScore).toBeGreaterThanOrEqual(0.85);
    expect(evalResult.recommendedMitigations.some((m) => m.includes('BLOCK'))).toBe(true);
  });

  it('should evaluate non-destructive safe deployment as unblocked LOW risk', async () => {
    const evalResult = await evaluateDeploymentRisk({
      serviceName: 'oenexa-docs',
      diffSummary: 'docs: update readme links',
    });

    expect(evalResult).toBeDefined();
    expect(evalResult.deploymentBlocked).toBe(false);
    expect(evalResult.riskLevel).toBe('LOW');
  });

  it('should assess high velocity user as CRITICAL fraud risk with QUARANTINE_SUSPEND', async () => {
    const dossier = await assessFraudRisk({
      entityId: 'usr-attacker-99',
      velocityScore: 0.95,
      failedAttempts: 7,
    });

    expect(dossier).toBeDefined();
    expect(dossier.threatLevel).toBe('CRITICAL');
    expect(dossier.recommendedAction).toBe('QUARANTINE_SUSPEND');
    expect(dossier.fraudScore).toBeGreaterThanOrEqual(0.8);
    expect(dossier.signals.length).toBeGreaterThan(0);
  });

  it('should assess low velocity user as LOW risk with ALLOW', async () => {
    const dossier = await assessFraudRisk({
      entityId: 'usr-normal-01',
      velocityScore: 0.1,
      failedAttempts: 0,
    });

    expect(dossier).toBeDefined();
    expect(dossier.threatLevel).toBe('LOW');
    expect(dossier.recommendedAction).toBe('ALLOW');
  });

  it('should return null on fallback getDeploymentEvaluation', async () => {
    const evalResult = await getDeploymentEvaluation('RISK-999');
    expect(evalResult).toBeNull();
  });

  it('should return null on fallback getFraudDossier', async () => {
    const dossier = await getFraudDossier('FRAUD-999');
    expect(dossier).toBeNull();
  });
});
