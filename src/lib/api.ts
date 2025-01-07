import { API_CONFIG } from '../config/constants';

interface GenerateStoryParams {
  prompt: string;
  retryCount?: number;
}

class APIClient {
  private static instance: APIClient;
  private retryDelay = 1000;
  private maxRetries = 3;

  private constructor() {}

  static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient();
    }
    return APIClient.instance;
  }

  async generateStory({ prompt, retryCount = 0 }: GenerateStoryParams): Promise<string> {
    try {
      const response = await fetch(API_CONFIG.GEMINI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      if (retryCount < this.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retryCount + 1)));
        return this.generateStory({ prompt, retryCount: retryCount + 1 });
      }
      throw error;
    }
  }
}

export const apiClient = APIClient.getInstance();