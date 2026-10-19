import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Grid,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle,
} from '@mui/icons-material';
import { ProductRequirementsDocument } from '../../types';
import { synthesizePrd } from '../../services/prdService';

export interface ProductManagerTabProps {
  darkMode: boolean;
  token?: string | null;
  currentPrd: ProductRequirementsDocument | null;
  setCurrentPrd: React.Dispatch<React.SetStateAction<ProductRequirementsDocument | null>>;
  notify: (msg: string) => void;
}

export const ProductManagerTab: React.FC<ProductManagerTabProps> = ({
  darkMode,
  token,
  currentPrd,
  setCurrentPrd,
  notify,
}) => {
  const [prdGoalInput, setPrdGoalInput] = useState<string>(
    'Real-Time Collaborative Code Review Microservice with Zero-Mock Invariant Verification'
  );
  const [prdAudienceInput, setPrdAudienceInput] = useState<string>(
    'Enterprise Software Engineers & Cloud Architects'
  );
  const [generatingPrd, setGeneratingPrd] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!prdGoalInput.trim()) return;
    setGeneratingPrd(true);
    try {
      const generated = await synthesizePrd(prdGoalInput, prdAudienceInput, token);
      setCurrentPrd(generated);
      notify('Synthesized Autonomous PRD & INVEST User Stories!');
    } catch {
      notify('Failed to synthesize PRD');
    } finally {
      setGeneratingPrd(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Card elevation={2} sx={{ bgcolor: darkMode ? '#1e293b' : '#ffffff', borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 2,
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentIcon color="primary" /> AI Product Manager & PRD Studio
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Autonomous Product Requirements Synthesis • INVEST-Compliant User Stories • Gherkin Acceptance Criteria • Story Point Estimation
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="PRODUCT_MANAGER_AGENT" color="primary" sx={{ fontWeight: 700 }} />
              <Chip label="INVEST Standard" color="success" variant="outlined" sx={{ fontWeight: 700 }} />
              <Chip label="Gherkin BDD" color="info" variant="outlined" sx={{ fontWeight: 700 }} />
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Product Engineering Objective / User Directive"
              placeholder="e.g. Real-Time Collaborative Code Review Microservice with Zero-Mock Invariant Verification"
              value={prdGoalInput}
              onChange={(e) => setPrdGoalInput(e.target.value)}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Target Audience / Stakeholders"
              placeholder="e.g. Enterprise Software Engineers & Cloud Architects"
              value={prdAudienceInput}
              onChange={(e) => setPrdAudienceInput(e.target.value)}
              fullWidth
              variant="outlined"
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="large"
                color="primary"
                startIcon={generatingPrd ? <CircularProgress size={20} color="inherit" /> : <AssignmentIcon />}
                onClick={handleGenerate}
                disabled={generatingPrd || !prdGoalInput.trim()}
                sx={{ px: 4, py: 1.2, fontWeight: 700, borderRadius: 2 }}
              >
                {generatingPrd ? 'Synthesizing PRD & User Stories...' : 'Synthesize Autonomous PRD & User Stories'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {currentPrd && (
        <Card elevation={2} sx={{ bgcolor: darkMode ? '#1e293b' : '#ffffff', borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                📄 {currentPrd.title}
              </Typography>
              <Chip label={currentPrd.releaseRoadmap} color="primary" sx={{ fontWeight: 700 }} />
            </Box>

            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
              <strong>Target Audience:</strong> {currentPrd.targetAudience}
            </Typography>

            <Paper
              variant="outlined"
              sx={{ p: 2, borderRadius: 2, bgcolor: darkMode ? '#0f172a' : '#f8fafc', mb: 3 }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                Problem Statement:
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                {currentPrd.problemStatement}
              </Typography>
            </Paper>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              ✨ Key Platform Features
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, mb: 3 }}>
              {currentPrd.keyFeatures.map((feat, fIdx) => (
                <Box key={fIdx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle fontSize="small" color="primary" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {feat}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              🧩 INVEST User Stories & Acceptance Criteria ({currentPrd.userStories.length})
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {currentPrd.userStories.map((story) => (
                <Grid item xs={12} md={6} key={story.id}>
                  <Card
                    variant="outlined"
                    sx={{ bgcolor: darkMode ? '#0f172a' : '#f8fafc', borderRadius: 2, height: '100%' }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 1.5,
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {story.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Chip label={`${story.storyPoints} Story Points`} size="small" color="primary" />
                          <Chip label={story.status} size="small" color="success" variant="outlined" />
                        </Box>
                      </Box>
                      <Paper
                        sx={{
                          p: 1.5,
                          mb: 1.5,
                          bgcolor: darkMode ? '#1e293b' : '#ffffff',
                          border: 1,
                          borderColor: 'divider',
                        }}
                      >
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>As a</strong> {story.asA}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>I want</strong> {story.iWant}
                        </Typography>
                        <Typography variant="body2">
                          <strong>So that</strong> {story.soThat}
                        </Typography>
                      </Paper>

                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
                        Gherkin Acceptance Criteria:
                      </Typography>
                      {story.acceptanceCriteria.map((crit, cIdx) => (
                        <Typography
                          key={cIdx}
                          variant="caption"
                          sx={{
                            display: 'block',
                            color: 'text.secondary',
                            fontFamily: 'monospace',
                            mb: 0.2,
                          }}
                        >
                          • {crit}
                        </Typography>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              ⚙️ Technical Constraints & Architecture Invariants
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {currentPrd.technicalConstraints.map((tc, tcIdx) => (
                <Chip key={tcIdx} label={tc} variant="outlined" color="info" size="small" />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
