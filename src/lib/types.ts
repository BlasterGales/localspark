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
  role: 'user' | 'assistant' | 'system'; // Agrego 'system' para mensajes de comandos
  content: string;
  timestamp: Date;
  model?: string;
  metadata?: { // Nuevo: para acciones inteligentes
    hasCodeBlock?: boolean;
    suggestedAction?: string;
  };
}

export interface ProjectFile {
  id: string;
  name: string;
  content: string;
  type: string;
  size: number;
  lastModified: Date;
  path?: string; // Nuevo: para paths completos en FS ops
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
  error?: string;
}

export interface AppState {
  selectedModel: string;
  messages: ChatMessage[];
  projectFiles: ProjectFile[];
  isConnected: boolean;
  isLoading: boolean;
}