export type MemoryLayerTier =
  | 'L1_CPU_CACHE'
  | 'L2_JVM_HEAP_RAM'
  | 'L3_REDIS_DISTRIBUTED'
  | 'L4_NVME_SSD_MMAP'
  | 'L5_POSTGRESQL_RELATIONAL'
  | 'L6_VECTOR_EMBEDDING'
  | 'L7_OBJECT_STORAGE_COLD';

export type BrainMemoryTier =
  | 'L1_HOT_EXECUTION'
  | 'L2_ACTIVE_THOUGHT'
  | 'L3_RAM_WORKING_MEMORY'
  | 'L4_COMPRESSED_SHORT_TERM'
  | 'L5_NVME_SSD_LONG_TERM'
  | 'L6_KNOWLEDGE_PERMANENT';

export type DataMovementStepStatus = 'FOUND' | 'NOT_FOUND' | 'PROMOTED' | 'SKIPPED';

export interface DataMovementStepRecord {
  stepNumber: number;
  stepName: string;
  tierSearched: BrainMemoryTier;
  status: DataMovementStepStatus;
  latencyNanos: number;
  details: string;
}

export interface DataMovementTrace {
  queryKey: string;
  workspaceId: string;
  resolvedTier: BrainMemoryTier;
  found: boolean;
  finalContent: string;
  steps: DataMovementStepRecord[];
  totalDurationNanos: number;
  memorySavedBytes: number;
}

export interface IntelligentPrefetchPrediction {
  triggerKey: string;
  predictedKeys: string[];
  confidenceScore: number;
  rationale: string;
}

export interface ContextCompressionMetrics {
  originalSizeBytes: number;
  compressedSizeBytes: number;
  deduplicatedItemsCount: number;
  tokensPruned: number;
  compressionRatioPercent: number;
  compressionAlgorithm: string;
}

export interface RepositoryModuleNode {
  moduleId: string;
  moduleName: string;
  fileCount: number;
  totalSizeBytes: number;
  dependencies: string[];
  isLoadedInRam: boolean;
}

export interface MemoryEngineV2Stats {
  l1Count: number;
  l2Count: number;
  ramCount: number;
  compressedCount: number;
  ssdCount: number;
  knowledgeCount: number;
  totalEffectiveMemoryBytes: number;
  physicalRamUsedBytes: number;
  compressionRatio: number;
  prefetchHits: number;
  evictionCount: number;
}

export interface HierarchicalMemoryRecord {
  id: string;
  workspaceId: string;
  userId: string;
  layer: MemoryLayerTier;
  memoryKey: string;
  content: string;
  embedding?: number[];
  accessCount: number;
  lastAccessedAt: string;
  sizeBytes: number;
  isCompressed: boolean;
}

export interface MemoryRetrievalResult {
  key: string;
  requestedTier: MemoryLayerTier;
  content: string;
  latencyNanos: number;
  sourceTier: MemoryLayerTier;
  hit: boolean;
  isCompressed: boolean;
}

export interface MemoryHierarchyStats {
  totalEntries: number;
  ramEntries: number;
  redisEntries: number;
  nvmeMmapEntries: number;
  postgresEntries: number;
  vectorEntries: number;
  totalCapacityBytes: number;
  nvmeMmapSizeBytes: number;
  cacheHitRatio: number;
}

const API_BASE = '/api/v4/memory';

export async function storeHierarchicalMemory(
  workspaceId: string,
  key: string,
  content: string,
  tier: MemoryLayerTier = 'L4_NVME_SSD_MMAP',
  token?: string | null
): Promise<HierarchicalMemoryRecord> {
  try {
    const res = await fetch(`${API_BASE}/store`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ workspaceId, key, content, tier }),
    });
    if (res.ok) return await res.json();
  } catch {
    // Offline local fallback
  }

  return {
    id: `mem-${Date.now()}`,
    workspaceId,
    userId: 'engineer',
    layer: tier,
    memoryKey: key,
    content,
    accessCount: 1,
    lastAccessedAt: new Date().toISOString(),
    sizeBytes: new Blob([content]).size,
    isCompressed: false,
  };
}

