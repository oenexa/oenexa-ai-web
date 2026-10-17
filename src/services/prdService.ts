import { ProductRequirementsDocument } from '../types';

export const createDefaultPrd = (): ProductRequirementsDocument => ({
  prdId: 'prd-default-1',
  title: 'Real-Time Collaborative Code Review Microservice',
  targetAudience: 'Enterprise Software Engineers & Cloud Architects',
  problemStatement:
    'Development teams require automated peer review with AST linting, zero-mock testing enforcement, and air-gapped security audit before pull request approval.',
  keyFeatures: [
    'Real-time WebSocket & SSE diff collaboration',
    'AST code smells analysis and cyclomatic complexity scoring',
    'Strictly Zero-Mock JUnit 5 test suite generation',
    'Air-Gapped private inference with zero cloud data leaks',
  ],
  userStories: [
    {
      id: 'story-1',
      title: 'Automated Real-Time AST Review',
      asA: 'Staff Software Engineer',
      iWant: 'the AI Agent to automatically inspect code smells and branch complexity on save',
      soThat: 'architectural violations are prevented before code merge',
      acceptanceCriteria: [
        'Given a Java or TypeScript source file',
        'When the developer triggers AST analysis',
        'Then cyclomatic complexity and code smells are reported with 100% precision',
      ],
      storyPoints: 5,
      status: 'READY_FOR_DEV',
    },
    {
      id: 'story-2',
      title: 'Air-Gapped Local Inference Execution',
      asA: 'Security Architect',
      iWant: 'all LLM and embedding calls to execute against local Ollama models',
      soThat: 'no proprietary codebase telemetry or source code leaks outside the corporate firewall',
      acceptanceCriteria: [
        'Given localFirstMode is active',
        'When an autonomous engineering goal is dispatched',
        'Then external egress is blocked and local Ollama endpoint http://localhost:11434 is utilized',
      ],
      storyPoints: 8,
      status: 'IN_PROGRESS',
    },
  ],
  technicalConstraints: [
    'PostgreSQL 16 + pgvector',
    'Java 25 & Spring Boot 4.1.1 Hexagonal Monolith',
    'Strictly Zero-Mock Testing Policy (no Mockito, no PowerMock)',
    '100% JaCoCo line coverage enforcement',
  ],
  releaseRoadmap: 'v2.5.0 Enterprise Autonomous Release',
  createdAt: new Date().toISOString(),
});

export const synthesizePrd = async (
  goal: string,
  targetAudience: string,
  token?: string | null
): Promise<ProductRequirementsDocument> => {
  try {
    const res = await fetch('/api/v1/argon/prd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        goal,
        targetAudience: targetAudience || 'Enterprise Developers',
      }),
    });
    if (res.ok) {
      return (await res.json()) as ProductRequirementsDocument;
    }
  } catch {
    // Fallback for offline / resilient execution
  }

  return {
    prdId: 'prd-' + Date.now(),
    title: goal.startsWith('Real-Time')
      ? goal
      : `Autonomous Engineering Platform: ${goal}`,
    targetAudience: targetAudience || 'Enterprise Software Engineers & Cloud Architects',
    problemStatement: `Modern software engineering demands multi-turn autonomous reasoning, zero-mock testing, multimodal ingestion, and strict air-gapped privacy without cloud data leaks for ${goal}.`,
    keyFeatures: [
      'Local-first air-gapped inference via Ollama with 0 external telemetry',
      'Native multimodal ingestion (Voice speech directives, Architecture diagrams, Specification files)',
      'AI Product Manager autonomous PRD synthesis and INVEST user stories',
      '7-Stage collaborative ReAct plan DAG with self-healing reflection loops',
    ],
    userStories: [
      {
        id: 'story-gen-1',
        title: `Implement Core Engine for ${goal.slice(0, 30)}`,
        asA: 'Staff Software Engineer',
        iWant: 'to run local-first air-gapped agentic tasks with zero cloud leakage',
        soThat: 'sensitive proprietary architectures remain completely secure',
        acceptanceCriteria: [
          'Given an air-gapped enterprise network',
          'When an autonomous goal is launched with localFirstMode enabled',
          'Then zero telemetry packets are transmitted to external endpoints',
        ],
        storyPoints: 5,
        status: 'READY_FOR_DEV',
      },
      {
        id: 'story-gen-2',
        title: 'Native Multimodal Context Ingestion',
        asA: 'Engineering Lead',
        iWant: 'the AI Agent to ingest voice directives, architecture diagrams, and specification files',
        soThat: 'end-to-end context is captured across multimodal engineering artifacts',
        acceptanceCriteria: [
          'Given an architecture diagram PNG or developer voice memo',
          'When the multimodal attachment is processed',
          'Then extracted text/spatial layout is embedded into the autonomous plan DAG',
        ],
        storyPoints: 8,
        status: 'IN_PROGRESS',
      },
    ],
    technicalConstraints: [
      'PostgreSQL 16 + pgvector storage',
      'Strictly Zero-Mock Testing Policy (no Mockito, no PowerMock)',
      '100% JaCoCo line coverage verification',
    ],
    releaseRoadmap: 'v2.5.0 Enterprise Autonomous Release',
    createdAt: new Date().toISOString(),
  };
};
