import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { PlatformNavigationBar } from './PlatformNavigationBar';

describe('PlatformNavigationBar Unit Tests', () => {
  it('renders brand title, active model chip, and default sign in button when logged out', () => {
    const toggleDarkMode = vi.fn();
    const onOpenAuthDialog = vi.fn();
    const onLogout = vi.fn();

    render(
      <PlatformNavigationBar
        darkMode={false}
        toggleDarkMode={toggleDarkMode}
        token={null}
        username=""
        onOpenAuthDialog={onOpenAuthDialog}
        onLogout={onLogout}
        activeModel="deepseek-r1:8b"
        viewMode="chat"
      />
    );

    expect(screen.getByText(/OENEXA Chat/i)).toBeInTheDocument();
    expect(screen.getByText(/deepseek-r1:8b • Local Ollama/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('triggers onOpenAuthDialog when sign in button is clicked', () => {
    const onOpenAuthDialog = vi.fn();

    render(
      <PlatformNavigationBar
        darkMode={false}
        toggleDarkMode={vi.fn()}
        token={null}
        username=""
        onOpenAuthDialog={onOpenAuthDialog}
        onLogout={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    expect(onOpenAuthDialog).toHaveBeenCalledTimes(1);
  });

  it('renders username and logout button when user is authenticated', () => {
    const onLogout = vi.fn();

    render(
      <PlatformNavigationBar
        darkMode={true}
        toggleDarkMode={vi.fn()}
        token="jwt-token-123"
        username="engineer_alpha"
        onOpenAuthDialog={vi.fn()}
        onLogout={onLogout}
      />
    );

    expect(screen.getByText('engineer_alpha')).toBeInTheDocument();
    const logoutBtn = screen.getByTitle(/Logout/i);
    expect(logoutBtn).toBeInTheDocument();

    fireEvent.click(logoutBtn);
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('switches views between chat and swarm threads', () => {
    const onSelectView = vi.fn();

    render(
      <PlatformNavigationBar
        darkMode={false}
        toggleDarkMode={vi.fn()}
        token={null}
        username=""
        onOpenAuthDialog={vi.fn()}
        onLogout={vi.fn()}
        viewMode="chat"
        onSelectView={onSelectView}
      />
    );

    const swarmBtn = screen.getByRole('button', { name: /Swarm Threads/i });
    fireEvent.click(swarmBtn);
    expect(onSelectView).toHaveBeenCalledWith('swarm');

    const chatBtn = screen.getByRole('button', { name: /Chat/i });
    fireEvent.click(chatBtn);
    expect(onSelectView).toHaveBeenCalledWith('chat');
  });

  it('calls toggleDarkMode when dark mode button is clicked', () => {
    const toggleDarkMode = vi.fn();

    render(
      <PlatformNavigationBar
        darkMode={false}
        toggleDarkMode={toggleDarkMode}
        token={null}
        username=""
        onOpenAuthDialog={vi.fn()}
        onLogout={vi.fn()}
      />
    );

    const toggleBtn = screen.getByRole('button', { name: /toggle dark mode/i });
    fireEvent.click(toggleBtn);
    expect(toggleDarkMode).toHaveBeenCalledTimes(1);
  });
});
