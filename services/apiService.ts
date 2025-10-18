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

  async getJobStatus(jobSetId: string) {
    const response = await fetch(`${API_BASE_URL}/v1/jobs/${jobSetId}`);
    if (!response.ok) {
      throw new Error('API request failed');
    }
    return response.json();
  }
}

export const apiService = new ApiService();