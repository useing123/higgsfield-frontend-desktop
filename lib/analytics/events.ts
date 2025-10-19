import { amplitude } from './amplitude';
import type {
  PageViewedProps,
  ChatMessageSentProps,
  GenerationStartedProps,
  GenerationCompletedProps,
  GenerationFailedProps,
} from './types';

// ============================================================================
// PAGE EVENTS
// ============================================================================

export const trackPageViewed = (props: PageViewedProps) => {
  amplitude.track('Page Viewed', {
    page_path: props.pagePath,
    page_title: props.pageTitle,
    referrer: props.referrer || document.referrer,
    utm_source: props.utmSource,
    utm_medium: props.utmMedium,
    utm_campaign: props.utmCampaign,
  });
};

// ============================================================================
// CHAT EVENTS
// ============================================================================

export const trackChatMessageSent = (props: ChatMessageSentProps) => {
  amplitude.track('Chat Message Sent', {
    message_length: props.messageLength,
    has_image: props.hasImage || false,
    conversation_length: props.conversationLength,
    session_id: props.sessionId,
    suggestion_used: props.suggestionUsed || false,
    suggestion_text: props.suggestionText,
  });

  // Increment user property
  amplitude.identify(new amplitude.Identify().add('total_chat_messages', 1));
};

export const trackChatResponseReceived = (props: {
  responseTimeMs: number;
  responseLength: number;
  hasJobDetails: boolean;
  sessionId: string;
}) => {
  amplitude.track('Chat Response Received', {
    response_time_ms: props.responseTimeMs,
    response_length: props.responseLength,
    has_job_details: props.hasJobDetails,
    session_id: props.sessionId,
  });
};

export const trackFeatureCardClicked = (props: {
  cardType: 'video_prompt' | 'brainstorm' | 'script' | 'character';
  cardPosition: number;
  sessionId: string;
}) => {
  amplitude.track('Feature Card Clicked', {
    card_type: props.cardType,
    card_position: props.cardPosition,
    session_id: props.sessionId,
  });
};

export const trackSuggestionPromptClicked = (props: {
  suggestionText: string;
  suggestionIndex: number;
}) => {
  amplitude.track('Suggestion Prompt Clicked', {
    suggestion_text: props.suggestionText,
    suggestion_index: props.suggestionIndex,
  });
};

// ============================================================================
// GENERATION EVENTS (CRITICAL BUSINESS METRICS)
// ============================================================================

export const trackGenerationStarted = (props: GenerationStartedProps) => {
  amplitude.track('Generation Started', {
    generation_type: props.generationType,
    model_name: props.modelName,
    model_category: props.modelCategory,
    prompt_length: props.promptLength,
    has_negative_prompt: props.hasNegativePrompt || false,

    aspect_ratio: props.aspectRatio,
    batch_size: props.batchSize,
    duration: props.duration,
    resolution: props.resolution,
    camera_control: props.cameraControl,

    initiated_from: props.initiatedFrom,
    job_set_id: props.jobSetId,
    session_id: props.sessionId,
  });
};

export const trackGenerationCompleted = (props: GenerationCompletedProps) => {
  amplitude.track('Generation Completed', {
    generation_type: props.generationType,
    model_name: props.modelName,
    job_set_id: props.jobSetId,

    total_duration_ms: props.totalDurationMs,
    polling_count: props.pollingCount,

    output_count: props.outputCount,
    output_urls: props.outputUrls,

    session_id: props.sessionId,
  });

  // Increment user properties
  const identify = new amplitude.Identify()
    .add('total_generations', 1)
    .set('last_generation_date', new Date().toISOString())
    .set('last_model_used', props.modelName);

  amplitude.identify(identify);
};

export const trackGenerationFailed = (props: GenerationFailedProps) => {
  amplitude.track('Generation Failed', {
    generation_type: props.generationType,
    model_name: props.modelName,
    job_set_id: props.jobSetId,

    error_message: props.errorMessage,
    error_code: props.errorCode,
    failure_stage: props.failureStage,
    duration_before_failure_ms: props.durationBeforeFailureMs,

    session_id: props.sessionId,
  });
};

export const trackGenerationDownloaded = (props: {
  generationType: string;
  modelName: string;
  jobSetId: string;
  fileType: 'image' | 'video';
  outputIndex: number;
}) => {
  amplitude.track('Generation Downloaded', props);

  amplitude.identify(new amplitude.Identify().add('total_downloads', 1));
};

// ============================================================================
// PRO MODE EVENTS
// ============================================================================

export const trackModelCategorySelected = (props: {
  category: string;
  previousCategory?: string;
}) => {
  amplitude.track('Model Category Selected', {
    category: props.category,
    previous_category: props.previousCategory,
  });
};

export const trackModelChanged = (props: {
  category: string;
  fromModel: string;
  toModel: string;
  modelIndex: number;
}) => {
  amplitude.track('Model Changed', {
    category: props.category,
    from_model: props.fromModel,
    to_model: props.toModel,
    model_index: props.modelIndex,
  });
};

export const trackLayoutChanged = (props: {
  fromLayout: string;
  toLayout: string;
}) => {
  amplitude.track('Layout Changed', {
    from_layout: props.fromLayout,
    to_layout: props.toLayout,
  });

  amplitude.identify(
    new amplitude.Identify().set('preferred_layout', props.toLayout)
  );
};

// ============================================================================
// NAVIGATION EVENTS
// ============================================================================

export const trackNavigationLinkClicked = (props: {
  linkText: string;
  linkDestination: string;
  currentPage: string;
}) => {
  amplitude.track('Navigation Link Clicked', {
    link_text: props.linkText,
    link_destination: props.linkDestination,
    current_page: props.currentPage,
  });
};

export const trackCTAButtonClicked = (props: {
  buttonText: string;
  buttonLocation: string;
  destination: string;
}) => {
  amplitude.track('CTA Button Clicked', {
    button_text: props.buttonText,
    button_location: props.buttonLocation,
    destination: props.destination,
  });
};

// ============================================================================
// ERROR EVENTS
// ============================================================================

export const trackAPIError = (props: {
  endpoint: string;
  errorMessage: string;
  errorCode?: number;
  requestMethod: string;
  retryAttempt?: number;
}) => {
  amplitude.track('API Error', {
    endpoint: props.endpoint,
    error_message: props.errorMessage,
    error_code: props.errorCode,
    request_method: props.requestMethod,
    retry_attempt: props.retryAttempt,
  });
};

export const trackClientError = (props: {
  errorMessage: string;
  errorStack?: string;
  componentName?: string;
  pagePath: string;
}) => {
  amplitude.track('Client Error', {
    error_message: props.errorMessage,
    error_stack: props.errorStack,
    component_name: props.componentName,
    page_path: props.pagePath,
  });
};

// ============================================================================
// COMMUNITY EVENTS
// ============================================================================

export const trackCommunityPostViewed = (props: {
  postId: string;
  postType: 'image' | 'video';
  authorId?: string;
  hasDescription: boolean;
}) => {
  amplitude.track('Community Post Viewed', props);
};

export const trackCommunityPostLiked = (props: {
  postId: string;
  postType: string;
}) => {
  amplitude.track('Community Post Liked', props);
};

export const trackCommunityActionClicked = (props: {
  postId: string;
  actionType: 'animate' | 'edit' | 'upscale';
  postType: string;
}) => {
  amplitude.track('Community Action Clicked', {
    post_id: props.postId,
    action_type: props.actionType,
    post_type: props.postType,
  });
};
