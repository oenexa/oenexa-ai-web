import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  executeAutonomousLifecycle,
  getAutonomousTelemetry,
  detectAndResolveV2,
  triggerSelfHealingV2,
} from './autonomousIssueHandlingService';

describe('autonomousIssueHandlingService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should fall back to local simulation when network fails', async () => {
    const result = await executeAutonomousLifecycle('How to optimize virtual threads in Java 25?');
    expect(result.successful).toBe(true);
    expect(result.detect.category).toBe('QUERY');
    expect(result.resolve.validated).toBe(true);
    expect(result.learn.knowledgeBaseUpdated).toBe(true);
    expect(result.overallConfidence).toBeGreaterThanOrEqual(0.90);
  });

  it('should classify error inputs properly in fallback mode', async () => {
    const result = await executeAutonomousLifecycle('NullPointerException in UserRegistry');
    expect(result.detect.category).toBe('ERROR');
    expect(result.analyze.impactAssessment).toBe('High');
  });

  it('should return API response when backend succeeds', async () => {
    const mockApiResponse = {
      lifecycleId: 'OEN-LC-TEST-1',
      detect: { category: 'BUG', rawInput: 'Fix memory leak', summary: 'Bug', detectedAt: '2026-10-22T00:00:00Z' },
      analyze: { rootCause: 'OOM', impactAssessment: 'Critical', knowledgeBaseHit: true, relevantDocumentation: 'Docs' },
      resolve: { bestResponse: 'Fixed', validated: true, validationMethod: 'Tests', initialConfidence: 0.99 },
      learn: { learnedPatternId: 'PAT-BUG-1', knowledgeBaseUpdated: true, feedbackIncorporated: 'Yes' },
      escalate: { escalated: false, escalationThreshold: 0.90, deliberativeReasoningTrace: '', alternativeSolutions: [] },
      selfUpgrade: { upgradeTriggered: false, missingCapability: 'None', improvementDesign: 'None', testedAndValidated: false, safelyDeployed: false },
      continuousImprovement: { latencyMs: 8.5, responseQualityScore: 0.99, repeatedErrorsReduced: 25, speedAccuracyTrend: 'Optimal' },
      overallConfidence: 0.99,
      successful: true,
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });

    const result = await executeAutonomousLifecycle('Fix memory leak', 0.90, 'mock-jwt-token');
    expect(result.lifecycleId).toBe('OEN-LC-TEST-1');
    expect(result.detect.category).toBe('BUG');
  });

  it('should fetch telemetry with fallback', async () => {
    const telemetry = await getAutonomousTelemetry();
    expect(telemetry.status).toBe('ONLINE_SELF_IMPROVING');
    expect(telemetry.processedCount).toBeGreaterThan(0);
    expect(telemetry.repeatedErrorsPrevented).toBeGreaterThan(0);
  });

  it('diagnoses and generates fix via detectAndResolveV2', async () => {
    const result = await detectAndResolveV2(
      'java.lang.NullPointerException: in PaymentService',
      'PaymentService',
      'DEVELOPMENT',
      'HIGH'
    );
    expect(result.issueId).toContain('ISSUE-');
    expect(result.autoHealed).toBe(true);
    expect(result.patchDiff).toContain('--- a/PaymentService.java');
  });

  it('triggers self-healing cycle via triggerSelfHealingV2', async () => {
    const status = await triggerSelfHealingV2('CYCLE-TEST-1', 'DEADLOCK_RECOVERY');
    expect(status.cycleId).toBe('CYCLE-TEST-1');
    expect(status.status).toBe('RESTORED');
    expect(status.restored).toBe(true);
  });
});
