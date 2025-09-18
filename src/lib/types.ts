export interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
  modified_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  content: string;
  type: string;
  size: number;
  lastModified: Date;
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  message?: {
    role: string;
    content: string;
  };
  response?: string;
  done: boolean;
}

export interface AppState {
  selectedModel: string;
  messages: ChatMessage[];
  projectFiles: ProjectFile[];
  isConnected: boolean;
  isLoading: boolean;
}