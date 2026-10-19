export type ReviewVerdict = 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT';

export type SupportedLanguage =
  | 'JAVA'
  | 'GO'
  | 'RUST'
  | 'TYPESCRIPT'
  | 'JAVASCRIPT'
  | 'PYTHON'
  | 'KOTLIN'
  | 'CPP'
  | 'CSHARP'
  | 'PHP';

export type SupportedFramework =
  | 'SPRING_BOOT'
  | 'REACT'
  | 'ANGULAR'
  | 'NEXT_JS'
  | 'NEST_JS'
  | 'EXPRESS'
  | 'QUARKUS'
  | 'MICRONAUT';

export interface PrReviewFileComment {
  filePath: string;
  lineNumber: number;
  severity: string;
  category: string;
  comment: string;
  suggestedFixDiff: string;
}

export interface PrReviewRequest {
  prTitle: string;
  prDescription?: string;
  baseBranch?: string;
  headBranch?: string;
  diffContent: string;
}

export interface PrReviewResult {
  reviewId: string;
  verdict: ReviewVerdict;
  qualityScore: number;
  securityScore: number;
  summary: string;
  lineComments: PrReviewFileComment[];
  keyStrengths: string[];
  requiredChanges: string[];
  zeroMockCompliant: boolean;
  timestamp: string;
}

export interface ApiGenerationRequest {
  entityName: string;
  language?: SupportedLanguage;
  framework?: SupportedFramework;
  fields?: string[];
  operations?: string[];
}

export interface ApiGenerationResult {
  entityName: string;
  language: SupportedLanguage;
  framework: SupportedFramework;
  controllerCode: string;
  domainModelCode: string;
  openApiSpecYaml: string;
  unitTestCode: string;
  timestamp: string;
}

export interface RefactoringRequest {
  sourceCode: string;
  targetSmellOrGoal?: string;
  language?: SupportedLanguage;
}

export interface RefactoringResult {
  refactoredCode: string;
  patchDiff: string;
  improvementsApplied: string[];
  cyclomaticComplexityBefore: number;
  cyclomaticComplexityAfter: number;
  backwardsCompatible: boolean;
  timestamp: string;
}

export interface BugFixRequest {
  failingCode: string;
  errorOrStackTrace: string;
  expectedBehavior?: string;
}

export interface BugFixResult {
  fixedCode: string;
  rootCauseAnalysis: string;
  patchDiff: string;
  regressionTestCode: string;
  verified: boolean;
  timestamp: string;
}

export interface InfrastructureAutomationRequest {
  applicationName: string;
  framework?: SupportedFramework;
  port?: number;
  includeK8s?: boolean;
  includeCiCd?: boolean;
}

export interface InfrastructureAutomationResult {
  applicationName: string;
  dockerfile: string;
  kubernetesManifestYaml: string;
  githubActionsWorkflowYaml: string;
  dockerComposeYaml: string;
  timestamp: string;
}
