export type AudioFormat = 'WAV' | 'MP3' | 'WEBM' | 'OGG' | 'AAC';

export type VoicePersona =
  | 'ALLOY'
  | 'ECHO'
  | 'FABLE'
  | 'ONYX'
  | 'NOVA'
  | 'SHIMMER'
  | 'OENEXA_SOVEREIGN';

export interface WordTimestamp {
  word: string;
  startSec: number;
  endSec: number;
}

export interface TranscriptionResult {
  text: string;
  language: string;
  confidence: number;
  words: WordTimestamp[];
  durationMs: number;
}

export interface SpeechSynthesisResult {
  audioDataUri: string;
  persona: VoicePersona;
  format: AudioFormat;
  sizeBytes: number;
  generationLatencyMs: number;
}

export interface VoiceCommand {
  commandType: string;
  parameters: Record<string, string>;
  transcribedText: string;
  executed: boolean;
}

export interface MeetingSpeakerSegment {
  speakerId: string;
  speakerName: string;
  startSec: number;
  endSec: number;
  text: string;
}

export interface MeetingAudioAnalysis {
  meetingTitle: string;
  segments: MeetingSpeakerSegment[];
  summary: string;
  actionItems: string[];
  keyDecisions: string[];
}

export interface TranscribeRequest {
  audioBase64?: string;
  filename?: string;
  format?: AudioFormat;
}

export interface SynthesizeRequest {
  text: string;
  persona?: VoicePersona;
  format?: AudioFormat;
}

export interface VoiceCommandRequest {
  spokenText: string;
}

export interface MeetingAnalysisRequest {
  audioBase64?: string;
  meetingTitle?: string;
}
