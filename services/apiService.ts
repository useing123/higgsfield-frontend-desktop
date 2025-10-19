// services/apiService.ts
import { Message } from '@/lib/types';

const API_BASE_URL = 'https://higgsfield-ai-chat-x2va5d5h7a-uc.a.run.app';

class ApiService {
  async sendChatMessage(message: string, conversation_history: Message[]) {
    const response = await fetch(`${API_BASE_URL}/v1/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversation_history }),
    });
    if (!response.ok) {
      throw new Error('API request failed');
    }
    return response.json();
  }

  async *sendChatMessageStream(
    message: string,
    conversation_history: Message[]
  ): AsyncGenerator<string, void, unknown> {
    const response = await fetch(`${API_BASE_URL}/v1/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversation_history }),
    });

    if (!response.ok) {
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
  }

  async getJobStatus(jobSetId: string) {
    const response = await fetch(`${API_BASE_URL}/v1/jobs/${jobSetId}`);
    if (!response.ok) {
      throw new Error('API request failed');
    }
    return response.json();
  }

  // Text-to-Image generation
  async generateTextToImage(model: string, params: {
    prompt: string;
    aspect_ratio?: string;
    batch_size?: number;
    negative_prompt?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/v1/t2i/${model}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      throw new Error('Text-to-Image generation failed');
    }
    return response.json();
  }

  // Text-to-Video generation
  async generateTextToVideo(model: string, params: {
    prompt: string;
    aspect_ratio?: string;
    duration?: number;
    resolution?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/v1/t2v/${model}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      throw new Error('Text-to-Video generation failed');
    }
    return response.json();
  }

  // Image-to-Video generation
  async generateImageToVideo(model: string, params: {
    input_images: Array<{ type: string; image_url: string }>;
    prompt: string;
    aspect_ratio?: string;
    camera_control?: string;
    duration_sec?: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/v1/i2v/${model}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      throw new Error('Image-to-Video generation failed');
    }
    return response.json();
  }
}

export const apiService = new ApiService();