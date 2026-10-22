import { describe, it, expect } from 'vitest';
import {
  parseApiError,
  formatErrorMessage,
  isProblemDetail,
  OenexaProblemDetail,
} from './apiErrorService';

describe('apiErrorService Unit Tests', () => {
  it('correctly identifies valid RFC 7807/9457 ProblemDetail objects', () => {
    const valid: OenexaProblemDetail = {
      type: 'urn:oenexa:problem:validation',
      title: 'Validation Failed',
      status: 400,
      code: 'VALIDATION',
      message: 'Name is required',
      traceId: 'trace-123',
      timestamp: new Date().toISOString(),
      fieldErrors: [{ field: 'name', message: 'must not be blank' }],
    };

    expect(isProblemDetail(valid)).toBe(true);
    expect(isProblemDetail(null)).toBe(false);
    expect(isProblemDetail('error string')).toBe(false);
    expect(isProblemDetail({ status: 500 })).toBe(false);
  });

  it('parses structured ProblemDetail object with field errors', () => {
    const problem = parseApiError({
      type: 'urn:oenexa:problem:not-found',
      title: 'Resource Not Found',
      status: 404,
      code: 'NOT_FOUND',
      message: 'Session with ID 100 missing',
      path: '/api/v1/sessions/100',
      traceId: 'trace-abc',
      timestamp: '2026-10-22T20:00:00Z',
      remediation: 'Check session ID',
    });

    expect(problem.status).toBe(404);
    expect(problem.code).toBe('NOT_FOUND');
    expect(problem.message).toBe('Session with ID 100 missing');
    expect(problem.traceId).toBe('trace-abc');
    expect(problem.remediation).toBe('Check session ID');
  });

  it('parses JavaScript Error instances gracefully', () => {
    const err = new TypeError('Cannot read property of undefined');
    const parsed = parseApiError(err);

    expect(parsed.status).toBe(400);
    expect(parsed.code).toBe('CLIENT_ERROR');
    expect(parsed.title).toBe('TypeError');
    expect(parsed.message).toBe('Cannot read property of undefined');
    expect(parsed.traceId).toMatch(/^trace-/);
  });

  it('parses raw string errors gracefully', () => {
    const parsed = parseApiError('Network connection refused');

    expect(parsed.status).toBe(500);
    expect(parsed.code).toBe('GENERIC_ERROR');
    expect(parsed.message).toBe('Network connection refused');
  });

  it('formats error message including field errors when present', () => {
    const problem: OenexaProblemDetail = {
      type: 'urn:oenexa:problem:validation',
      title: 'Validation Failed',
      status: 400,
      code: 'VALIDATION',
      message: 'Validation failed',
      traceId: 'trace-1',
      timestamp: '2026-10-22T20:00:00Z',
      fieldErrors: [
        { field: 'email', message: 'invalid email format' },
        { field: 'password', message: 'minimum 8 characters' },
      ],
    };

    const formatted = formatErrorMessage(problem);
    expect(formatted).toBe('Validation failed (email: invalid email format, password: minimum 8 characters)');
  });
});
