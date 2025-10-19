# Amplitude Implementation Guide for Higgsfield AI

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Why Amplitude for AI Model Usage Tracking](#why-amplitude)
3. [Event Taxonomy Design](#event-taxonomy)
4. [Technical Implementation](#technical-implementation)
5. [User Identification Strategy](#user-identification)
6. [Custom Events & Properties](#custom-events)
7. [Implementation Roadmap](#roadmap)
8. [Code Examples](#code-examples)
9. [Analytics Dashboard Strategy](#dashboard-strategy)
10. [Privacy & Compliance](#privacy-compliance)
11. [Testing & Validation](#testing)

---

## Executive Summary

This document outlines a comprehensive Amplitude implementation strategy for Higgsfield AI to track:
- **Model usage metrics** (T2I, T2V, I2V generations)
- **User engagement patterns** (chat interactions, feature adoption)
- **Business KPIs** (conversion funnel, feature discovery)
- **Product performance** (error rates, completion times, model preferences)

**Current State:**
- Basic Vercel Analytics (web vitals only)
- No custom event tracking
- No user identification system
- No model usage analytics

**Target State:**
- Comprehensive event tracking across all user interactions
- Model performance analytics by type/provider
- User journey funnel analysis
- Real-time error monitoring
- Feature adoption metrics

---

## Why Amplitude for AI Model Usage Tracking {#why-amplitude}

### Key Benefits for Higgsfield

1. **Generative AI Specific Metrics:**
   - Track generation count by model (Kling, Minimax, Seedance, Veo3, etc.)
   - Measure model performance (completion rate, time-to-completion)
   - A/B test different models and prompts
   - Understand batch size preferences and aspect ratio trends

2. **Product Analytics:**
   - User flow analysis (Lite Chat → Pro Mode → Community)
   - Feature discovery and adoption rates
   - Retention cohorts based on generation patterns
   - Identify power users vs casual users

3. **Business Intelligence:**
   - Conversion funnel optimization (visitor → user → paid)
   - Model cost analysis (which models drive engagement vs cost)
   - Revenue attribution (which features drive subscriptions)
   - Churn prediction based on usage patterns

4. **Technical Advantages:**
   - Real-time event ingestion
   - Powerful segmentation and cohort analysis
   - User property tracking (subscription tier, total generations)
   - Event property tracking (model type, parameters, duration)
   - Behavioral cohorts for targeted features

---

## Event Taxonomy Design {#event-taxonomy}

### Event Naming Convention

**Pattern:** `[Category] [Action]` (e.g., `Chat Message Sent`, `Generation Started`)

**Categories:**
- **Page**: Page view events
- **Navigation**: Navigation and routing
- **Chat**: Chat interface interactions
- **Generation**: Model generation events
- **Community**: Community interactions
- **Auth**: Authentication events (future)
- **Error**: Error and failure events

### Core Event Structure

```typescript
interface AmplitudeEvent {
  event_type: string;                    // Event name
  user_id?: string;                      // User ID (once auth is implemented)
  device_id: string;                     // Anonymous device ID
  event_properties: Record<string, any>; // Custom properties
  user_properties?: Record<string, any>; // User-level properties
  time?: number;                         // Event timestamp
}
```

---

## Custom Events & Properties {#custom-events}

### 1. Page View Events

#### `Page Viewed`
**When:** Every page navigation
**Properties:**
```typescript
{
  page_path: string;           // '/lite', '/generate', '/community'
  page_title: string;          // 'Chat Interface', 'Pro Mode'
  referrer: string;            // Previous page or external referrer
  utm_source?: string;         // Marketing attribution
  utm_medium?: string;
  utm_campaign?: string;
}
```

**Use Cases:**
- Track most popular pages
- Measure bounce rates
- Understand user navigation patterns
- Marketing campaign attribution

---

### 2. Chat Interface Events

#### `Chat Message Sent`
**When:** User sends a message in Lite chat
**Properties:**
```typescript
{
  message_length: number;      // Character count
  has_image: boolean;          // Whether image was uploaded
  conversation_length: number; // Number of messages in conversation
  session_id: string;          // Unique session identifier
  suggestion_used: boolean;    // Whether user clicked suggestion
  suggestion_text?: string;    // Which suggestion was used
}
```

#### `Chat Response Received`
**When:** Assistant responds to user message
**Properties:**
```typescript
{
  response_time_ms: number;    // Time to first response
  response_length: number;     // Character count
  has_job_details: boolean;    // Whether response includes generation job
  session_id: string;
}
```

#### `Feature Card Clicked`
**When:** User clicks a feature card (Generate Video Prompt, Brainstorm, etc.)
**Properties:**
```typescript
{
  card_type: 'video_prompt' | 'brainstorm' | 'script' | 'character';
  card_position: number;       // Position in grid (0-3)
  session_id: string;
}
```

#### `Suggestion Prompt Clicked`
**When:** User clicks animated typing suggestion
**Properties:**
```typescript
{
  suggestion_text: string;     // The suggestion they clicked
  suggestion_index: number;    // Which suggestion in rotation
}
```

**Use Cases:**
- Measure chat engagement depth
- Identify most popular features
- Optimize suggestion prompts
- Track session length and quality

---

### 3. Generation Events (Core Business Metrics)

#### `Generation Started`
**When:** User initiates any generation (T2I, T2V, I2V)
**Properties:**
```typescript
{
  generation_type: 'text_to_image' | 'text_to_video' | 'image_to_video';
  model_name: string;          // 'kling25', 'minimax', 'veo3', etc.
  model_category: string;      // 'Image to Video', 'Text to Video', etc.
  prompt_length: number;       // Character count of prompt
  has_negative_prompt: boolean;

  // Model-specific parameters
  aspect_ratio?: string;       // '16:9', '9:16', '1:1'
  batch_size?: number;         // Number of images/videos requested
  duration?: number;           // Video duration in seconds
  resolution?: string;         // '720p', '1080p'
  camera_control?: string;     // For I2V

  // Context
  initiated_from: 'chat' | 'pro_mode';
  job_set_id: string;          // Backend job identifier
  session_id: string;
}
```

#### `Generation Completed`
**When:** Generation job finishes successfully
**Properties:**
```typescript
{
  generation_type: string;
  model_name: string;
  job_set_id: string;

  // Performance metrics
  total_duration_ms: number;   // Time from start to completion
  polling_count: number;       // Number of status checks

  // Results
  output_count: number;        // Number of outputs generated
  output_urls: string[];       // URLs of generated content

  session_id: string;
}
```

#### `Generation Failed`
**When:** Generation job fails or errors
**Properties:**
```typescript
{
  generation_type: string;
  model_name: string;
  job_set_id: string;

  // Error details
  error_message: string;
  error_code?: string;
  failure_stage: 'initiation' | 'processing' | 'polling' | 'timeout';
  duration_before_failure_ms: number;

  session_id: string;
}
```

#### `Generation Downloaded`
**When:** User downloads generated content
**Properties:**
```typescript
{
  generation_type: string;
  model_name: string;
  job_set_id: string;
  file_type: 'image' | 'video';
  output_index: number;        // Which output in batch (if multiple)
}
```

**Use Cases:**
- Track model usage and popularity
- Measure generation success rates by model
- Optimize model routing based on performance
- Calculate cost per successful generation
- Identify parameter combinations that succeed/fail
- Measure time-to-value for users

---

### 4. Pro Mode / Generate Page Events

#### `Model Category Selected`
**When:** User selects generation category in Pro Mode
**Properties:**
```typescript
{
  category: 'Image to Video' | 'Text to Video' | 'Text to Image' | 'Speak';
  previous_category?: string;
}
```

#### `Model Changed`
**When:** User switches model within a category
**Properties:**
```typescript
{
  category: string;
  from_model: string;
  to_model: string;
  model_index: number;         // Position in model list
}
```

#### `Layout Changed`
**When:** User changes panel layout
**Properties:**
```typescript
{
  from_layout: 'left' | 'right' | 'bottom';
  to_layout: 'left' | 'right' | 'bottom';
}
```

#### `Gallery Item Viewed`
**When:** User views item in their generation history
**Properties:**
```typescript
{
  generation_type: string;
  model_name: string;
  generation_age_hours: number; // How old is this generation
}
```

**Use Cases:**
- Measure Pro Mode adoption
- Track feature discovery
- Understand user preferences for layouts and models
- Optimize default settings

---

### 5. Community Events

#### `Community Post Viewed`
**When:** User views a community post detail
**Properties:**
```typescript
{
  post_id: string;
  post_type: 'image' | 'video';
  author_id?: string;
  has_description: boolean;
}
```

#### `Community Post Liked`
**When:** User likes a community post
**Properties:**
```typescript
{
  post_id: string;
  post_type: string;
}
```

#### `Community Post Commented`
**When:** User comments on a post
**Properties:**
```typescript
{
  post_id: string;
  comment_length: number;
}
```

#### `Community Action Clicked`
**When:** User clicks Animate, Edit, Upscale on community post
**Properties:**
```typescript
{
  post_id: string;
  action_type: 'animate' | 'edit' | 'upscale';
  post_type: string;
}
```

**Use Cases:**
- Measure community engagement
- Identify viral content
- Track feature adoption from community
- Understand content discovery patterns

---

### 6. Navigation Events

#### `Navigation Link Clicked`
**When:** User clicks header navigation
**Properties:**
```typescript
{
  link_text: string;           // 'Pro Mode', 'Community', 'Pricing'
  link_destination: string;    // URL path
  current_page: string;
}
```

#### `CTA Button Clicked`
**When:** User clicks call-to-action buttons
**Properties:**
```typescript
{
  button_text: string;         // 'Get Started', 'Try Now', 'Upgrade'
  button_location: string;     // 'header', 'hero', 'pricing_card'
  destination: string;
}
```

---

### 7. Error Events

#### `API Error`
**When:** API call fails
**Properties:**
```typescript
{
  endpoint: string;            // '/v1/chat', '/v1/t2i/nano-banana'
  error_message: string;
  error_code?: number;         // HTTP status code
  request_method: string;      // 'POST', 'GET'
  retry_attempt?: number;
}
```

#### `Client Error`
**When:** Client-side error occurs
**Properties:**
```typescript
{
  error_message: string;
  error_stack?: string;
  component_name?: string;     // React component where error occurred
  page_path: string;
}
```

**Use Cases:**
- Real-time error monitoring
- Identify reliability issues by model/endpoint
- Track error recovery rates
- Prioritize bug fixes by impact

---

### 8. User Properties (Profile-level Data)

Track at the user level (updated on each event):

```typescript
{
  // Demographics (future - when auth is added)
  user_id?: string;
  email?: string;
  signup_date?: string;
  subscription_tier?: 'free' | 'pro' | 'enterprise';

  // Usage statistics
  total_generations: number;
  total_chat_messages: number;
  total_downloads: number;
  favorite_model?: string;
  favorite_generation_type?: string;

  // Engagement metrics
  first_seen: string;          // ISO timestamp
  last_seen: string;
  days_active: number;
  sessions_count: number;

  // Preferences
  preferred_layout?: string;
  preferred_aspect_ratio?: string;
  theme?: 'light' | 'dark';
}
```

---

## Technical Implementation {#technical-implementation}

### Installation

```bash
npm install @amplitude/analytics-browser
```

### Project Structure

```
/lib
  /analytics
    /amplitude.ts              # Amplitude SDK initialization
    /events.ts                 # Event tracking functions
    /types.ts                  # TypeScript types for events
    /utils.ts                  # Helper utilities
/hooks
  /useAnalytics.ts             # React hook for tracking
```

---

## User Identification Strategy {#user-identification}

### Phase 1: Anonymous Tracking (Current - No Auth)

```typescript
// Generate stable device ID
const deviceId = localStorage.getItem('amplitude_device_id') ||
                 crypto.randomUUID();
localStorage.setItem('amplitude_device_id', deviceId);

amplitude.init(AMPLITUDE_API_KEY, undefined, {
  deviceId: deviceId,
  defaultTracking: {
    sessions: true,
    pageViews: true,
    formInteractions: false,
    fileDownloads: false
  }
});
```

**Pros:**
- Works immediately without auth
- Tracks unique devices/browsers
- Session tracking enabled

**Cons:**
- Can't track users across devices
- Lost on browser cache clear
- Can't tie to email/account

### Phase 2: Authenticated User Tracking (Future)

```typescript
// After user logs in
amplitude.setUserId(user.id);
amplitude.setUserProperties({
  email: user.email,
  signup_date: user.createdAt,
  subscription_tier: user.plan
});

// Update device ID mapping
amplitude.identify({
  device_id: deviceId,
  user_id: user.id
});
```

**Benefits:**
- Cross-device tracking
- Persistent user journey
- Email/account correlation
- Subscription tier analysis

## Code Examples {#code-examples}

### 1. Initialize Amplitude

**File:** `/lib/analytics/amplitude.ts`

```typescript
import * as amplitude from '@amplitude/analytics-browser';

const AMPLITUDE_API_KEY = process.env.AMPLITUDE_API_KEY!;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Initialize Amplitude
export const initAmplitude = () => {
  if (!AMPLITUDE_API_KEY) {
    console.warn('Amplitude API key not found');
    return;
  }

  // Get or create device ID
  const deviceId = getOrCreateDeviceId();

  amplitude.init(AMPLITUDE_API_KEY, undefined, {
    deviceId,
    defaultTracking: {
      sessions: true,
      pageViews: false, // We'll track manually for more control
      formInteractions: false,
      fileDownloads: false
    },
    minIdLength: 10,
    serverUrl: IS_PRODUCTION
      ? undefined
      : 'https://api2.amplitude.com/2/httpapi', // Use batch endpoint for dev
  });

  console.log('Amplitude initialized with device ID:', deviceId);
};

// Generate or retrieve stable device ID
const getOrCreateDeviceId = (): string => {
  const storageKey = 'higgsfield_device_id';

  if (typeof window === 'undefined') return '';

  let deviceId = localStorage.getItem(storageKey);

  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(storageKey, deviceId);
  }

  return deviceId;
};

// Set user ID (call after authentication)
export const setUserId = (userId: string) => {
  amplitude.setUserId(userId);
};

// Set user properties
export const setUserProperties = (properties: Record<string, any>) => {
  amplitude.identify(new amplitude.Identify().set(properties));
};

// Increment user property
export const incrementUserProperty = (property: string, value: number = 1) => {
  amplitude.identify(new amplitude.Identify().add(property, value));
};

export { amplitude };
```

---

### 2. Event Tracking Functions

**File:** `/lib/analytics/events.ts`

```typescript
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
```

---

### 3. TypeScript Types

**File:** `/lib/analytics/types.ts`

```typescript
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
```

---

### 4. React Hook for Analytics

**File:** `/hooks/useAnalytics.ts`

```typescript
import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageViewed } from '@/lib/analytics/events';

// Generate session ID
const getSessionId = () => {
  const key = 'higgsfield_session_id';
  const sessionTimeout = 30 * 60 * 1000; // 30 minutes

  if (typeof window === 'undefined') return '';

  const stored = sessionStorage.getItem(key);
  const timestamp = sessionStorage.getItem(`${key}_timestamp`);

  if (stored && timestamp) {
    const age = Date.now() - parseInt(timestamp);
    if (age < sessionTimeout) {
      return stored;
    }
  }

  // Create new session
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  sessionStorage.setItem(key, sessionId);
  sessionStorage.setItem(`${key}_timestamp`, Date.now().toString());

  return sessionId;
};

export const usePageTracking = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const pageTitle = getPageTitle(pathname);

    trackPageViewed({
      pagePath: pathname,
      pageTitle: pageTitle,
      referrer: document.referrer,
    });
  }, [pathname]);
};

const getPageTitle = (pathname: string): string => {
  const titles: Record<string, string> = {
    '/': 'Home',
    '/lite': 'Chat Interface',
    '/generate': 'Pro Mode',
    '/community': 'Community Gallery',
    '/pricing': 'Pricing',
    '/gallery': 'Gallery',
  };

  return titles[pathname] || pathname;
};

export const useSessionId = () => {
  return useCallback(() => getSessionId(), []);
};

export const useAnalytics = () => {
  const getSession = useSessionId();

  return {
    sessionId: getSession(),
    getSessionId: getSession,
  };
};
```

---

### 5. Integration in Root Layout

**File:** `/app/layout.tsx` (modify existing)

```typescript
'use client';

import { useEffect } from 'react';
import { Analytics } from "@vercel/analytics/next";
import { initAmplitude } from '@/lib/analytics/amplitude';
import { usePageTracking } from '@/hooks/useAnalytics';

function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Amplitude on client side
    initAmplitude();
  }, []);

  // Track page views
  usePageTracking();

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
        <Analytics />
      </body>
    </html>
  );
}
```

---

### 6. Integration in Chat Interface

**File:** `/components/lite/ChatInterface.tsx` (add tracking)

```typescript
import { trackChatMessageSent, trackFeatureCardClicked } from '@/lib/analytics/events';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function ChatInterface() {
  const { sessionId } = useAnalytics();
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = async (message: string, image?: File) => {
    const startTime = Date.now();

    // Track message sent
    trackChatMessageSent({
      messageLength: message.length,
      hasImage: !!image,
      conversationLength: messages.length,
      sessionId: sessionId,
      suggestionUsed: false, // Set to true if suggestion was clicked
    });

    // ... existing chat logic

    // Track response received
    const responseTime = Date.now() - startTime;
    trackChatResponseReceived({
      responseTimeMs: responseTime,
      responseLength: assistantMessage.length,
      hasJobDetails: !!jobDetails,
      sessionId: sessionId,
    });
  };

  const handleFeatureCardClick = (cardType: string, index: number) => {
    trackFeatureCardClicked({
      cardType: cardType as any,
      cardPosition: index,
      sessionId: sessionId,
    });

    // ... existing logic
  };

  // ... rest of component
}
```

---

### 7. Integration in API Service

**File:** `/services/apiService.ts` (add error tracking)

```typescript
import { trackAPIError } from '@/lib/analytics/events';

export async function textToImage(model: string, params: TextToImageParams) {
  const endpoint = `/v1/t2i/${model}`;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.text();

      // Track API error
      trackAPIError({
        endpoint: endpoint,
        errorMessage: error,
        errorCode: response.status,
        requestMethod: 'POST',
      });

      throw new Error(`API error: ${error}`);
    }

    return await response.json();
  } catch (error) {
    // Track network error
    trackAPIError({
      endpoint: endpoint,
      errorMessage: error.message,
      requestMethod: 'POST',
    });

    throw error;
  }
}
```

---

### 8. Integration in Generate Page

**File:** `/components/generate/GeneratePageClient.tsx` (add tracking)

```typescript
import {
  trackGenerationStarted,
  trackGenerationCompleted,
  trackGenerationFailed,
  trackModelCategorySelected,
  trackModelChanged
} from '@/lib/analytics/events';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function GeneratePageClient() {
  const { sessionId } = useAnalytics();

  const handleCategoryChange = (newCategory: string) => {
    trackModelCategorySelected({
      category: newCategory,
      previousCategory: selectedCategory,
    });

    setSelectedCategory(newCategory);
  };

  const handleModelChange = (newModel: string) => {
    const models = getModelsForCategory(selectedCategory);
    const modelIndex = models.findIndex(m => m.id === newModel);

    trackModelChanged({
      category: selectedCategory,
      fromModel: selectedModel,
      toModel: newModel,
      modelIndex: modelIndex,
    });

    setSelectedModel(newModel);
  };

  const handleGenerate = async (formData: any) => {
    const startTime = Date.now();
    const jobSetId = `job_${Date.now()}`;

    // Determine generation type
    const generationType = getGenerationType(selectedCategory);

    // Track generation started
    trackGenerationStarted({
      generationType: generationType,
      modelName: selectedModel,
      modelCategory: selectedCategory,
      promptLength: formData.prompt?.length || 0,
      hasNegativePrompt: !!formData.negative_prompt,
      aspectRatio: formData.aspect_ratio,
      batchSize: formData.batch_size,
      duration: formData.duration,
      resolution: formData.resolution,
      initiatedFrom: 'pro_mode',
      jobSetId: jobSetId,
      sessionId: sessionId,
    });

    try {
      // ... existing generation logic

      const result = await generateContent(selectedModel, formData);

      // Track completion
      trackGenerationCompleted({
        generationType: generationType,
        modelName: selectedModel,
        jobSetId: jobSetId,
        totalDurationMs: Date.now() - startTime,
        pollingCount: pollCount,
        outputCount: result.outputs.length,
        outputUrls: result.outputs.map(o => o.url),
        sessionId: sessionId,
      });

    } catch (error) {
      // Track failure
      trackGenerationFailed({
        generationType: generationType,
        modelName: selectedModel,
        jobSetId: jobSetId,
        errorMessage: error.message,
        failureStage: 'processing',
        durationBeforeFailureMs: Date.now() - startTime,
        sessionId: sessionId,
      });
    }
  };
}

function getGenerationType(category: string): GenerationType {
  const map: Record<string, GenerationType> = {
    'Image to Video': 'image_to_video',
    'Text to Video': 'text_to_video',
    'Text to Image': 'text_to_image',
  };
  return map[category] || 'text_to_image';
}
```

---

## Analytics Dashboard Strategy {#dashboard-strategy}

### Recommended Amplitude Dashboards

#### 1. **Executive Overview Dashboard**
- Total generations (last 7/30/90 days)
- Active users (DAU, WAU, MAU)
- Generation success rate %
- Top 5 models by usage
- User retention cohorts
- Revenue metrics (when billing is added)

#### 2. **Model Performance Dashboard**
- Generations by model (bar chart)
- Success rate by model (%)
- Average completion time by model
- Error rate by model
- Cost per generation by model (when cost data is available)
- User satisfaction by model (when ratings are added)

#### 3. **User Journey Funnel**
```
Landing Page View
    ↓ (conversion rate)
Chat Message Sent
    ↓
Generation Started
    ↓
Generation Completed
    ↓
Download
```

#### 4. **Feature Adoption Dashboard**
- Pro Mode usage %
- Feature card clicks distribution
- Community engagement metrics
- Layout preference distribution
- Model category popularity

#### 5. **Error Monitoring Dashboard**
- API errors by endpoint
- Client errors by page
- Generation failures by model
- Error trends over time
- Mean time to resolution

### Key Metrics to Track

**North Star Metric:** Successful Generations per Active User

**Supporting Metrics:**
1. **Engagement:**
   - DAU/MAU ratio
   - Average session duration
   - Messages per session
   - Generations per user per week

2. **Quality:**
   - Generation success rate
   - Average generation completion time
   - Error rate
   - User retention (D1, D7, D30)

3. **Growth:**
   - New user signups (when auth is added)
   - Week-over-week growth
   - Viral coefficient (community shares)
   - Conversion rate (free → paid)

4. **Business:**
   - Revenue per user (when billing is added)
   - LTV:CAC ratio
   - Churn rate
   - Feature adoption rate

---

## Privacy & Compliance {#privacy-compliance}

### GDPR & Privacy Considerations

1. **User Consent:**
   - Add cookie consent banner
   - Provide opt-out mechanism
   - Document analytics in privacy policy

2. **Data Minimization:**
   - Don't track PII unnecessarily
   - Anonymize IP addresses
   - Set data retention limits (e.g., 365 days)

3. **User Rights:**
   - Provide data export capability
   - Allow users to request deletion
   - Transparency about tracking

### Sample Privacy Notice

```markdown
We use Amplitude Analytics to understand how users interact with our product.
This helps us improve the experience and develop new features.

Data collected includes:
- Page views and navigation patterns
- Feature usage (which models you use, generation parameters)
- Error events for reliability improvements
- Anonymous device identifiers

We DO NOT collect:
- Personal identifying information (until you create an account)
- Chat message content
- Generated content prompts (only prompt length)
- Payment information

You can opt out of analytics tracking in your account settings.
```

### Implementation

```typescript
// Check for user consent
const hasAnalyticsConsent = () => {
  return localStorage.getItem('analytics_consent') === 'true';
};

// Only initialize if consent is given
if (hasAnalyticsConsent()) {
  initAmplitude();
}
```

---

## Testing & Validation {#testing}

### 1. Development Environment Setup

```typescript
// .env.local
AMPLITUDE_API_KEY=YOUR_DEV_API_KEY

// .env.production
AMPLITUDE_API_KEY=YOUR_PROD_API_KEY
```

Use separate Amplitude projects for dev/staging/production.

### 2. Event Validation Checklist

Before deploying to production, verify:

- [ ] All events fire correctly in Amplitude debugger
- [ ] Event properties are correctly typed (string, number, boolean)
- [ ] User properties update as expected
- [ ] Session tracking works across page navigations
- [ ] Device ID persists across sessions
- [ ] No PII is being tracked
- [ ] Events fire on both success and error paths
- [ ] No duplicate events on re-renders

### 3. Testing in Amplitude

**Use Amplitude Debugger:**
1. Navigate to User Lookup → Debugger
2. Enter your device ID
3. Perform actions in your app
4. Verify events appear in real-time (within seconds)
5. Check event properties are correct

**Create Test Dashboards:**
1. Create a test user segment (your device ID)
2. Build mini-dashboards for each event type
3. Verify data flows correctly

### 4. Automated Testing

```typescript
// Mock Amplitude in tests
jest.mock('@/lib/analytics/amplitude', () => ({
  amplitude: {
    track: jest.fn(),
    identify: jest.fn(),
  },
  initAmplitude: jest.fn(),
}));

// Test event tracking
import { trackGenerationStarted } from '@/lib/analytics/events';
import { amplitude } from '@/lib/analytics/amplitude';

test('tracks generation started event', () => {
  trackGenerationStarted({
    generationType: 'text_to_image',
    modelName: 'nano-banana',
    // ... other props
  });

  expect(amplitude.track).toHaveBeenCalledWith(
    'Generation Started',
    expect.objectContaining({
      generation_type: 'text_to_image',
      model_name: 'nano-banana',
    })
  );
});
```

---

## Performance Considerations

### 1. Minimize Analytics Overhead

```typescript
// Batch events when possible
const eventQueue: any[] = [];

const flushEventQueue = () => {
  if (eventQueue.length === 0) return;

  eventQueue.forEach(event => {
    amplitude.track(event.name, event.properties);
  });

  eventQueue.length = 0;
};

// Flush every 5 seconds or on page unload
setInterval(flushEventQueue, 5000);
window.addEventListener('beforeunload', flushEventQueue);
```

### 2. Debounce High-Frequency Events

```typescript
import { debounce } from 'lodash';

// Don't track every keystroke in chat input
const trackChatInputChanged = debounce((length: number) => {
  amplitude.track('Chat Input Changed', { length });
}, 1000);
```

### 3. Lazy Load Amplitude

```typescript
// Only load Amplitude when user interacts
const loadAmplitude = async () => {
  const { initAmplitude } = await import('@/lib/analytics/amplitude');
  initAmplitude();
};

// Initialize on first user interaction
document.addEventListener('click', () => {
  loadAmplitude();
}, { once: true });
```

---

## Next Steps

1. **Set up Amplitude account:**
   - Create organization
   - Create projects (dev, staging, prod)
   - Obtain API keys

2. **Install dependencies:**
   ```bash
   npm install @amplitude/analytics-browser
   ```

3. **Implement Phase 1:**
   - Create analytics utilities
   - Initialize in layout
   - Add page view tracking
   - Test in Amplitude debugger

4. **Implement Phase 2:**
   - Add chat events
   - Add generation events
   - Add error tracking
   - Test event flow

5. **Create dashboards:**
   - Executive overview
   - Model performance
   - User funnel
   - Error monitoring

6. **Iterate and optimize:**
   - Review data weekly
   - Add new events as needed
   - Optimize based on insights
   - Share insights with team

---

## Resources

- [Amplitude Browser SDK Documentation](https://www.docs.developers.amplitude.com/data/sdks/browser-2/)
- [Amplitude Event Tracking Best Practices](https://help.amplitude.com/hc/en-us/articles/360047138392-Taxonomy-best-practices)
- [Next.js Analytics Integration Guide](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [GDPR Compliance for Analytics](https://help.amplitude.com/hc/en-us/articles/360050750131-GDPR-compliance)

---

**Document Version:** 1.0
**Last Updated:** 2025-10-19
**Author:** Implementation Guide for Higgsfield AI
**Status:** Ready for Implementation
