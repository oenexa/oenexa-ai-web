import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AntigravitySidecar } from './AntigravitySidecar';

vi.mock('@monaco-editor/react', () => ({
  default: () => <textarea data-testid="mock-editor" />,
  DiffEditor: () => <div data-testid="mock-diff" />,
}));

describe('AntigravitySidecar Adapter Tests', () => {
  it('correctly maps to OenexaWorksurface component', () => {
    render(
      <AntigravitySidecar
        darkMode={false}
        isOpen={true}
        onClose={vi.fn()}
        notify={vi.fn()}
      />
    );
    expect(screen.getByRole('tab', { name: /Editor/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Diffs/i })).toBeInTheDocument();
  });
});
