import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ChatInputBar } from './ChatInputBar';

describe('ChatInputBar Unit Tests', () => {
  const defaultProps = {
    darkMode: false,
    chatInput: '',
    setChatInput: vi.fn(),
    chatLoading: false,
    pendingAttachment: null,
    setPendingAttachment: vi.fn(),
    parsedDocuments: [],
    onRemoveParsedDocument: vi.fn(),
    onAddParsedDocument: vi.fn(),
    multimodalAttachments: [],
    handleRemoveMultimodalAttachment: vi.fn(),
    handleAttachCodeToChat: vi.fn(),
    handleAttachVoiceMemo: vi.fn(),
    handleAttachDiagram: vi.fn(),
    isRecordingVoice: false,
    onSendMessage: vi.fn(),
  };

  it('renders input field with placeholder and disabled send button when input is empty', () => {
    render(<ChatInputBar {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Ask OENEXA/i);
    expect(input).toBeInTheDocument();

    const sendBtn = screen.getByRole('button', { name: /Send/i });
    expect(sendBtn).toBeDisabled();
  });

  it('enables send button when text is entered and triggers onSendMessage on click', () => {
    const onSendMessage = vi.fn();
    render(<ChatInputBar {...defaultProps} chatInput="Explain virtual threads" onSendMessage={onSendMessage} />);

    const sendBtn = screen.getByRole('button', { name: /Send/i });
    expect(sendBtn).not.toBeDisabled();

    fireEvent.click(sendBtn);
    expect(onSendMessage).toHaveBeenCalledTimes(1);
  });

  it('triggers handleAttachCodeToChat when code attachment button is clicked', () => {
    const handleAttachCodeToChat = vi.fn();
    render(<ChatInputBar {...defaultProps} handleAttachCodeToChat={handleAttachCodeToChat} />);

    const attachBtn = screen.getByTitle(/Attach current editor code/i);
    fireEvent.click(attachBtn);
    expect(handleAttachCodeToChat).toHaveBeenCalledTimes(1);
  });

  it('renders pending code attachment chip and allows removal', () => {
    const setPendingAttachment = vi.fn();
    render(
      <ChatInputBar
        {...defaultProps}
        pendingAttachment={{
          filePath: 'src/Main.java',
          language: 'java',
          content: 'public class Main {}',
          startLine: 1,
          endLine: 1,
        }}
        setPendingAttachment={setPendingAttachment}
      />
    );

    expect(screen.getByText(/src\/Main.java/i)).toBeInTheDocument();
    const deleteIcon = screen.getByTestId('CancelIcon');
    fireEvent.click(deleteIcon);
    expect(setPendingAttachment).toHaveBeenCalledWith(null);
  });

  it('triggers send message when Enter key is pressed without Shift', () => {
    const onSendMessage = vi.fn();
    render(<ChatInputBar {...defaultProps} chatInput="Hello Oenexa" onSendMessage={onSendMessage} />);

    const input = screen.getByPlaceholderText(/Ask OENEXA/i);
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: false });
    expect(onSendMessage).toHaveBeenCalledTimes(1);
  });
});
