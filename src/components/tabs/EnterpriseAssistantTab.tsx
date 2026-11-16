import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Chip,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  FolderOpen as RepoIcon,
  CloudQueue as DevOpsIcon,
  Security as SecurityIcon,
  Description as DocIcon,
  Warning as IncidentIcon,
  AutoStories as PromptIcon,
} from '@mui/icons-material';
import {
  analyzeRepository,
  reviewDevOps,
  auditSecurity,
  listPromptTemplates,
} from '../../services/aiPlatformUpgradeService';
import { triageIncident } from '../../services/governanceObservabilityService';
import { generateDocument, DocumentType } from '../../services/documentAnalyticsService';

export interface EnterpriseAssistantTabProps {
  darkMode: boolean;
  token?: string | null;
  notify: (msg: string) => void;
}

export const EnterpriseAssistantTab: React.FC<EnterpriseAssistantTabProps> = ({
  darkMode,
  notify,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<number>(0);
  const [inputTarget, setInputTarget] = useState<string>('oenexa-ai-core');
  const [inputText, setInputText] = useState<string>('Review Clean Hexagonal Architecture invariants and zero mocks.');
  const [loading, setLoading] = useState<boolean>(false);
  const [resultOutput, setResultOutput] = useState<string | null>(null);

  const handleExecuteAssistant = async () => {
    setLoading(true);
    setResultOutput(null);

    try {
      if (activeSubTab === 0) {
        // Repository Assistant
        const res = await analyzeRepository(inputTarget, ['domain', 'application', 'api'], inputText);
        setResultOutput(JSON.stringify(res, null, 2));
        notify(`Repository analysis complete for ${inputTarget}`);
      } else if (activeSubTab === 1) {
        // DevOps Assistant
        const res = await reviewDevOps(inputTarget, inputText, undefined);
        setResultOutput(JSON.stringify(res, null, 2));
        notify(`DevOps review completed for ${inputTarget}`);
      } else if (activeSubTab === 2) {
        // Security Assistant
        const res = await auditSecurity(inputTarget, inputText);
        setResultOutput(JSON.stringify(res, null, 2));
        notify(`Security audit passed: ${res.passCompliance}`);
      } else if (activeSubTab === 3) {
        // Documentation Assistant
        const res = await generateDocument({
          type: 'ADR' as DocumentType,
          title: inputTarget,
          context: inputText,
        });
        setResultOutput(res.markdownContent);
        notify(`Generated document: ${res.title}`);
      } else if (activeSubTab === 4) {
        // Incident & SRE Assistant
        const res = await triageIncident({
          title: inputTarget,
          service: 'oenexa-core',
          stackTrace: inputText,
        });
        setResultOutput(JSON.stringify(res, null, 2));
        notify(`Incident triaged: ${res.calculatedSeverity}`);
      } else if (activeSubTab === 5) {
        // Prompt Registry
        const res = await listPromptTemplates();
        setResultOutput(JSON.stringify(res, null, 2));
        notify(`Loaded ${res.length} enterprise prompt templates`);
      }
    } catch {
      notify('Execution error; fallback output applied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 1.5, sm: 3 }, height: '100%', overflowY: 'auto' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 0.5 }}>
          🛠️ OENEXA Enterprise Engineering Assistant
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Central AI Copilot for all OENEXA repositories. Clean, provider-agnostic, and developer-focused.
        </Typography>
      </Box>

      <Tabs
        value={activeSubTab}
        onChange={(_, val) => {
          setActiveSubTab(val);
          setResultOutput(null);
        }}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 2.5,
          borderBottom: 1,
          borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        }}
      >
        <Tab icon={<RepoIcon fontSize="small" />} iconPosition="start" label="Repository" />
        <Tab icon={<DevOpsIcon fontSize="small" />} iconPosition="start" label="DevOps" />
        <Tab icon={<SecurityIcon fontSize="small" />} iconPosition="start" label="Security" />
        <Tab icon={<DocIcon fontSize="small" />} iconPosition="start" label="Documentation" />
        <Tab icon={<IncidentIcon fontSize="small" />} iconPosition="start" label="Incidents & SRE" />
        <Tab icon={<PromptIcon fontSize="small" />} iconPosition="start" label="Prompt Registry" />
      </Tabs>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={5}>
          <Card
            elevation={0}
            sx={{
              border: 1,
              borderColor: darkMode ? '#27272a' : '#e4e4e7',
              bgcolor: darkMode ? '#18181b' : '#ffffff',
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Target Scope & Input Directive
              </Typography>
              <TextField
                fullWidth
                size="small"
                label="Target Name / Identifier"
                value={inputTarget}
                onChange={(e) => setInputTarget(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={5}
                size="small"
                label="Code, Stack Trace, or Directive"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleExecuteAssistant}
                disabled={loading}
                sx={{
                  bgcolor: '#0284c7',
                  '&:hover': { bgcolor: '#0369a1' },
                  textTransform: 'none',
                  fontWeight: 700,
                  py: 1,
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Run AI Evaluation'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card
            elevation={0}
            sx={{
              border: 1,
              borderColor: darkMode ? '#27272a' : '#e4e4e7',
              bgcolor: darkMode ? '#18181b' : '#ffffff',
              borderRadius: 2,
              minHeight: 280,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Structured Execution Report
                </Typography>
                <Chip
                  size="small"
                  label={resultOutput ? 'Output Ready' : 'Awaiting Run'}
                  color={resultOutput ? 'success' : 'default'}
                  sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                />
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  p: 2,
                  bgcolor: darkMode ? '#09090b' : '#f8fafc',
                  borderRadius: 1.5,
                  border: 1,
                  borderColor: darkMode ? '#27272a' : '#e2e8f0',
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  maxHeight: 400,
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {resultOutput || '// Execute assistant to generate grounded technical intelligence...'}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
