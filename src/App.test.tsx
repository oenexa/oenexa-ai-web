import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import App from './App';

/**
 * Behavior-Driven Development (BDD) Feature: User Interface Layout and Mode Switching
 *
 * Feature: Theme Switching & Workspace Health Diagnostics
 *   As a developer using the OENEXA Web Workspace
 *   I want the interface to show backend status and support dark/light theme toggling
 *   So that I can code comfortably in any lighting environment
 */
describe('Feature: Theme Switching & Workspace Health Diagnostics', () => {

  describe('Scenario: Initial application load and header rendering', () => {
    it('Given the user opens the application, When the header mounts, Then the platform title and health monitor should be visible', async () => {
      // Given: user opens application
      await act(async () => {
        render(<App />);
      });

      // When & Then: title and health monitor are visible
      expect(screen.getByText('OENEXA AI Engineer')).toBeInTheDocument();
      expect(screen.getByText(/Backend health:/i)).toBeInTheDocument();
    });
  });

  describe('Scenario: Toggle between light and dark themes', () => {
    it('Given the page is in light mode, When the user clicks the theme toggle button, Then dark mode class is applied to the root document', async () => {
      // Given: light mode
      await act(async () => {
        render(<App />);
      });
      const toggleButton = screen.getByRole('button', { name: /toggle dark mode/i });
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      // When: user clicks theme toggle
      await act(async () => {
        fireEvent.click(toggleButton);
      });

      // Then: dark mode is active
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      // And: clicking again restores light mode
      await act(async () => {
        fireEvent.click(toggleButton);
      });
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });
});
