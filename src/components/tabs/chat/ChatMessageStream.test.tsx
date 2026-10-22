import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ChatMessageStream } from './ChatMessageStream';
import { ChatMessage } from '../../../types';

describe('ChatMessageStream Unit Tests', () => {
  const sampleMessages: ChatMessage[] = [
    {
      id: 'msg-1',
      sender: 'You',
      content: 'How does virtual thread scheduling work in Java 25?',
      timestamp: '10:00 AM',
    },
    {
      id: 'msg-2',
      sender: 'OENEXA AI',
      content: 'Virtual threads are lightweight threads managed by the Java Virtual Machine rather than the underlying operating system.',
      timestamp: '10:01 AM',
      thoughtProcess: 'Analyzing Java 25 Project Loom fiber scheduling mechanics...',
      artifacts: [
        {
          id: 'art-1',
          title: 'VirtualThreadConfig.java',
          filePath: 'src/main/java/VirtualThreadConfig.java',
          language: 'java',
          code: 'public class VirtualThreadConfig {}',
          action: 'CREATE',
        },
      ],
      userReaction: '👍',
    },
  ];

  it('renders user and AI messages with correct labels', () => {
    render(
      <ChatMessageStream
        darkMode={false}
        messages={sampleMessages}
        chatLoading={false}
        onCopyCode={vi.fn()}
        onApplyArtifactToEditor={vi.fn()}
        onSendFollowUp={vi.fn()}
      />
    );

    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('OENEXA AI')).toBeInTheDocument();
    expect(screen.getByText(/How does virtual thread scheduling work/i)).toBeInTheDocument();
    expect(screen.getByText(/Virtual threads are lightweight threads managed/i)).toBeInTheDocument();
  });

  it('renders deliberative thinking trace accordion and artifact card', () => {
    render(
      <ChatMessageStream
        darkMode={false}
        messages={sampleMessages}
        chatLoading={false}
        onCopyCode={vi.fn()}
        onApplyArtifactToEditor={vi.fn()}
        onSendFollowUp={vi.fn()}
      />
    );

    expect(screen.getByText(/Deliberative Chain-of-Thought Reasoning/i)).toBeInTheDocument();
    expect(screen.getByText(/VirtualThreadConfig.java/i)).toBeInTheDocument();
  });

  it('triggers onApplyArtifactToEditor when apply button is clicked', () => {
    const onApply = vi.fn();
    render(
      <ChatMessageStream
        darkMode={false}
        messages={sampleMessages}
        chatLoading={false}
        onCopyCode={vi.fn()}
        onApplyArtifactToEditor={onApply}
        onSendFollowUp={vi.fn()}
      />
    );

    const loadInEditorBtn = screen.getByRole('button', { name: /Load in Editor/i });
    fireEvent.click(loadInEditorBtn);
    expect(onApply).toHaveBeenCalledWith(sampleMessages[1].artifacts![0]);
  });

  it('renders loading progress indicator when chatLoading is true', () => {
    render(
      <ChatMessageStream
        darkMode={false}
        messages={sampleMessages}
        chatLoading={true}
        onCopyCode={vi.fn()}
        onApplyArtifactToEditor={vi.fn()}
        onSendFollowUp={vi.fn()}
      />
    );

    expect(screen.getByText(/AI Agent is reasoning and synthesizing response.../i)).toBeInTheDocument();
  });
});
