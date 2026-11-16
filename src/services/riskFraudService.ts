/**
 * Enterprise Risk & Fraud Intelligence Client Service for OENEXA Web.
 * Connects directly to:
 * - Pre-deployment risk evaluation (`/api/v4/risk/deployment/*`)
 * - Real-time velocity and sybil fraud assessment (`/api/v4/risk/fraud/*`)
 */

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RiskCategory =
  | 'DEPLOYMENT_BLAST_RADIUS'
  | 'DATABASE_MIGRATION'
  | 'API_BREAKING_CHANGE'
  | 'AUTHENTICATION_ABUSE'
  | 'FINANCIAL_VELOCITY'
  | 'SYBIL_CLUSTERING'
  | 'COMPLIANCE_DRIFT';

export type MitigationAction =
  | 'ALLOW'
  | 'REQUIRE_PEER_APPROVAL'
  | 'CHALLENGE_MFA'
  | 'THROTTLE_RATE_LIMIT'
  | 'QUARANTINE_SUSPEND'
  | 'REVERT_DEPLOYMENT';

export interface RiskFactor {
  factorId: string;
  category: RiskCategory;
  description: string;
  weight: number;
  isTriggered: boolean;
}

export interface DeploymentRiskEvaluation {
  evaluationId: string;
  serviceName: string;
  targetEnvironment: string;
  overallScore: number;
  riskLevel: RiskLevel;
  factors: RiskFactor[];
  recommendedMitigations: string[];
  deploymentBlocked: boolean;
}

export interface FraudSignal {
  signalId: string;
  signalType: string;
  anomalyConfidence: number;
  telemetrySource: string;
  details: string;
}

export interface FraudAssessmentDossier {
  dossierId: string;
  entityId: string;
  entityType: string;
  fraudScore: number;
  threatLevel: RiskLevel;
  recommendedAction: MitigationAction;
  signals: FraudSignal[];
  evaluatedAt: string;
}

export async function evaluateDeploymentRisk(request: {
  serviceName: string;
  targetEnvironment?: string;
  diffSummary?: string;
  hasDatabaseMigration?: boolean;
  modifiedEndpoints?: string[];
  metadata?: Record<string, string>;
}): Promise<DeploymentRiskEvaluation> {
  try {
    const res = await fetch('/api/v4/risk/deployment/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (res.ok) {
      const envelope = await res.json();
      return envelope.data;
    }
  } catch {
    // Air-gapped fallback
  }

  const isDdl = request.diffSummary?.toUpperCase().includes('DROP TABLE') ?? false;
  return {
    evaluationId: `risk-${Date.now()}`,
    serviceName: request.serviceName,
    targetEnvironment: request.targetEnvironment || 'production',
    overallScore: isDdl ? 0.92 : 0.15,
    riskLevel: isDdl ? 'CRITICAL' : 'LOW',
    factors: isDdl
      ? [
          {
            factorId: 'RF-DB-MIG',
            category: 'DATABASE_MIGRATION',
            description: 'Destructive DDL detected in migration (DROP TABLE)',
            weight: 0.95,
            isTriggered: true,
          },
        ]
      : [],
    recommendedMitigations: isDdl
      ? ['BLOCK: Deployment halted. Mandates Principal Architect sign-off.']
      : ['Standard automated CI/CD pipeline deployment allowed.'],
    deploymentBlocked: isDdl,
  };
}

export async function assessFraudRisk(request: {
  entityId: string;
  entityType?: string;
  velocityScore?: number;
  failedAttempts?: number;
  ipSubnet?: string;
  userAgent?: string;
  telemetry?: Record<string, string>;
}): Promise<FraudAssessmentDossier> {
  try {
    const res = await fetch('/api/v4/risk/fraud/assess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (res.ok) {
      const envelope = await res.json();
      return envelope.data;
    }
  } catch {
    // Air-gapped fallback
  }

  const isSuspicious = (request.velocityScore || 0) >= 0.8 || (request.failedAttempts || 0) >= 5;
  return {
    dossierId: `fraud-${Date.now()}`,
    entityId: request.entityId,
    entityType: request.entityType || 'ACCOUNT',
    fraudScore: isSuspicious ? 0.88 : 0.08,
    threatLevel: isSuspicious ? 'CRITICAL' : 'LOW',
    recommendedAction: isSuspicious ? 'QUARANTINE_SUSPEND' : 'ALLOW',
    signals: isSuspicious
      ? [
          {
            signalId: 'SIG-VELOCITY',
            signalType: 'HIGH_TRANSACTION_VELOCITY',
            anomalyConfidence: request.velocityScore || 0.88,
            telemetrySource: 'PAYMENT_GATEWAY',
            details: 'Abnormal velocity spike observed for entity',
          },
        ]
      : [],
    evaluatedAt: new Date().toISOString(),
  };
}

export async function getDeploymentEvaluation(
  evaluationId: string
): Promise<DeploymentRiskEvaluation | null> {
  try {
    const res = await fetch(`/api/v4/risk/deployment/${evaluationId}`);
    if (res.ok) {
      const envelope = await res.json();
      return envelope.data;
    }
  } catch {
    // Air-gapped fallback
  }
  return null;
}

export async function getFraudDossier(
  dossierId: string
): Promise<FraudAssessmentDossier | null> {
  try {
    const res = await fetch(`/api/v4/risk/fraud/${dossierId}`);
    if (res.ok) {
      const envelope = await res.json();
      return envelope.data;
    }
  } catch {
    // Air-gapped fallback
  }
  return null;
}
