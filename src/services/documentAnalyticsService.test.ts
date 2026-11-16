import { describe, it, expect } from 'vitest';
import {
  generateDocument,
  getDocument,
  getPlatformAnalytics,
  resolveDeveloperSupportQuery,
} from './documentAnalyticsService';

describe('documentAnalyticsService Zero-Mock Unit Tests', () => {
  it('should generate ADR document with fallback markdown content', async () => {
    const doc = await generateDocument({
      type: 'ADR',
      title: '0003-modular-governance',
      context: 'Establish boundary isolation rules for multi-tenant gateway.',
    });

    expect(doc).toBeDefined();
    expect(doc.type).toBe('ADR');
    expect(doc.title).toBe('0003-modular-governance');
    expect(doc.markdownContent).toContain('# ADR: 0003-modular-governance');
    expect(doc.markdownContent).toContain('Context');
  });

  it('should return null for getDocument in offline mode', async () => {
    const doc = await getDocument('DOC-999');
    expect(doc).toBeNull();
  });

  it('should retrieve platform analytics with valid token consumption metrics', async () => {
    const analytics = await getPlatformAnalytics('oenexa-prod');
    expect(analytics).toBeDefined();
    expect(analytics.tenantId).toBe('oenexa-prod');
    expect(analytics.totalTokensConsumed).toBeGreaterThan(0);
    expect(analytics.totalCostUsd).toBeGreaterThan(0);
    expect(analytics.modelDistribution['oenexa-gpt-o3']).toBeDefined();
  });

  it('should resolve developer testing questions with zero-mock guidance', async () => {
    const resolution = await resolveDeveloperSupportQuery({
      question: 'How do I mock a Spring bean in tests?',
    });

    expect(resolution).toBeDefined();
    expect(resolution.resolutionSummary).toContain('Zero-Mock');
    expect(resolution.suggestedCommands).toContain('./gradlew test');
    expect(resolution.confidenceScore).toBeGreaterThanOrEqual(0.9);
  });

  it('should resolve general developer queries with handbook references', async () => {
    const resolution = await resolveDeveloperSupportQuery({
      question: 'Where can I find onboarding details?',
    });

    expect(resolution).toBeDefined();
    expect(resolution.relevantDocs).toContain('docs/developer-handbook.md');
    expect(resolution.confidenceScore).toBeGreaterThan(0.8);
  });
});
