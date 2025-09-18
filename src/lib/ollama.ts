import { OllamaModel, OllamaResponse, ChatMessage } from './types';

const OLLAMA_BASE_URL = 'http://localhost:11434';

export class OllamaAPI {
  private baseUrl: string;

  constructor(baseUrl: string = OLLAMA_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getModels(): Promise<OllamaModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('Failed to fetch models:', error);
      throw new Error('Failed to connect to Ollama. Make sure Ollama is running on localhost:11434');
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch {
      return false;
    }
  }

  async *streamChat(
    model: string,
    messages: ChatMessage[],
    context?: string
  ): AsyncGenerator<string, void, unknown> {
    const prompt = this.buildPrompt(messages, context);
    
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data: OllamaResponse = JSON.parse(line);
              if (data.response) {
                yield data.response;
              }
              if (data.done) {
                return;
              }
            } catch (e) {
              console.error('Failed to parse JSON:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat stream error:', error);
      throw new Error('Failed to get response from Ollama');
    }
  }

  private buildPrompt(messages: ChatMessage[], context?: string): string {
    let prompt = '';
    
    if (context) {
      prompt += `Context: The user has provided the following project files for reference:\n${context}\n\n`;
    }
    
    prompt += 'Conversation:\n';
    for (const message of messages) {
      prompt += `${message.role === 'user' ? 'Human' : 'Assistant'}: ${message.content}\n`;
    }
    
    prompt += 'Assistant:';
    return prompt;
  }
}

export const ollamaAPI = new OllamaAPI();