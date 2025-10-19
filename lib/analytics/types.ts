export interface PageViewedProps {
  pagePath: string;
  pageTitle: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface ChatMessageSentProps {
  messageLength: number;
  hasImage?: boolean;
  conversationLength: number;
  sessionId: string;
  suggestionUsed?: boolean;
  suggestionText?: string;
}

export type GenerationType = 'text_to_image' | 'text_to_video' | 'image_to_video';

export interface GenerationStartedProps {
  generationType: GenerationType;
  modelName: string;
  modelCategory: string;
  promptLength: number;
  hasNegativePrompt?: boolean;

  aspectRatio?: string;
  batchSize?: number;
  duration?: number;
  resolution?: string;
  cameraControl?: string;

  initiatedFrom: 'chat' | 'pro_mode';
  jobSetId: string;
  sessionId: string;
}

export interface GenerationCompletedProps {
  generationType: GenerationType;
  modelName: string;
  jobSetId: string;

  totalDurationMs: number;
  pollingCount: number;

  outputCount: number;
  outputUrls: string[];

  sessionId: string;
}

export interface GenerationFailedProps {
  generationType: GenerationType;
  modelName: string;
  jobSetId: string;

  errorMessage: string;
  errorCode?: string;
  failureStage: 'initiation' | 'processing' | 'polling' | 'timeout';
  durationBeforeFailureMs: number;

  sessionId: string;
}
