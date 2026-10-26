import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import {
  CheckCircleOutline,
  Code,
  ContentCopy,
  VerifiedUser,
  Memory,
  Schedule,
} from '@mui/icons-material';
import { CoreBrainSynthesis } from '../../../types/coreBrain';

interface CoreBrainSynthesisViewerProps {
  darkMode: boolean;
  synthesis: CoreBrainSynthesis | null;
  onCopyCode?: (code: string) => void;
  onApplyArtifact?: (artifact: { title: string; code: string }) => void;
}

export const CoreBrainSynthesisViewer: React.FC<CoreBrainSynthesisViewerProps> = ({
  darkMode,
  synthesis,
  onCopyCode,
  onApplyArtifact,
}) => {
  if (!synthesis) {
    return null;
  }

  const { routingDecision, securityAssessment, performanceSnapshot, reasoningSteps, synthesizedArtifacts } = synthesis;

  return (
    <Card
      sx={{
        bgcolor: darkMode ? '#18181b' : '#ffffff',
        border: 1,
        borderColor: darkMode ? '#27272a' : '#e4e4e7',
        borderRadius: 2,
        boxShadow: 'none',
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleOutline sx={{ color: '#16a34a', fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
              Core Brain Directive Synthesis
            </Typography>
            <Chip
              label={synthesis.status}
              size="small"
              sx={{ bgcolor: darkMode ? 'rgba(34,197,94,0.1)' : '#ecfdf5', color: '#16a34a', fontWeight: 700 }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: darkMode ? '#a1a1aa' : '#71717a' }}>
              Confidence:
            </Typography>
            <Chip
              label={`${(synthesis.confidenceScore * 100).toFixed(0)}%`}
              size="small"
              sx={{ bgcolor: darkMode ? '#27272a' : '#f4f4f5', fontWeight: 700 }}
            />
          </Box>
        </Box>

        {/* Telemetry Ribbons */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 1.5,
            mb: 2.5,
          }}
        >
          <Box sx={{ p: 1.2, borderRadius: 1.5, bgcolor: darkMode ? '#27272a' : '#f4f4f5' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: darkMode ? '#60a5fa' : '#2563eb' }}>
              <VerifiedUser sx={{ fontSize: 16 }} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>Security Assessment</Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
              {securityAssessment.threatClassification} (Threat: {securityAssessment.threatScore})
            </Typography>
            <Typography variant="caption" sx={{ color: darkMode ? '#a1a1aa' : '#71717a', fontSize: '0.65rem' }}>
              Hash: {securityAssessment.integrityHash.substring(0, 16)}...
            </Typography>
          </Box>

          <Box sx={{ p: 1.2, borderRadius: 1.5, bgcolor: darkMode ? '#27272a' : '#f4f4f5' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: darkMode ? '#a78bfa' : '#7c3aed' }}>
              <Code sx={{ fontSize: 16 }} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>Routing Decision</Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
              {routingDecision.selectedModel}
            </Typography>
            <Typography variant="caption" sx={{ color: darkMode ? '#a1a1aa' : '#71717a', fontSize: '0.65rem' }}>
              Local-First: {routingDecision.isLocalFirst ? 'Yes (Air-Gapped)' : 'Cloud'}
            </Typography>
          </Box>

          <Box sx={{ p: 1.2, borderRadius: 1.5, bgcolor: darkMode ? '#27272a' : '#f4f4f5' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: darkMode ? '#34d399' : '#059669' }}>
              <Memory sx={{ fontSize: 16 }} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>Virtual Concurrency</Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
              {performanceSnapshot.activeVirtualThreads} Virtual Threads
            </Typography>
            <Typography variant="caption" sx={{ color: darkMode ? '#a1a1aa' : '#71717a', fontSize: '0.65rem' }}>
              Compression: {performanceSnapshot.compressionRatio.toFixed(1)}x
            </Typography>
          </Box>

          <Box sx={{ p: 1.2, borderRadius: 1.5, bgcolor: darkMode ? '#27272a' : '#f4f4f5' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: darkMode ? '#f472b6' : '#db2777' }}>
              <Schedule sx={{ fontSize: 16 }} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>Latency & Span</Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
              {performanceSnapshot.durationMs}ms Total Time
            </Typography>
            <Typography variant="caption" sx={{ color: darkMode ? '#a1a1aa' : '#71717a', fontSize: '0.65rem' }}>
              Trace: {synthesis.telemetrySpan.traceId.substring(0, 14)}...
            </Typography>
          </Box>
        </Box>

        {/* Reasoning Steps */}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, fontSize: '0.85rem' }}>
          Deliberative Multi-Step Reasoning Trace:
        </Typography>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 1.5,
            bgcolor: darkMode ? '#09090b' : '#f8fafc',
            border: 1,
            borderColor: darkMode ? '#27272a' : '#e2e8f0',
            fontFamily: 'monospace',
            fontSize: '0.78rem',
            mb: 2.5,
          }}
        >
          {reasoningSteps.map((step, idx) => (
            <Box key={idx} sx={{ py: 0.3, color: darkMode ? '#e4e4e7' : '#334155' }}>
              {step}
            </Box>
          ))}
        </Box>

        {/* Synthesized Artifacts */}
        {synthesizedArtifacts && synthesizedArtifacts.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, fontSize: '0.85rem' }}>
              Synthesized Software Artifacts ({synthesizedArtifacts.length}):
            </Typography>
            {synthesizedArtifacts.map((artifact) => (
              <Box
                key={artifact.id}
                sx={{
                  border: 1,
                  borderColor: darkMode ? '#27272a' : '#e2e8f0',
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.8,
                    bgcolor: darkMode ? '#27272a' : '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                    📄 {artifact.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<ContentCopy sx={{ fontSize: '13px !important' }} />}
                      onClick={() => onCopyCode?.(artifact.code)}
                      sx={{ textTransform: 'none', fontSize: '0.7rem', py: 0.2 }}
                    >
                      Copy
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => onApplyArtifact?.(artifact)}
                      sx={{ textTransform: 'none', fontSize: '0.7rem', py: 0.2 }}
                    >
                      Apply to Workspace
                    </Button>
                  </Box>
                </Box>
                <Box
                  component="pre"
                  sx={{
                    m: 0,
                    p: 1.5,
                    bgcolor: darkMode ? '#09090b' : '#fafafa',
                    color: darkMode ? '#f4f4f5' : '#09090b',
                    fontSize: '0.75rem',
                    overflowX: 'auto',
                    fontFamily: 'monospace',
                  }}
                >
                  {artifact.code}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
