import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
  Chip,
  Tabs,
  Tab,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Image,
  VideoLibrary,
  AutoAwesome,
  CropFree,
  TextFields,
  Movie,
  ContentCut,
  Timer,
  CheckCircle,
} from '@mui/icons-material';
import {
  ImageResolution,
  ImageProcessingResult,
  VideoProcessingResult,
} from '../../types/mediaAi';
import {
  generateImage,
  editImage,
  removeBackground,
  extractOcr,
  generateVideo,
  summarizeVideo,
} from '../../services/mediaAiService';

export interface MediaStudioModalProps {
  open: boolean;
  onClose: () => void;
  darkMode: boolean;
  token?: string | null;
  notify: (msg: string) => void;
  onInsertImageIntoChat?: (imageUri: string, prompt: string) => void;
}

export const MediaStudioModal: React.FC<MediaStudioModalProps> = ({
  open,
  onClose,
  darkMode,
  token,
  notify,
  onInsertImageIntoChat,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  // Image State
  const [imagePrompt, setImagePrompt] = useState<string>('Sovereign Hexagonal Architecture Blueprint');
  const [resolution, setResolution] = useState<ImageResolution>('RES_1024x1024');
  const [imageStyle, setImageStyle] = useState<string>('TECH_BLUEPRINT');
  const [imageResult, setImageResult] = useState<ImageProcessingResult | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  // Video State
  const [videoPrompt, setVideoPrompt] = useState<string>('Autonomous Zero-Downtime Microservice Deployment');
  const [videoDuration, setVideoDuration] = useState<number>(15);
  const [videoResult, setVideoResult] = useState<VideoProcessingResult | null>(null);
  const [videoLoading, setVideoLoading] = useState<boolean>(false);

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setImageLoading(true);
    try {
      const res = await generateImage(imagePrompt, resolution, imageStyle, token);
      setImageResult(res);
      notify(`Generated image blueprint in ${res.processingLatencyMs}ms`);
    } catch {
      notify('Failed to generate image');
    } finally {
      setImageLoading(false);
    }
  };

  const handleRemoveBg = async () => {
    if (!imageResult) return;
    setImageLoading(true);
    try {
      const res = await removeBackground(imageResult.imageUri, token);
      setImageResult(res);
      notify('Background removed successfully!');
    } catch {
      notify('Background removal failed');
    } finally {
      setImageLoading(false);
    }
  };

  const handleExtractOcr = async () => {
    if (!imageResult) return;
    setImageLoading(true);
    try {
      const res = await extractOcr(imageResult.imageUri, token);
      setImageResult((prev) => prev ? { ...prev, extractedOcrText: res.extractedOcrText } : res);
      notify('OCR text extracted from image!');
    } catch {
      notify('OCR extraction failed');
    } finally {
      setImageLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) return;
    setVideoLoading(true);
    try {
      const res = await generateVideo(videoPrompt, videoDuration, token);
      setVideoResult(res);
      notify(`Generated AI video with ${res.scenes.length} scenes in ${res.processingLatencyMs}ms`);
    } catch {
      notify('Failed to generate video');
    } finally {
      setVideoLoading(false);
    }
  };

  const handleSummarizeVideo = async () => {
    setVideoLoading(true);
    try {
      const res = await summarizeVideo(undefined, videoPrompt, token);
      setVideoResult(res);
      notify('Video summarized with scene detection and subtitles!');
    } catch {
      notify('Failed to summarize video');
    } finally {
      setVideoLoading(false);
    }
  };

  const handleInsertChat = () => {
    if (imageResult && onInsertImageIntoChat) {
      onInsertImageIntoChat(imageResult.imageUri, imageResult.prompt);
      notify('Inserted image into Chat session!');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Image color="primary" /> Image & Video AI Studio (Phase 8)
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor: darkMode ? '#0f172a' : '#f8fafc' }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<AutoAwesome />} iconPosition="start" label="Image Studio & OCR" />
          <Tab icon={<VideoLibrary />} iconPosition="start" label="Video Studio & Scene Detection" />
        </Tabs>

        {activeTab === 0 && (
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <TextField
                fullWidth
                size="small"
                label="Image Prompt / Blueprint Description"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Resolution</InputLabel>
                <Select
                  value={resolution}
                  label="Resolution"
                  onChange={(e) => setResolution(e.target.value as ImageResolution)}
                >
                  <MenuItem value="RES_1024x1024">1024x1024 (1:1)</MenuItem>
                  <MenuItem value="RES_512x512">512x512</MenuItem>
                  <MenuItem value="RES_1792x1024">1792x1024 (16:9)</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={handleGenerateImage}
                disabled={imageLoading}
                sx={{ minWidth: 140 }}
              >
                {imageLoading ? 'Generating...' : 'Generate'}
              </Button>
            </Stack>

            {imageResult && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      bgcolor: darkMode ? '#1e293b' : '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      component="img"
                      src={imageResult.imageUri}
                      alt={imageResult.prompt}
                      sx={{
                        width: '100%',
                        maxHeight: 280,
                        objectFit: 'contain',
                        borderRadius: 1,
                        mb: 1.5,
                        bgcolor: '#0f172a',
                      }}
                    />
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="outlined" startIcon={<CropFree />} onClick={handleRemoveBg}>
                        Remove BG
                      </Button>
                      <Button size="small" variant="outlined" startIcon={<TextFields />} onClick={handleExtractOcr}>
                        OCR
                      </Button>
                      {onInsertImageIntoChat && (
                        <Button size="small" variant="contained" onClick={handleInsertChat}>
                          Insert to Chat
                        </Button>
                      )}
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: darkMode ? '#1e293b' : '#fff' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      AI Inspection & Object Detection:
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                      {imageResult.detectedObjects.map((obj, i) => (
                        <Chip
                          key={i}
                          label={`${obj.label} (${(obj.confidence * 100).toFixed(0)}%)`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Stack>

                    {imageResult.extractedOcrText && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                          Extracted OCR Text:
                        </Typography>
                        <Typography
                          variant="caption"
                          component="pre"
                          sx={{
                            fontFamily: 'monospace',
                            p: 1,
                            bgcolor: darkMode ? '#0f172a' : '#f8fafc',
                            borderRadius: 1,
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {imageResult.extractedOcrText}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            )}
          </Stack>
        )}

        {activeTab === 1 && (
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <TextField
                fullWidth
                size="small"
                label="Video Prompt / Title"
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Duration</InputLabel>
                <Select
                  value={videoDuration}
                  label="Duration"
                  onChange={(e) => setVideoDuration(Number(e.target.value))}
                >
                  <MenuItem value={15}>15 sec</MenuItem>
                  <MenuItem value={30}>30 sec</MenuItem>
                  <MenuItem value={60}>60 sec</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<Movie />}
                onClick={handleGenerateVideo}
                disabled={videoLoading}
              >
                Generate Video
              </Button>
              <Button
                variant="outlined"
                onClick={handleSummarizeVideo}
                disabled={videoLoading}
              >
                Summarize
              </Button>
            </Stack>

            {videoResult && (
              <Stack spacing={2}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: darkMode ? '#1e293b' : '#fff' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip label={`${videoResult.durationSec}s Duration`} color="primary" size="small" />
                    <Chip label={`${videoResult.scenes.length} Scenes`} variant="outlined" size="small" />
                    <Chip label={`${videoResult.subtitles.length} Subtitle Tracks`} variant="outlined" size="small" />
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {videoResult.summary}
                  </Typography>

                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ContentCut fontSize="inherit" /> Detected Video Scenes:
                  </Typography>
                  <List dense disablePadding>
                    {videoResult.scenes.map((sc) => (
                      <ListItem key={sc.sceneIndex} sx={{ px: 0 }}>
                        <ListItemText
                          primary={
                            <Typography variant="caption">
                              <strong>Scene {sc.sceneIndex}</strong> [{sc.startSec.toFixed(1)}s - {sc.endSec.toFixed(1)}s]: {sc.description}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 1.5, mb: 0.5 }}>
                    Subtitles & Captions:
                  </Typography>
                  <Stack spacing={0.5}>
                    {videoResult.subtitles.map((sub) => (
                      <Typography key={sub.cueIndex} variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                        [{sub.startSec.toFixed(1)}s - {sub.endSec.toFixed(1)}s] {sub.text}
                      </Typography>
                    ))}
                  </Stack>
                </Paper>
              </Stack>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
