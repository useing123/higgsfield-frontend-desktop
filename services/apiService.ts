// services/apiService.ts
import { Message } from '@/lib/types';
import { trackAPIError } from '@/lib/analytics/events';

const API_BASE_URL = 'https://higgsfield-ai-chat-x2va5d5h7a-uc.a.run.app';

class ApiService {
  async sendChatMessage(message: string, conversation_history: Message[]) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversation_history }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        trackAPIError({
          endpoint: '/v1/chat',
          errorMessage: errorText || 'API request failed',
          errorCode: response.status,
          requestMethod: 'POST',
        });
        throw new Error('API request failed');
      }
      return response.json();
    } catch (error) {
      if (error instanceof Error && !error.message.includes('API request failed')) {
        trackAPIError({
          endpoint: '/v1/chat',
          errorMessage: error.message,
          requestMethod: 'POST',
        });
      }
      throw error;
    }
  }

  async *sendChatMessageStream(
    message: string,
    conversation_history: Message[]
  ): AsyncGenerator<string, void, unknown> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversation_history }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        trackAPIError({
          endpoint: '/v1/chat/stream',
          errorMessage: errorText || 'API request failed',
          errorCode: response.status,
          requestMethod: 'POST',
        });
        throw new Error('API request failed');
      }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter((line) => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            try {
              const parsed = JSON.parse(data);
              if (parsed.delta) {
                yield parsed.delta;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
    } catch (error) {
      if (error instanceof Error && !error.message.includes('API request failed')) {
        trackAPIError({
          endpoint: '/v1/chat/stream',
          errorMessage: error.message,
          requestMethod: 'POST',
        });
      }
      throw error;
    }
  }

  async getJobStatus(jobSetId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/jobs/${jobSetId}`);
      if (!response.ok) {
        const errorText = await response.text();
        trackAPIError({
          endpoint: `/v1/jobs/${jobSetId}`,
          errorMessage: errorText || 'API request failed',
          errorCode: response.status,
          requestMethod: 'GET',
        });
        throw new Error('API request failed');
      }
      return response.json();
    } catch (error) {
      if (error instanceof Error && !error.message.includes('API request failed')) {
        trackAPIError({
          endpoint: `/v1/jobs/${jobSetId}`,
          errorMessage: error.message,
          requestMethod: 'GET',
        });
      }
      throw error;
    }
  }

  // Text-to-Image generation
  async generateTextToImage(model: string, params: {
    prompt: string;
    aspect_ratio?: string;
    batch_size?: number;
    negative_prompt?: string;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/t2i/${model}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        const errorText = await response.text();
        trackAPIError({
          endpoint: `/v1/t2i/${model}`,
          errorMessage: errorText || 'Text-to-Image generation failed',
          errorCode: response.status,
          requestMethod: 'POST',
        });
        throw new Error('Text-to-Image generation failed');
      }
      return response.json();
    } catch (error) {
      if (error instanceof Error && !error.message.includes('generation failed')) {
        trackAPIError({
          endpoint: `/v1/t2i/${model}`,
          errorMessage: error.message,
          requestMethod: 'POST',
        });
      }
      throw error;
    }
  }

  // Text-to-Video generation
  async generateTextToVideo(model: string, params: {
    prompt: string;
    aspect_ratio?: string;
    duration?: number;
    resolution?: string;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/t2v/${model}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        const errorText = await response.text();
        trackAPIError({
          endpoint: `/v1/t2v/${model}`,
          errorMessage: errorText || 'Text-to-Video generation failed',
          errorCode: response.status,
          requestMethod: 'POST',
        });
        throw new Error('Text-to-Video generation failed');
      }
      return response.json();
    } catch (error) {
      if (error instanceof Error && !error.message.includes('generation failed')) {
        trackAPIError({
          endpoint: `/v1/t2v/${model}`,
          errorMessage: error.message,
          requestMethod: 'POST',
        });
      }
      throw error;
    }
  }

  // Image-to-Video generation
  async generateImageToVideo(model: string, params: {
    input_images: Array<{ type: string; image_url: string }>;
    prompt: string;
    aspect_ratio?: string;
    camera_control?: string;
    duration_sec?: number;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/i2v/${model}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        const errorText = await response.text();
        trackAPIError({
          endpoint: `/v1/i2v/${model}`,
          errorMessage: errorText || 'Image-to-Video generation failed',
          errorCode: response.status,
          requestMethod: 'POST',
        });
        throw new Error('Image-to-Video generation failed');
      }
      return response.json();
    } catch (error) {
      if (error instanceof Error && !error.message.includes('generation failed')) {
        trackAPIError({
          endpoint: `/v1/i2v/${model}`,
          errorMessage: error.message,
          requestMethod: 'POST',
        });
      }
      throw error;
    }
  }
}

export const apiService = new ApiService();