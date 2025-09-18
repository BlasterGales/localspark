import { OllamaModel, OllamaResponse, ChatMessage } from './types';

const OLLAMA_BASE_URL = 'http://localhost:11434';

export class OllamaAPI {
  private baseUrl: string;
  private connectionCheckInterval: NodeJS.Timeout | null = null;

  constructor(baseUrl: string = OLLAMA_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getModels(): Promise<OllamaModel[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data || !Array.isArray(data.models)) {
        console.warn('Unexpected response format from Ollama:', data);
        return [];
      }
      
      return data.models;
    } catch (error) {
      console.error('Failed to fetch models:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Connection timeout. Make sure Ollama is running and accessible.');
        }
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Cannot connect to Ollama. Ensure it\'s running on localhost:11434');
        }
      }
      
      throw new Error('Failed to get models from Ollama. Check your connection.');
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: controller.signal,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.warn('Connection check failed:', error);
      return false;
    }
  }

  startConnectionMonitoring(onConnectionChange: (connected: boolean) => void) {
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
    }

    this.connectionCheckInterval = setInterval(async () => {
      const connected = await this.checkConnection();
      onConnectionChange(connected);
    }, 30000); // Check every 30 seconds
  }

  stopConnectionMonitoring() {
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
      this.connectionCheckInterval = null;
    }
  }

  async *streamChat(
    model: string,
    messages: ChatMessage[],
    context?: string
  ): AsyncGenerator<string, void, unknown> {
    const prompt = this.buildPrompt(messages, context);
    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt,
          stream: true,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            top_k: 40,
          }
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Server error ${response.status}: ${errorText}`);
      }

      if (!response.body) {
        throw new Error('No response body received from Ollama');
      }

      reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let hasReceivedData = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        hasReceivedData = true;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data: OllamaResponse = JSON.parse(line);
              
              if (data.error) {
                throw new Error(`Ollama error: ${data.error}`);
              }
              
              if (data.response) {
                yield data.response;
              }
              
              if (data.done) {
                return;
              }
            } catch (parseError) {
              console.error('Failed to parse JSON line:', line, parseError);
              // Continue processing other lines instead of failing completely
            }
          }
        }
      }

      if (!hasReceivedData) {
        throw new Error('No data received from Ollama. The model might be loading.');
      }

    } catch (error) {
      console.error('Chat stream error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. The model might be too slow or overloaded.');
        }
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Connection lost to Ollama. Please check if it\'s still running.');
        }
        throw error;
      }
      
      throw new Error('An unexpected error occurred while communicating with Ollama');
    } finally {
      if (reader) {
        try {
          reader.releaseLock();
        } catch (e) {
          console.warn('Failed to release reader lock:', e);
        }
      }
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