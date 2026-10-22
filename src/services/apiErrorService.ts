/**
 * Enterprise API Error & Problem Details Parser for OENEXA.
 * Standardizes RFC 7807 and RFC 9457 HTTP Problem Details, network failures,
 * and uncaught exceptions into uniform, actionable error models.
 */

export interface FieldErrorDetail {
  field: string;
  rejectedValue?: unknown;
  message: string;
}

export interface OenexaProblemDetail {
  type: string;
  title: string;
  status: number;
  code: string;
  message: string;
  path?: string;
  traceId: string;
  timestamp: string;
  fieldErrors?: FieldErrorDetail[];
  remediation?: string;
}

export function isProblemDetail(obj: unknown): obj is OenexaProblemDetail {
  if (typeof obj !== 'object' || obj === null) return false;
  const candidate = obj as Record<string, unknown>;
  return (
    typeof candidate.status === 'number' &&
    typeof candidate.code === 'string' &&
    (typeof candidate.message === 'string' || typeof candidate.detail === 'string')
  );
}

export function parseApiError(error: unknown, fallbackMessage: string = 'An unexpected platform error occurred'): OenexaProblemDetail {
  const now = new Date().toISOString();
  const generatedTraceId = `trace-${Math.random().toString(36).substring(2, 10)}`;

  if (isProblemDetail(error)) {
    return {
      type: error.type || 'urn:oenexa:problem:api-error',
      title: error.title || 'Platform Error',
      status: error.status,
      code: error.code || 'API_ERROR',
      message: error.message || (error as unknown as { detail?: string }).detail || fallbackMessage,
      path: error.path,
      traceId: error.traceId || generatedTraceId,
      timestamp: error.timestamp || now,
      fieldErrors: error.fieldErrors || [],
      remediation: error.remediation || 'Please verify request inputs and retry.',
    };
  }

  if (error instanceof Error) {
    return {
      type: 'urn:oenexa:problem:client-error',
      title: error.name || 'Client Runtime Error',
      status: 400,
      code: 'CLIENT_ERROR',
      message: error.message || fallbackMessage,
      traceId: generatedTraceId,
      timestamp: now,
      fieldErrors: [],
      remediation: 'Inspect error stack diagnostics or reload the application.',
    };
  }

  if (typeof error === 'string') {
    return {
      type: 'urn:oenexa:problem:generic',
      title: 'Platform Message',
      status: 500,
      code: 'GENERIC_ERROR',
      message: error,
      traceId: generatedTraceId,
      timestamp: now,
      fieldErrors: [],
      remediation: 'Contact platform support if this error persists.',
    };
  }

  return {
    type: 'urn:oenexa:problem:unknown',
    title: 'Unknown Fault',
    status: 500,
    code: 'UNKNOWN',
    message: fallbackMessage,
    traceId: generatedTraceId,
    timestamp: now,
    fieldErrors: [],
    remediation: 'Retry operation with exponential backoff.',
  };
}

export function formatErrorMessage(problem: OenexaProblemDetail): string {
  if (problem.fieldErrors && problem.fieldErrors.length > 0) {
    const fieldSummaries = problem.fieldErrors.map((fe) => `${fe.field}: ${fe.message}`).join(', ');
    return `${problem.message} (${fieldSummaries})`;
  }
  return problem.message;
}
