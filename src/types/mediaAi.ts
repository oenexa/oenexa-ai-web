export type MediaTaskType =
  | 'IMAGE_GENERATION'
  | 'IMAGE_EDIT'
  | 'BACKGROUND_REMOVAL'
  | 'OCR_TEXT_EXTRACTION'
  | 'IMAGE_ANALYSIS'
  | 'VIDEO_SUMMARIZATION'
  | 'AI_VIDEO_GENERATION'
  | 'SUBTITLE_GENERATION'
  | 'SCENE_DETECTION';

export type ImageResolution =
  | 'RES_512x512'
  | 'RES_1024x1024'
  | 'RES_1792x1024'
  | 'RES_1024x1792';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DetectedObject {
  label: string;
  confidence: number;
  boundingBox: BoundingBox;
}

export interface ImageProcessingResult {
  mediaId: string;
  imageUri: string;
  prompt: string;
  resolution: ImageResolution;
  description: string;
  detectedObjects: DetectedObject[];
  extractedOcrText: string;
  processingLatencyMs: number;
}

export interface VideoScene {
  sceneIndex: number;
  startSec: number;
  endSec: number;
  description: string;
  keyframeUri: string;
}

export interface SubtitleCue {
  cueIndex: number;
  startSec: number;
  endSec: number;
  text: string;
}

export interface VideoProcessingResult {
  mediaId: string;
  videoUri: string;
  prompt: string;
  summary: string;
  scenes: VideoScene[];
  subtitles: SubtitleCue[];
  durationSec: number;
  processingLatencyMs: number;
}

export interface GenerateImageRequest {
  prompt: string;
  resolution?: ImageResolution;
  style?: string;
}

export interface EditImageRequest {
  imageBase64: string;
  instruction: string;
}

export interface ImageRequest {
  imageBase64: string;
}

export interface VideoRequest {
  videoBase64?: string;
  title?: string;
}

export interface GenerateVideoRequest {
  prompt: string;
  durationSec?: number;
}
