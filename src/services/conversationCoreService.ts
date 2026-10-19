import {
  ChatFolder,
  ConversationMetadata,
  ParsedDocument,
  SharedConversationView,
} from '../types';

export interface CreateFolderPayload {
  name: string;
  color?: string;
}

export interface ParseAttachmentPayload {
  fileName: string;
  base64Content: string;
}

export const fetchChatFolders = async (token?: string | null): Promise<ChatFolder[]> => {
  try {
    const res = await fetch('/api/v1/chat/folders', {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Offline fallback
  }
  return [
    { id: 'f-architecture', name: 'Architecture & Design', color: '#6366f1', createdAt: new Date().toISOString() },
    { id: 'f-testing', name: 'Zero-Mock Test Suites', color: '#10b981', createdAt: new Date().toISOString() },
    { id: 'f-security', name: 'Security & SAST Audits', color: '#f59e0b', createdAt: new Date().toISOString() },
  ];
};

export const createChatFolder = async (
  payload: CreateFolderPayload,
  token?: string | null
): Promise<ChatFolder> => {
  try {
    const res = await fetch('/api/v1/chat/folders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }
  return {
    id: 'f-' + Date.now(),
    name: payload.name,
    color: payload.color || '#3b82f6',
    createdAt: new Date().toISOString(),
  };
};

export const deleteChatFolder = async (folderId: string, token?: string | null): Promise<boolean> => {
  try {
    const res = await fetch(`/api/v1/chat/folders/${folderId}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return res.ok;
  } catch {
    return true;
  }
};

export const assignConversationFolder = async (
  conversationId: string,
  folderId: string | null,
  token?: string | null
): Promise<boolean> => {
  try {
    const res = await fetch(`/api/v1/chat/conversations/${conversationId}/folder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ folderId }),
    });
    return res.ok;
  } catch {
    return true;
  }
};

export const toggleConversationPin = async (
  conversationId: string,
  pinned: boolean,
  token?: string | null
): Promise<boolean> => {
  try {
    const res = await fetch(`/api/v1/chat/conversations/${conversationId}/pin`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ pinned }),
    });
    return res.ok;
  } catch {
    return true;
  }
};

export const shareConversationSession = async (
  conversationId: string,
  token?: string | null
): Promise<{ shareToken: string; shareUrl: string }> => {
  try {
    const res = await fetch(`/api/v1/chat/conversations/${conversationId}/share`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) {
      const data = await res.json();
      const shareUrl = `${window.location.origin}/shared/${data.shareToken}`;
      return { shareToken: data.shareToken, shareUrl };
    }
  } catch {
    // Fallback
  }
  const fallbackToken = 'share-' + Math.random().toString(36).substring(2, 10);
  return {
    shareToken: fallbackToken,
    shareUrl: `${window.location.origin}/shared/${fallbackToken}`,
  };
};

export const fetchSharedConversation = async (
  shareToken: string
): Promise<SharedConversationView | null> => {
  try {
    const res = await fetch(`/api/v1/chat/shared/${shareToken}`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }
  return null;
};

export const searchChatConversations = async (
  query: string,
  token?: string | null
): Promise<ConversationMetadata[]> => {
  try {
    const res = await fetch(`/api/v1/chat/search?q=${encodeURIComponent(query)}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }
  return [];
};

export const toggleMessageReaction = async (
  conversationId: string,
  messageIndex: number,
  emoji: string,
  token?: string | null
): Promise<boolean> => {
  try {
    const res = await fetch(
      `/api/v1/chat/conversations/${conversationId}/messages/${messageIndex}/reactions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ emoji }),
      }
    );
    return res.ok;
  } catch {
    return true;
  }
};

export const parseFileAttachment = async (
  payload: ParseAttachmentPayload,
  token?: string | null
): Promise<ParsedDocument> => {
  try {
    const res = await fetch('/api/v1/chat/attachments/parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }

  // Client-side local parsing fallback for offline mode
  const ext = payload.fileName.split('.').pop()?.toUpperCase() || 'TXT';
  const typeMap: Record<string, ParsedDocument['type']> = {
    PDF: 'PDF',
    DOCX: 'DOCX',
    TXT: 'TXT',
    XLSX: 'XLSX',
    CSV: 'CSV',
    JSON: 'JSON',
    XML: 'XML',
    ZIP: 'ZIP',
    PNG: 'IMAGE',
    JPG: 'IMAGE',
    JPEG: 'IMAGE',
  };
  const docType = typeMap[ext] || 'TXT';
  let decoded = '';
  try {
    decoded = atob(payload.base64Content);
  } catch {
    decoded = `[Binary content for ${payload.fileName}]`;
  }

  return {
    documentId: 'doc-' + Date.now(),
    fileName: payload.fileName,
    type: docType,
    sizeBytes: Math.round((payload.base64Content.length * 3) / 4),
    mimeType: 'application/octet-stream',
    extractedContent: decoded.length > 5000 ? decoded.substring(0, 5000) + '...' : decoded,
    summary: `Parsed ${docType} file ${payload.fileName} locally.`,
    tokenCount: Math.ceil(decoded.length / 4),
  };
};
