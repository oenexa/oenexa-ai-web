import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  Paper,
} from '@mui/material';
import { AutoFixHigh } from '@mui/icons-material';
import { CursorContextReference, AtomicMultiFilePatch } from '../../../types';
import {
  curateCursorContext,
  generateCursorPatch,
  createDefaultCursorContexts,
  createDefaultCursorAtomicPatch,
} from '../../../services/capabilities/cursorService';

export interface CursorCodingSubTabProps {
  darkMode: boolean;
  token: string | null;
  repositoryId: string;
  notify: (msg: string) => void;
}

export const CursorCodingSubTab: React.FC<CursorCodingSubTabProps> = ({
  darkMode,
  token,
  repositoryId,
  notify,
}) => {
  const [cursorQueryInput, setCursorQueryInput] = useState<string>(
    '@symbol TargetCapabilitiesService'
  );
  const [cursorContexts, setCursorContexts] = useState<CursorContextReference[]>(
    createDefaultCursorContexts()
  );
  const [cursorPatchObjective, setCursorPatchObjective] = useState<string>(
    'Refactor authentication pipeline to reactive Spring WebFlux and defensive invariants'
  );
  const [cursorPatchFiles, setCursorPatchFiles] = useState<string>(
    'src/main/java/com/oenexa/security/AuthService.java, src/main/java/com/oenexa/security/SecurityConfig.java'
  );
  const [cursorAtomicPatch, setCursorAtomicPatch] = useState<AtomicMultiFilePatch | null>(
    createDefaultCursorAtomicPatch()
  );
  const [runningCursorPatch, setRunningCursorPatch] = useState<boolean>(false);

  const handleCurateCursorContext = async () => {
    if (!cursorQueryInput.trim()) return;
    try {
      const contexts = await curateCursorContext(
        cursorQueryInput.trim(),
        repositoryId,
        token
      );
      setCursorContexts(contexts);
      notify(`Curated ${contexts.length} Cursor code references for '${cursorQueryInput}'!`);
    } catch {
      notify('Failed to curate Cursor context');
    }
  };

  const handleGenerateCursorPatch = async () => {
    if (!cursorPatchObjective.trim()) return;
    setRunningCursorPatch(true);
    const files = cursorPatchFiles.split(',').map((f) => f.trim()).filter(Boolean);
    try {
      const patch = await generateCursorPatch(cursorPatchObjective.trim(), files, token);
      setCursorAtomicPatch(patch);
      notify(`Cursor Atomic Multi-File Patch generated across ${patch.fileDiffs.length} files!`);
    } catch {
      notify('Failed to generate Cursor atomic patch');
    } finally {
      setRunningCursorPatch(false);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={5}>
        <Card
          sx={{
            bgcolor: darkMode ? '#1e293b' : '#ffffff',
            border: 1,
            borderColor: 'divider',
            mb: 3,
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              🔍 Cursor @Context Curation
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
              Query symbols, files, folders, and git diffs across the entire 23-module workspace.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="@symbol TargetCapabilitiesService or @file src/App.tsx"
                value={cursorQueryInput}
                onChange={(e) => setCursorQueryInput(e.target.value)}
              />
              <Button variant="contained" onClick={handleCurateCursorContext}>
                Curate
              </Button>
            </Box>

            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>
              Curated Context References ({cursorContexts.length}):
            </Typography>
            <List dense disablePadding>
              {cursorContexts.map((ctx) => (
                <ListItem
                  key={ctx.refId}
                  sx={{
                    bgcolor: darkMode ? '#0f172a' : '#f8fafc',
                    mb: 1,
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                    display: 'block',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 0.5,
                    }}
                  >
                    <Chip label={ctx.type} size="small" color="primary" variant="outlined" />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Relevance: {ctx.relevanceScore}
                    </Typography>
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, fontFamily: 'monospace', mb: 0.5 }}
                  >
                    {ctx.targetPathOrSymbol}
                  </Typography>
                  <Typography
                    variant="caption"
                    component="pre"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'monospace',
                      color: 'text.secondary',
                    }}
                  >
                    {ctx.extractedSnippet}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        <Card
          sx={{
            bgcolor: darkMode ? '#1e293b' : '#ffffff',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              ⚡ Atomic Multi-File Patch Generator
            </Typography>
            <TextField
              fullWidth
              size="small"
              label="Patch Objective"
              value={cursorPatchObjective}
              onChange={(e) => setCursorPatchObjective(e.target.value)}
              sx={{ mb: 1.5 }}
            />
            <TextField
              fullWidth
              size="small"
              label="Target File Paths (comma separated)"
              value={cursorPatchFiles}
              onChange={(e) => setCursorPatchFiles(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              startIcon={runningCursorPatch ? <CircularProgress size={16} /> : <AutoFixHigh />}
              onClick={handleGenerateCursorPatch}
              disabled={runningCursorPatch || !cursorPatchObjective.trim()}
            >
              {runningCursorPatch ? 'Generating Patch...' : 'Synthesize Multi-File Atomic Patch'}
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={7}>
        {cursorAtomicPatch ? (
          <Card
            sx={{
              bgcolor: darkMode ? '#1e293b' : '#ffffff',
              border: 1,
              borderColor: 'divider',
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {cursorAtomicPatch.description}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Patch ID: {cursorAtomicPatch.patchId} • Created: {cursorAtomicPatch.createdAt}
                  </Typography>
                </Box>
                <Chip
                  label={
                    cursorAtomicPatch.rollbackSafe ? 'Rollback Safe (Atomic)' : 'Partial Patch'
                  }
                  color={cursorAtomicPatch.rollbackSafe ? 'success' : 'warning'}
                  size="small"
                />
              </Box>

              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
                Affected Symbols:
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                {cursorAtomicPatch.affectedSymbols.map((sym, sIdx) => (
                  <Chip key={sIdx} label={sym} size="small" variant="outlined" color="primary" />
                ))}
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                File Diffs ({cursorAtomicPatch.fileDiffs.length}):
              </Typography>
              {cursorAtomicPatch.fileDiffs.map((diff, dIdx) => (
                <Paper
                  key={dIdx}
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: darkMode ? '#0f172a' : '#f8fafc',
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, fontFamily: 'monospace' }}
                    >
                      📄 {diff.filePath}
                    </Typography>
                    <Chip label={diff.action} size="small" color="info" />
                  </Box>
                  <Typography
                    variant="caption"
                    component="pre"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'monospace',
                      color: darkMode ? '#38bdf8' : '#0369a1',
                    }}
                  >
                    {diff.patchContent}
                  </Typography>
                </Paper>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Alert severity="info">
            No atomic patch generated yet. Enter an objective and click Synthesize.
          </Alert>
        )}
      </Grid>
    </Grid>
  );
};

export default CursorCodingSubTab;
