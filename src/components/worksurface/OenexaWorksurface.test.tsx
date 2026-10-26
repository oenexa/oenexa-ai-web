import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { OenexaWorksurface, TerminalLogEntry } from './OenexaWorksurface';
import { CodeArtifact } from '../../types';

// Mock monaco editor in jsdom test environment
vi.mock('@monaco-editor/react', () => {
  return {
    default: ({ value, onChange }: { value: string; onChange?: (val: string) => void }) => (
      <textarea
        data-testid="monaco-mock-editor"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
    ),
    DiffEditor: ({ original, modified }: { original: string; modified: string }) => (
      <div data-testid="monaco-mock-diff">
        <div data-testid="diff-original">{original}</div>
        <div data-testid="diff-modified">{modified}</div>
      </div>
    ),
  };
});

describe('OenexaWorksurface Component Tests', () => {
  const defaultLogs: TerminalLogEntry[] = [
    {
      id: 'log-1',
      command: './gradlew :api:test --info',
      output: 'BUILD SUCCESSFUL in 2s',
      exitCode: 0,
      timestamp: '22:15:00',
    },
  ];

  const defaultArtifacts: CodeArtifact[] = [
    {
      id: 'art-1',
      title: 'OENEXA Architecture Spec',
      action: 'CREATE',
      language: 'markdown',
      codeSnippet: '# Architecture Spec\nStrict Hexagonal boundaries enforced.',
    },
  ];

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <OenexaWorksurface
        darkMode={false}
        isOpen={false}
        onClose={vi.fn()}
        notify={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders worksurface header, active file path, and tabs when isOpen is true', () => {
    render(
      <OenexaWorksurface
        darkMode={false}
        isOpen={true}
        onClose={vi.fn()}
        activeFilePath="src/main/java/com/oenexa/UserService.java"
        activeCode="class UserService {}"
        notify={vi.fn()}
      />
    );

    expect(screen.getByRole('tab', { name: /Editor/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Diffs/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Terminal/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Artifacts/i })).toBeInTheDocument();
    expect(screen.getByText(/src\/main\/java\/com\/oenexa\/UserService\.java/i)).toBeInTheDocument();
  });

  it('switches to Diffs tab and displays accept and reject buttons', () => {
    const onAcceptDiff = vi.fn();
    const onRejectDiff = vi.fn();

    render(
      <OenexaWorksurface
        darkMode={false}
        isOpen={true}
        onClose={vi.fn()}
        activeFilePath="UserService.java"
        activeCode="public class UserService { int v2; }"
        originalCode="public class UserService { int v1; }"
        onAcceptDiff={onAcceptDiff}
        onRejectDiff={onRejectDiff}
        notify={vi.fn()}
      />
    );

    const diffTab = screen.getByRole('tab', { name: /Diffs/i });
    fireEvent.click(diffTab);

    const acceptBtn = screen.getByRole('button', { name: /Accept Diff/i });
    expect(acceptBtn).toBeInTheDocument();
    fireEvent.click(acceptBtn);
    expect(onAcceptDiff).toHaveBeenCalledTimes(1);

    const revertBtn = screen.getByRole('button', { name: /Revert/i });
    expect(revertBtn).toBeInTheDocument();
    fireEvent.click(revertBtn);
    expect(onRejectDiff).toHaveBeenCalledTimes(1);
  });

  it('switches to Terminal tab, renders logs, and executes commands', () => {
    const onRunTestCommand = vi.fn();

    render(
      <OenexaWorksurface
        darkMode={false}
        isOpen={true}
        onClose={vi.fn()}
        terminalLogs={defaultLogs}
        onRunTestCommand={onRunTestCommand}
        notify={vi.fn()}
      />
    );

    const terminalTab = screen.getByRole('tab', { name: /Terminal/i });
    fireEvent.click(terminalTab);

    expect(screen.getByText(/BUILD SUCCESSFUL in 2s/i)).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/Type command/i);
    fireEvent.change(input, { target: { value: 'npm test' } });
    const executeBtn = screen.getByRole('button', { name: /Execute/i });
    fireEvent.click(executeBtn);

    expect(onRunTestCommand).toHaveBeenCalledWith('npm test');
  });

  it('switches to Artifacts tab and displays markdown artifacts', () => {
    render(
      <OenexaWorksurface
        darkMode={false}
        isOpen={true}
        onClose={vi.fn()}
        artifacts={defaultArtifacts}
        notify={vi.fn()}
      />
    );

    const docsTab = screen.getByRole('tab', { name: /Artifacts/i });
    fireEvent.click(docsTab);

    expect(screen.getAllByText(/OENEXA Architecture Spec/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Strict Hexagonal boundaries enforced/i)).toBeInTheDocument();
  });

  it('triggers onClose when close button is clicked', () => {
    const onClose = vi.fn();

    render(
      <OenexaWorksurface
        darkMode={false}
        isOpen={true}
        onClose={onClose}
        notify={vi.fn()}
      />
    );

    const closeBtn = screen.getByRole('button', { name: /Close Worksurface Pane/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
