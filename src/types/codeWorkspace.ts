export interface CodeAnalysisResult {
  language: string;
  totalLines: number;
  classCount?: number;
  methodCount?: number;
  cyclomaticComplexity: number;
  classes?: string[];
  methods?: string[];
  imports?: string[];
  codeSmells?: string[];
  clean?: boolean;
}

export interface SecurityScanResult {
  scanId?: string;
  passed: boolean;
  totalIssues?: number;
  criticalCount?: number;
  highCount?: number;
  mediumCount?: number;
  lowCount?: number;
  vulnerabilities: string[];
  secrets: string[];
  summary?: string;
  compliance?: string;
  timestamp?: string;
}

export interface TestGenerationResult {
  suiteName?: string;
  framework?: string;
  code?: string;
  testCode?: string;
  generatedTests?: string[];
  estimatedCoveragePercent?: number;
  zeroMockEnforced?: boolean;
}
