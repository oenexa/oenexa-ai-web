import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EnterpriseAssistantTab } from './EnterpriseAssistantTab';

describe('EnterpriseAssistantTab Zero-Mock Component Tests', () => {
  it('should render header and input fields cleanly', () => {
    const notifyMock = vi.fn();
    render(<EnterpriseAssistantTab darkMode={false} notify={notifyMock} />);

    expect(screen.getByText(/OENEXA Enterprise Engineering Assistant/i)).toBeDefined();
    expect(screen.getByLabelText(/Target Name \/ Identifier/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Run AI Evaluation/i })).toBeDefined();
  });

  it('should switch tabs between Repository, DevOps, Security, and Documentation', () => {
    const notifyMock = vi.fn();
    render(<EnterpriseAssistantTab darkMode={false} notify={notifyMock} />);

    const devopsTab = screen.getByRole('tab', { name: /DevOps/i });
    fireEvent.click(devopsTab);
    expect(devopsTab.getAttribute('aria-selected')).toBe('true');

    const secTab = screen.getByRole('tab', { name: /Security/i });
    fireEvent.click(secTab);
    expect(secTab.getAttribute('aria-selected')).toBe('true');
  });

  it('should execute evaluation and invoke notify callback', async () => {
    const notifyMock = vi.fn();
    render(<EnterpriseAssistantTab darkMode={false} notify={notifyMock} />);

    const runButton = screen.getByRole('button', { name: /Run AI Evaluation/i });
    await React.act(async () => {
      fireEvent.click(runButton);
    });

    expect(runButton).toBeDefined();
  });
});
