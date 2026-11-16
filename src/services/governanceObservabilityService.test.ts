import { describe, it, expect } from 'vitest';
import {
  runComplianceAudit,
  verifyLedgerAudit,
  triageIncident,
  getIncidentDossier,
  listIncidents,
} from './governanceObservabilityService';

describe('governanceObservabilityService Zero-Mock Suite', () => {
  it('should run compliance audit with fallback response', async () => {
    const dossier = await runComplianceAudit(
      'oenexa-auth',
      'ZERO_TRUST_RBAC',
      '// Zero-Trust verification context'
    );
    expect(dossier).toBeDefined();
    expect(dossier.compliant).toBe(true);
    expect(dossier.score).toBeGreaterThanOrEqual(0.9);
    expect(dossier.recommendations.length).toBeGreaterThan(0);
  });

  it('should verify ledger balance and compute discrepancy', async () => {
    const balancedAudit = await verifyLedgerAudit('acc-101', 1500.0, 1500.0, 'ONX');
    expect(balancedAudit.balanced).toBe(true);
    expect(balancedAudit.discrepancy).toBe(0);

    const unbalancedAudit = await verifyLedgerAudit('acc-102', 1500.0, 1400.0, 'ONX');
    expect(unbalancedAudit.balanced).toBe(false);
    expect(unbalancedAudit.discrepancy).toBe(100.0);
  });

  it('should triage incident with OOM stack trace as P1_CRITICAL', async () => {
    const triage = await triageIncident({
      title: 'Pod Heap Exhaustion',
      service: 'oenexa-trading',
      stackTrace: 'java.lang.OutOfMemoryError: Java heap space',
    });

    expect(triage.calculatedSeverity).toBe('P1_CRITICAL');
    expect(triage.rca.failureCategory).toBe('JVM_RESOURCE_EXHAUSTION');
    expect(triage.rca.confidenceScore).toBeGreaterThanOrEqual(0.9);
  });

  it('should triage non-OOM incident as P2_HIGH', async () => {
    const triage = await triageIncident({
      title: 'Slow Query Timeout',
      service: 'oenexa-order',
      stackTrace: 'TimeoutException: connection pool timeout',
    });

    expect(triage.calculatedSeverity).toBe('P2_HIGH');
    expect(triage.rca.failureCategory).toBe('APPLICATION_LOGIC');
  });

  it('should handle getIncidentDossier fallback gracefully', async () => {
    const dossier = await getIncidentDossier('INC-999');
    expect(dossier).toBeNull();
  });

  it('should handle listIncidents fallback gracefully', async () => {
    const list = await listIncidents();
    expect(Array.isArray(list)).toBe(true);
  });
});