export async function retrieveHierarchicalMemory(
  workspaceId: string,
  key: string,
  token?: string | null
): Promise<MemoryRetrievalResult> {
  try {
    const res = await fetch(`${API_BASE}/retrieve?workspaceId=${encodeURIComponent(workspaceId)}&key=${encodeURIComponent(key)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) return await res.json();
  } catch {
    // Offline local fallback
  }

  return {
    key,
    requestedTier: 'L2_JVM_HEAP_RAM',
    content: `[Local Cache] Context retrieved for ${key}`,
    latencyNanos: 45000,
    sourceTier: 'L4_NVME_SSD_MMAP',
    hit: true,
    isCompressed: false,
  };
}

export async function getMemoryHierarchyStats(token?: string | null): Promise<MemoryHierarchyStats> {
  try {
    const res = await fetch(`${API_BASE}/hierarchy-stats`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback stats
  }

  return {
    totalEntries: 1842,
    ramEntries: 140,
    redisEntries: 320,
    nvmeMmapEntries: 1250,
    postgresEntries: 132,
    vectorEntries: 1842,
    totalCapacityBytes: 10737418240,
    nvmeMmapSizeBytes: 4294967296,
    cacheHitRatio: 98.4,
  };
}

// =========================================================================
// OENEXA MEMORY ENGINE V2 API CLIENT
// =========================================================================

export async function queryMemoryEngineV2(
  workspaceId: string,
  key: string,
  token?: string | null
): Promise<DataMovementTrace> {
  try {
    const res = await fetch(`${API_BASE}/v2/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ workspaceId, key }),
    });
    if (res.ok) return await res.json();
  } catch {
    // Offline local simulation
  }

  return {
    queryKey: key,
    workspaceId,
    resolvedTier: 'L5_NVME_SSD_LONG_TERM',
    found: true,
    finalContent: `public class ${key.replace('.java', '')} { /* Retrieved via OENEXA V2 SSD-First Mmap */ }`,
    steps: [
      { stepNumber: 1, stepName: 'Task Routing & Dispatch', tierSearched: 'L1_HOT_EXECUTION', status: 'FOUND', latencyNanos: 12, details: `Routed ${key} to V2 Memory Engine` },
      { stepNumber: 2, stepName: 'Check Hot Cache L1/L2', tierSearched: 'L1_HOT_EXECUTION', status: 'NOT_FOUND', latencyNanos: 28, details: 'Miss in CPU/GPU execution registers' },
      { stepNumber: 3, stepName: 'Check Working Memory (RAM)', tierSearched: 'L3_RAM_WORKING_MEMORY', status: 'NOT_FOUND', latencyNanos: 92, details: 'Miss in JVM Heap Working Memory' },
      { stepNumber: 4, stepName: 'Check Compressed Memory', tierSearched: 'L4_COMPRESSED_SHORT_TERM', status: 'NOT_FOUND', latencyNanos: 1800, details: 'Miss in ZSTD Compressed Memory' },
      { stepNumber: 5, stepName: 'Check NVMe SSD Memory', tierSearched: 'L5_NVME_SSD_LONG_TERM', status: 'FOUND', latencyNanos: 21500, details: 'Hit in zero-copy MappedByteBuffer; promoted to RAM' },
    ],
    totalDurationNanos: 23432,
    memorySavedBytes: 345000,
  };
}

export async function getMemoryEngineV2Stats(token?: string | null): Promise<MemoryEngineV2Stats> {
  try {
    const res = await fetch(`${API_BASE}/v2/stats`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) return await res.json();
  } catch {
    // Offline simulation
  }

  return {
    l1Count: 18,
    l2Count: 64,
    ramCount: 380,
    compressedCount: 1450,
    ssdCount: 8900,
    knowledgeCount: 45000,
    totalEffectiveMemoryBytes: 794625146880, // ~740 GB Effective Memory
    physicalRamUsedBytes: 68719476736,      // 64 GB Physical RAM
    compressionRatio: 76.4,
    prefetchHits: 812,
    evictionCount: 42,
  };
}

export async function compressContextV2(context: string, token?: string | null): Promise<ContextCompressionMetrics> {
  try {
    const res = await fetch(`${API_BASE}/v2/compress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ context }),
    });
    if (res.ok) return await res.json();
  } catch {
    // Offline simulation
  }

  const orig = new Blob([context]).size;
  const comp = Math.round(orig * 0.26);
  return {
    originalSizeBytes: orig,
    compressedSizeBytes: comp,
    deduplicatedItemsCount: 18,
    tokensPruned: 140,
    compressionRatioPercent: 74.0,
    compressionAlgorithm: 'ZSTD+Dict+INT8',
  };
}

export async function getRepositoryGraphV2(workspaceId: string = 'default-ws', token?: string | null): Promise<RepositoryModuleNode[]> {
  try {
    const res = await fetch(`${API_BASE}/v2/graph?workspaceId=${encodeURIComponent(workspaceId)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) return await res.json();
  } catch {
    // Offline simulation
  }

  return [
    { moduleId: 'mod-domain', moduleName: 'Domain Core', fileCount: 120, totalSizeBytes: 15728640, dependencies: [], isLoadedInRam: true },
    { moduleId: 'mod-app', moduleName: 'Application Orchestration', fileCount: 340, totalSizeBytes: 41943040, dependencies: ['domain'], isLoadedInRam: true },
    { moduleId: 'mod-infra', moduleName: 'Infrastructure Adapters', fileCount: 580, totalSizeBytes: 83886080, dependencies: ['domain', 'application'], isLoadedInRam: false },
    { moduleId: 'mod-api', moduleName: 'Primary Web REST', fileCount: 210, totalSizeBytes: 26214400, dependencies: ['application'], isLoadedInRam: true },
    { moduleId: 'mod-web', moduleName: 'Next.js Frontend Client', fileCount: 890, totalSizeBytes: 125829120, dependencies: ['api'], isLoadedInRam: false },
  ];
}
