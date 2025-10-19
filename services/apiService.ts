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
}

export const apiService = new ApiService();