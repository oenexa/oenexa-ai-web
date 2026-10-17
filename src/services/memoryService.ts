import { UserMemoryRecord } from '../types';

export const createDefaultMemories = (username: string): UserMemoryRecord[] => [
  {
    userId: username || 'engineer',
    memoryKey: 'ARCHITECTURE_STYLE',
    memoryValue: 'Strict Hexagonal Modular Monolith with clean domain boundaries',
    category: 'PROJECT_CONTEXT',
    confidence: 0.99,
    learnedAt: new Date().toISOString(),
  },
  {
    userId: username || 'engineer',
    memoryKey: 'TESTING_INVARIANT',
    memoryValue: 'Strictly Zero-Mock Testing Policy (no Mockito, no PowerMock, real state)',
    category: 'PREFERENCE',
    confidence: 1.0,
    learnedAt: new Date().toISOString(),
  },
  {
    userId: username || 'engineer',
    memoryKey: 'PERSISTENCE_STACK',
    memoryValue: 'PostgreSQL 16 with pgvector & Flyway database migrations',
    category: 'FACT',
    confidence: 0.96,
    learnedAt: new Date().toISOString(),
  },
];

export const fetchUserMemories = async (username: string): Promise<UserMemoryRecord[]> => {
  try {
    const res = await fetch(`/api/v1/chat/intelligent/memory/${username}`);
    if (res.ok) {
      const data: UserMemoryRecord[] = await res.json();
      if (data && data.length > 0) return data;
    }
  } catch {
    // Fallback to defaults
  }
  return createDefaultMemories(username);
};

export const saveUserMemory = async (record: UserMemoryRecord): Promise<void> => {
  try {
    await fetch('/api/v1/chat/intelligent/memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
  } catch {
    // Offline resilience
  }
};
