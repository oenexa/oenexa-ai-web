import { describe, it, expect } from 'vitest';
import {
  processWebhookDirective,
  inspectLocalRepository,
  listIntegrationConfigs,
} from './enterpriseIntegrationService';

describe('enterpriseIntegrationService Zero-Mock Unit Tests', () => {
  it('should process GitHub PR webhook directive with fallback review artifact', async () => {
    const result = await processWebhookDirective(
      'GITHUB',
      'DEL-100',
      'PULL_REQUEST',
      'oenexa/oenexa-ai-core',
      'feature/upgrade',
      'developer'
    );

    expect(result).toBeDefined();
    expect(result.deliveryId).toBe('DEL-100');
    expect(result.processedSuccessfully).toBe(true);
    expect(result.actionTaken).toBe('AUTOMATED_PR_REVIEW_AND_SAST_SCAN');
    expect(result.generatedArtifacts).toContain('pr-review-summary.md');
  });

  it('should inspect local repository and return detected languages and modules', async () => {
    const report = await inspectLocalRepository('.');

    expect(report).toBeDefined();
    expect(report.repositoryName).toBe('oenexa-ai-core');
    expect(report.currentBranch).toBe('main');
    expect(report.detectedLanguages).toContain('Java');
    expect(report.topLevelModules).toContain('domain');
    expect(report.topLevelModules).toContain('integrations');
  });

  it('should list pre-seeded integration configs including GitHub and GitLab', async () => {
    const configs = await listIntegrationConfigs();

    expect(configs).toBeDefined();
    expect(configs.length).toBeGreaterThanOrEqual(3);
    expect(configs.some((c) => c.provider === 'GITHUB')).toBe(true);
    expect(configs.some((c) => c.provider === 'GITLAB')).toBe(true);
  });
});
