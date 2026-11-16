import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  evaluateGatewayDirective,
  analyzeRepository,
  reviewDevOps,
  auditSecurity,
  executeRagQuery,
  listPromptTemplates,
  renderPromptTemplate,
} from './aiPlatformUpgradeService';

describe('aiPlatformUpgradeService Zero-Mock Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('evaluates gateway directives and enforces sovereign defaults', async () => {
    const res = await evaluateGatewayDirective('tenant-alpha', 'Generate clean architecture');

    expect(res).toBeDefined();
    expect(res.tenantId).toBe('tenant-alpha');
    expect(res.action).toBe('ALLOW');
    expect(res.sovereignEnforced).toBe(true);
    expect(res.remainingBudgetUsd).toBeGreaterThan(0);
  });

  it('analyzes repository structure and computes maintainability score', async () => {
    const res = await analyzeRepository('oenexa-ai-core', ['domain/Domain.java', 'api/Controller.java']);

    expect(res.repositoryName).toBe('oenexa-ai-core');
    expect(res.maintainabilityScore).toBeGreaterThan(0.9);
    expect(res.identifiedModules).toContain('domain');
    expect(res.identifiedModules).toContain('api');
  });

  it('reviews DevOps manifests for production readiness', async () => {
    const res = await reviewDevOps('payment-service');

    expect(res.applicationName).toBe('payment-service');
    expect(res.productionReady).toBe(true);
    expect(res.containerVulnerabilities).toHaveLength(0);
  });

  it('audits security and checks compliance', async () => {
    const res = await auditSecurity('auth-module');

    expect(res.targetScope).toBe('auth-module');
    expect(res.passCompliance).toBe(true);
    expect(res.criticalCount).toBe(0);
  });

  it('executes RAG queries with verified citations and faithfulness', async () => {
    const res = await executeRagQuery('Hexagonal Architecture Java 25', ['ADR_RECORD']);

    expect(res.synthesizedAnswer).toContain('hexagonal');
    expect(res.attributedSources).toHaveLength(1);
    expect(res.verification.verified).toBe(true);
    expect(res.verification.faithfulnessScore).toBeGreaterThan(0.9);
  });

  it('lists prompt templates and filters by role', async () => {
    const templates = await listPromptTemplates();
    expect(templates.length).toBeGreaterThan(0);
    expect(templates.map((t) => t.role)).toContain('SOFTWARE_ENGINEER');
  });

  it('renders prompt template with variable interpolation', async () => {
    const rendered = await renderPromptTemplate('prompt-swe-01', {
      componentType: 'Service',
      domainName: 'Auth',
    });

    expect(rendered.templateId).toBe('prompt-swe-01');
    expect(rendered.renderedUserPrompt).toContain('Service');
    expect(rendered.renderedUserPrompt).toContain('Auth');
  });
});
