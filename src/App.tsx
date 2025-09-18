import { useState, useCallback } from 'react';
import { useKV } from '@github/spark/hooks';
import { ChatInterface } from '@/components/ChatInterface';
import { MessageInput } from '@/components/MessageInput';
import { ModelSelector } from '@/components/ModelSelector';
import { ProjectFilesSidebar } from '@/components/ProjectFilesSidebar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ChatMessage, ProjectFile } from '@/lib/types';
import { toast, Toaster } from 'sonner';
import { FileText, Play, Check } from '@phosphor-icons/react';

function App() {
  const [messages, setMessages] = useKV<ChatMessage[]>('chat-messages', []);
  const [projectFiles, setProjectFiles] = useKV<ProjectFile[]>('project-files', []);
  const [selectedModel, setSelectedModel] = useKV<string>('selected-model', '');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const buildContext = useCallback((files: ProjectFile[]) => {
    if (files.length === 0) return '';
    return files.map(file => `--- ${file.name} ---\n${file.content}\n`).join('\n');
  }, []);

  const inferContextFiles = useCallback((content: string): string[] => {
    // Inferir archivos del mensaje (regex simple)
    const fileMatch = content.match(/[\w\/.-]+(\.(ts|tsx|js|jsx|css|json|py|md))/g) || [];
    return fileMatch;
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!selectedModel?.trim()) {
      toast.error('Please select a model first');
      return;
    }
    if (!isConnected) {
      toast.error('Not connected to Ollama. Make sure Ollama is running.');
      return;
    }
    if (!content?.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const currentMessages = messages || [];
    const currentFiles = projectFiles || [];
    const contextFiles = inferContextFiles(content); // Inferir files

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
      model: selectedModel,
    };

    const newMessages = [...currentMessages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content.trim(), model: selectedModel, contextFiles })
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        model: selectedModel,
        metadata: { hasCodeBlock: data.hasCodeBlock, suggestedAction: data.suggestedAction } // Agrega metadata para actions
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      let errorMessage = 'Failed to get response from AI';
      if (error instanceof Error) errorMessage = error.message;
      toast.error(errorMessage);
      setMessages(newMessages);
    } finally {
      setIsLoading(false);
    }
  }, [selectedModel, isConnected, messages, projectFiles, inferContextFiles, setMessages]);

  const applyFix = useCallback(async (msg: ChatMessage, filePath?: string) => {
    if (!msg.metadata?.hasCodeBlock) return;
    const codeMatch = msg.content.match(/```[\w]*\n([\s\S]*?)\n```/);
    if (!codeMatch) return;
    const code = codeMatch[1];
    const targetFile = filePath || 'src/App.tsx'; // Default o usa inferido
    try {
      const res = await fetch(`/api/files/write/${targetFile}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: code })
      });
      if (res.ok) {
        toast.success('¡Fix aplicado!');
        // Actualiza projectFiles si está en KV
        setProjectFiles(prev => prev?.map(f => f.name === targetFile ? { ...f, content: code } : f) || []);
      } else throw new Error('Write failed');
    } catch (err) {
      toast.error(`Error aplicando: ${(err as Error).message}`);
    }
  }, [setProjectFiles]);

  const runCommand = useCallback(async (command: string = 'npm test') => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      const data = await res.json();
      const sysMsg: ChatMessage = {
        id: `system-${Date.now()}`,
        role: 'system',
        content: `Output de "${command}":\n${data.output}\nError: ${data.error}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...(prev || []), sysMsg]);
      toast.success('Comando ejecutado');
    } catch (err) {
      toast.error(`Error ejecutando: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  }, [setMessages]);

  const listFiles = useCallback(async (dir: string = '.') => {
    try {
      const res = await fetch(`/api/files/list/${dir}`);
      const data = await res.json();
      const sysMsg: ChatMessage = {
        id: `system-${Date.now()}`,
        role: 'system',
        content: `Archivos en ${dir}: ${JSON.stringify(data, null, 2)}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...(prev || []), sysMsg]);
    } catch (err) {
      toast.error(`Error listando: ${(err as Error).message}`);
    }
  }, [setMessages]);

  const handleClearChat = () => {
    setMessages([]);
    toast.success('Chat cleared');
  };

  return (
    <ErrorBoundary>
      <div className="h-screen bg-background text-foreground flex">
        <ErrorBoundary>
          <ProjectFilesSidebar 
            files={projectFiles || []} 
            onFilesChange={setProjectFiles} 
          />
        </ErrorBoundary>
        
        <div className="flex-1 flex flex-col">
          <ErrorBoundary>
            <ModelSelector
              selectedModel={selectedModel || ''}
              onModelChange={setSelectedModel}
              isConnected={isConnected}
              onConnectionChange={setIsConnected}
            />
          </ErrorBoundary>
          
          <div className="flex flex-col min-h-0 p-4 space-y-2"> {/* Agrega botones para actions */}
            <div className="flex space-x-2">
              <button onClick={() => listFiles()} className="px-3 py-1 bg-blue-500 text-white rounded text-sm"><FileText size={14} /> Listar Archivos</button>
              <button onClick={() => runCommand('npm test')} className="px-3 py-1 bg-green-500 text-white rounded text-sm"><Play size={14} /> Run Test</button>
              <button onClick={() => runCommand('npm run build')} className="px-3 py-1 bg-purple-500 text-white rounded text-sm"><Play size={14} /> Build</button>
              <button onClick={handleClearChat} className="px-3 py-1 bg-gray-500 text-white rounded text-sm">Clear Chat</button>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              {(messages || []).length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold mb-4">Welcome to LocalSpark</h2>
                    <p className="text-muted-foreground mb-6">
                      AI local como GitHub Spark: construye, testa, arregla auto.
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Usa sidebar para files</p>
                      <p>• Pregunta: "Arregla App.tsx" → botón Apply</p>
                      <p>• Ejecuta tests/builds con botones</p>
                    </div>
                  </div>
                </div>
              ) : (
                <ErrorBoundary>
                  <ChatInterface 
                    messages={messages || []} 
                    isLoading={isLoading}
                    onApplyFix={applyFix} // Pasa callback para botón en ChatInterface (ajusta component si no lo tiene)
                  />
                </ErrorBoundary>
              )}
            </div>
            
            <ErrorBoundary>
              <MessageInput 
                onSendMessage={handleSendMessage}
                disabled={!selectedModel || !isConnected || isLoading}
              />
            </ErrorBoundary>
          </div>
        </div>
        
        <Toaster position="top-right" />
      </div>
    </ErrorBoundary>
  );
}

export default App;