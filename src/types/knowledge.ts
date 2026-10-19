export type KnowledgeSourceType =
  | 'DOCUMENT_UPLOAD'
  | 'WEBSITE_CRAWL'
  | 'CODEBASE_REPO'
  | 'API_SPEC'
  | 'CUSTOM_TEXT';

export type DocumentFormat =
  | 'PDF'
  | 'MARKDOWN'
  | 'HTML'
  | 'DOCX'
  | 'TXT'
  | 'JSON'
  | 'CSV'
  | 'XML';

export type DocumentStatus =
  | 'QUEUED'
  | 'CRAWLING'
  | 'PARSING'
  | 'EMBEDDING'
  | 'INDEXED'
  | 'FAILED';

export interface KnowledgeBase {
  kbId: string;
  tenantId: string;
  name: string;
  description: string;
  documentCount: number;
  totalTokens: number;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeDocument {
  documentId: string;
  kbId: string;
  title: string;
  sourceType: KnowledgeSourceType;
  sourceReference: string;
  format: DocumentFormat;
  sizeBytes: number;
  chunkCount: number;
  status: DocumentStatus;
  ingestedAt: string;
}

export interface Citation {
  citationId: string;
  documentId: string;
  documentTitle: string;
  sourceReference: string;
  sectionOrPage: number;
  snippet: string;
  relevanceScore: number;
}

export interface KnowledgeGraphNode {
  nodeId: string;
  label: string;
  entityType: string;
  properties?: Record<string, string>;
}

export interface KnowledgeGraphEdge {
  edgeId: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: string;
  weight: number;
}

export interface KnowledgeGraph {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

export interface SemanticSearchResult {
  query: string;
  citations: Citation[];
  synthesizedAnswer: string;
  subgraph: KnowledgeGraph;
  confidenceScore: number;
  retrievalLatencyMs: number;
}

export interface CreateBaseRequest {
  tenantId?: string;
  name: string;
  description: string;
}

export interface UploadDocumentRequest {
  filename: string;
  content: string;
  format?: DocumentFormat;
}

export interface CrawlWebsiteRequest {
  url: string;
  maxDepth?: number;
  crawlSubdomains?: boolean;
}

export interface SearchKnowledgeRequest {
  query: string;
  topK?: number;
}
