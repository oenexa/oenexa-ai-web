import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React, { useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

const FaultyComponent: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Simulated UI rendering crash');
  }
  return <div>Normal Content Rendering</div>;
};

const RecoveryWrapper: React.FC<{ onResetCallback: () => void }> = ({ onResetCallback }) => {
  const [hasCrash, setHasCrash] = useState(true);

  return (
    <ErrorBoundary
      onReset={() => {
        setHasCrash(false);
        onResetCallback();
      }}
    >
      <FaultyComponent shouldThrow={hasCrash} />
    </ErrorBoundary>
  );
};

describe('ErrorBoundary Unit Tests', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('renders children normally when no exception is thrown', () => {
    render(
      <ErrorBoundary>
        <FaultyComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal Content Rendering')).toBeInTheDocument();
  });

  it('catches render errors and displays industrial error screen with trace ID', () => {
    render(
      <ErrorBoundary>
        <FaultyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/OENEXA Platform Runtime Error/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Simulated UI rendering crash/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Trace ID:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Copy Diagnostics/i })).toBeInTheDocument();
  });

  it('allows recovery when Try Again is clicked', () => {
    const onReset = vi.fn();
    render(<RecoveryWrapper onResetCallback={onReset} />);

    expect(screen.getByText(/OENEXA Platform Runtime Error/i)).toBeInTheDocument();

    const tryAgainBtn = screen.getByRole('button', { name: /Try Again/i });
    fireEvent.click(tryAgainBtn);

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Normal Content Rendering')).toBeInTheDocument();
  });

  it('renders custom fallback if provided in props', () => {
    render(
      <ErrorBoundary fallback={<div>Custom Error Fallback</div>}>
        <FaultyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error Fallback')).toBeInTheDocument();
  });
});
