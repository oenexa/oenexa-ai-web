import { ModuleInfo } from '../types';

export const createDefaultModules = (): ModuleInfo[] => [
  {
    id: 'oenexa-chat',
    displayName: 'Intelligent Conversational Hub',
    description: 'Multi-model agent chat with real-time streaming, memory, and AST reasoning',
    capabilities: ['MULTI_MODEL', 'TOKEN_STREAMING', 'MEMORY_INSPECTION', 'ARTIFACT_EXTRACTION'],
    status: 'ACTIVE',
  },
  {
    id: 'oenexa-code',
    displayName: 'AST & Code Synthesis',
    description: 'AST parser, complexity analyzer, and code generation',
    capabilities: ['AST_ANALYSIS', 'REFACTORING', 'CODE_EXPLANATION'],
    status: 'ACTIVE',
  },
  {
    id: 'oenexa-security',
    displayName: 'Security SAST & Secrets',
    description: 'Automated vulnerability scanner and credential detection',
    capabilities: ['SAST_SCAN', 'SECRET_DETECTION', 'OWASP_AUDIT'],
    status: 'ACTIVE',
  },
  {
    id: 'oenexa-testing',
    displayName: 'Zero-Mock Test Synthesizer',
    description: 'JUnit 5, BDD, and JaCoCo coverage evaluator',
    capabilities: ['TEST_SYNTHESIS', 'COVERAGE_VERIFICATION'],
    status: 'ACTIVE',
  },
  {
    id: 'oenexa-documentation',
    displayName: 'Documentation & ADRs',
    description: 'Markdown ADRs and architecture diagrams',
    capabilities: ['ADR_GENERATION', 'MERMAID_EXPORT'],
    status: 'ACTIVE',
  },
  {
    id: 'oenexa-devops',
    displayName: 'DevOps & Manifests',
    description: 'Dockerfile, K8s, and CI/CD generation',
    capabilities: ['MANIFEST_AUDIT', 'PIPELINE_GEN'],
    status: 'ACTIVE',
  },
  {
    id: 'oenexa-pipeline',
    displayName: 'CI Build Failure Diagnosis',
    description: 'Automated repair for failed CI pipelines',
    capabilities: ['FAILURE_DIAGNOSIS', 'AUTO_PATCH'],
    status: 'ACTIVE',
  },
  {
    id: 'oenexa-rag',
    displayName: 'Semantic RAG Knowledge Base',
    description: 'Vector embeddings and cosine chunk search',
    capabilities: ['VECTOR_SEARCH', 'DOCUMENT_INGEST'],
    status: 'ACTIVE',
  },
  {
    id: 'oenexa-agent',
    displayName: 'Collaborative 7-Agent System',
    description: '7 specialized roles: Architecture, Code, Bug Fix, Test, DevOps, Docs, Security',
    capabilities: ['AGENT_ORCHESTRATION', 'PIPELINE_RUNNER'],
    status: 'ACTIVE',
  },
  {
    id: 'oenexa-core',
    displayName: 'Relational Multi-Tenancy',
    description: 'Organizations, teams, and projects kernel',
    capabilities: ['TENANCY_ISOLATION', 'RBAC'],
    status: 'ACTIVE',
  },
];

export const fetchPlatformModules = async (): Promise<ModuleInfo[]> => {
  try {
    const res = await fetch('/api/v1/modules');
    if (res.ok) {
      const data: ModuleInfo[] = await res.json();
      if (data && data.length > 0) return data;
    }
  } catch {
    // Fallback
  }
  return createDefaultModules();
};
