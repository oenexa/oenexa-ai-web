import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Search,
  UploadFile,
  Language,
  Hub,
  FormatQuote,
  Timer,
  CheckCircle,
} from '@mui/icons-material';
import {
  RepositoryKnowledgeMap,
  KnowledgeBase,
  SemanticSearchResult,
  KnowledgeGraph,
  DocumentFormat,
} from '../../types';
import {
  listKnowledgeBases,
  createKnowledgeBase,
  uploadDocumentToKnowledgeBase,
  crawlWebsiteToKnowledgeBase,
  searchKnowledgeBase,
  getKnowledgeGraph,
} from '../../services/knowledgeService';

export interface RepositoryKnowledgeTabProps {
  darkMode: boolean;
  repositoryId: string;
  editorCode: string;
  knowledgeMap: RepositoryKnowledgeMap;
  setKnowledgeMap: React.Dispatch<React.SetStateAction<RepositoryKnowledgeMap>>;
  notify: (msg: string) => void;
  token?: string | null;
}

export const RepositoryKnowledgeTab: React.FC<RepositoryKnowledgeTabProps> = ({
  darkMode,
  editorCode,
  notify,
  token,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [selectedKbId, setSelectedKbId] = useState<string>('');

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('How does banking-grade authentication and 2FA work?');
  const [searchResult, setSearchResult] = useState<SemanticSearchResult | null>(null);
  const [searching, setSearching] = useState<boolean>(false);

  // Upload State
  const [uploadTitle, setUploadTitle] = useState<string>('Architecture_Blueprint.md');
  const [uploadFormat, setUploadFormat] = useState<DocumentFormat>('MARKDOWN');
  const [uploadContent, setUploadContent] = useState<string>(editorCode || '# OENEXA Enterprise Architecture\nHexagonal Monolith with Virtual Threads.');
  const [uploading, setUploading] = useState<boolean>(false);

  // Crawl State
  const [crawlUrl, setCrawlUrl] = useState<string>('https://docs.oenexa.ai/security');
  const [crawling, setCrawling] = useState<boolean>(false);

  // Graph State
  const [knowledgeGraph, setKnowledgeGraph] = useState<KnowledgeGraph | null>(null);

  useEffect(() => {
    listKnowledgeBases(undefined, token).then((bases) => {
      setKnowledgeBases(bases);
      if (bases.length > 0) {
        setSelectedKbId(bases[0].kbId);
      }
    }).catch(() => {});
  }, [token]);

  useEffect(() => {
    if (selectedKbId) {
      getKnowledgeGraph(selectedKbId, token).then(setKnowledgeGraph).catch(() => {});
    }
  }, [selectedKbId, token]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !selectedKbId) return;
    setSearching(true);
    try {
      const res = await searchKnowledgeBase(selectedKbId, searchQuery, 5, token);
      setSearchResult(res);
      notify(`Semantic search retrieved ${res.citations.length} citations in ${res.retrievalLatencyMs}ms`);
    } catch {
      notify('Search query failed');
    } finally {
      setSearching(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadTitle.trim() || !uploadContent.trim() || !selectedKbId) return;
    setUploading(true);
    try {
      const doc = await uploadDocumentToKnowledgeBase(selectedKbId, uploadTitle, uploadContent, uploadFormat, token);
      notify(`Uploaded "${doc.title}" with ${doc.chunkCount} vector chunks into Knowledge Base!`);
      getKnowledgeGraph(selectedKbId, token).then(setKnowledgeGraph);
    } catch {
      notify('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleCrawl = async () => {
    if (!crawlUrl.trim() || !selectedKbId) return;
    setCrawling(true);
    try {
      const doc = await crawlWebsiteToKnowledgeBase(selectedKbId, crawlUrl, 2, true, token);
      notify(`Crawled "${doc.sourceReference}" and indexed ${doc.chunkCount} semantic chunks!`);
      getKnowledgeGraph(selectedKbId, token).then(setKnowledgeGraph);
    } catch {
      notify('Failed to crawl website');
    } finally {
      setCrawling(false);
    }
  };

  const handleCreateNewKb = async () => {
    const name = `Enterprise Base ${knowledgeBases.length + 1}`;
    try {
      const kb = await createKnowledgeBase(name, 'New enterprise knowledge repository', undefined, token);
      setKnowledgeBases((prev) => [...prev, kb]);
      setSelectedKbId(kb.kbId);
      notify(`Created Knowledge Base "${kb.name}"`);
    } catch {
      notify('Failed to create knowledge base');
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1280, margin: '0 auto' }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: darkMode ? '#1e293b' : '#fff', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              🧠 Enterprise Knowledge System & RAG (Phase 6)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Production RAG architecture with vector embeddings, website crawler, citation engine, and dynamic knowledge graph.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 260 }}>
              <InputLabel>Active Knowledge Base</InputLabel>
              <Select
                value={selectedKbId}
                label="Active Knowledge Base"
                onChange={(e) => setSelectedKbId(e.target.value)}
              >
                {knowledgeBases.map((kb) => (
                  <MenuItem key={kb.kbId} value={kb.kbId}>
                    {kb.name} ({kb.documentCount} docs)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="outlined" size="small" onClick={handleCreateNewKb}>
              + New Base
            </Button>
          </Stack>
        </Box>

        <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2.5 }}>
          <Tab icon={<Search />} iconPosition="start" label="Semantic Search & Citations" />
          <Tab icon={<UploadFile />} iconPosition="start" label="Document Ingestion" />
          <Tab icon={<Language />} iconPosition="start" label="Website Crawler" />
          <Tab icon={<Hub />} iconPosition="start" label="Knowledge Graph" />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <Stack direction="row" spacing={1.5} sx={{ mb: 2.5 }}>
              <TextField
                fullWidth
                size="small"
                label="Enter query for Hybrid RAG semantic retrieval..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                variant="contained"
                startIcon={<Search />}
                onClick={handleSearch}
                disabled={searching}
                sx={{ minWidth: 140 }}
              >
                {searching ? 'Searching...' : 'Search'}
              </Button>
            </Stack>

            {searchResult && (
              <Stack spacing={2}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: darkMode ? '#0f172a' : '#f8fafc' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip
                      icon={<CheckCircle sx={{ fontSize: '0.8rem !important' }} />}
                      label={`Confidence: ${searchResult.confidenceScore.toFixed(1)}%`}
                      color="success"
                      size="small"
                    />
                    <Chip
                      icon={<Timer sx={{ fontSize: '0.8rem !important' }} />}
                      label={`${searchResult.retrievalLatencyMs}ms latency`}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                    {searchResult.synthesizedAnswer}
                  </Typography>
                </Paper>

                <Typography variant="subtitle2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <FormatQuote /> Line-Level Citations ({searchResult.citations.length} sources verified):
                </Typography>

                <List disablePadding>
                  {searchResult.citations.map((cite) => (
                    <Card key={cite.citationId} variant="outlined" sx={{ mb: 1, bgcolor: darkMode ? '#0f172a' : '#fff' }}>
                      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 700 }}>
                            {cite.documentTitle}
                          </Typography>
                          <Chip label={`Relevance: ${(cite.relevanceScore * 100).toFixed(0)}%`} size="small" color="primary" sx={{ height: 18, fontSize: '0.65rem' }} />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          {cite.sourceReference} (Section/Page {cite.sectionOrPage})
                        </Typography>
                        <Typography variant="body2" sx={{ fontStyle: 'italic', bgcolor: darkMode ? '#1e293b' : '#f1f5f9', p: 1, borderRadius: 1 }}>
                          "{cite.snippet}"
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </List>
              </Stack>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                size="small"
                label="Document Filename / Title"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Format</InputLabel>
                <Select
                  value={uploadFormat}
                  label="Format"
                  onChange={(e) => setUploadFormat(e.target.value as DocumentFormat)}
                >
                  <MenuItem value="MARKDOWN">MARKDOWN</MenuItem>
                  <MenuItem value="PDF">PDF</MenuItem>
                  <MenuItem value="DOCX">DOCX</MenuItem>
                  <MenuItem value="TXT">TXT</MenuItem>
                  <MenuItem value="JSON">JSON</MenuItem>
                  <MenuItem value="CSV">CSV</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <TextField
              fullWidth
              multiline
              rows={6}
              label="Document Content to Ingest & Embed"
              value={uploadContent}
              onChange={(e) => setUploadContent(e.target.value)}
            />

            <Button
              variant="contained"
              startIcon={<UploadFile />}
              onClick={handleUpload}
              disabled={uploading}
              sx={{ alignSelf: 'flex-start' }}
            >
              {uploading ? 'Ingesting & Embedding...' : 'Upload & Index Document'}
            </Button>
          </Stack>
        )}

        {activeTab === 2 && (
          <Stack spacing={2}>
            <TextField
              fullWidth
              size="small"
              label="Target Website URL to Crawl & Parse"
              value={crawlUrl}
              onChange={(e) => setCrawlUrl(e.target.value)}
            />
            <Typography variant="caption" color="text.secondary">
              Crawls documentation, extracts clean text, partitions into semantic vector chunks, and links entity relationships.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Language />}
              onClick={handleCrawl}
              disabled={crawling}
              sx={{ alignSelf: 'flex-start' }}
            >
              {crawling ? 'Crawling & Indexing...' : 'Crawl & Index Website'}
            </Button>
          </Stack>
        )}

        {activeTab === 3 && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              🕸️ Knowledge Graph Subgraph & Entity Relationships:
            </Typography>
            {knowledgeGraph && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: darkMode ? '#0f172a' : '#f8fafc' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>
                      Entities & Nodes ({knowledgeGraph.nodes.length}):
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {knowledgeGraph.nodes.map((node) => (
                        <Chip
                          key={node.nodeId}
                          label={`${node.label} [${node.entityType}]`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: darkMode ? '#0f172a' : '#f8fafc' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>
                      Relationships & Edges ({knowledgeGraph.edges.length}):
                    </Typography>
                    <List dense disablePadding>
                      {knowledgeGraph.edges.slice(0, 6).map((edge) => (
                        <ListItem key={edge.edgeId} sx={{ px: 0 }}>
                          <ListItemText
                            primary={
                              <Typography variant="caption">
                                <strong>{edge.sourceNodeId}</strong> ➔ [{edge.relationshipType}] ➔ <strong>{edge.targetNodeId}</strong>
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};
