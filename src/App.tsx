import { useState, useCallback } from 'react';
import { useKV } from '@github/spark/hooks';
import { ChatInterface } from '@/components/ChatInterface';
import { MessageInput } from '@/components/MessageInput';
import { ModelSelector } from '@/components/ModelSelector';
import { ProjectFilesSidebar } from '@/components/ProjectFilesSidebar';
import { ChatMessage, ProjectFile } from '@/lib/types';
import { ollamaAPI } from '@/lib/ollama';
import { toast, Toaster } from 'sonner';

function App() {
  const [messages, setMessages] = useKV<ChatMessage[]>('chat-messages', []);
  const [projectFiles, setProjectFiles] = useKV<ProjectFile[]>('project-files', []);
  const [selectedModel, setSelectedModel] = useKV<string>('selected-model', '');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const buildContext = useCallback((files: ProjectFile[]) => {
    if (files.length === 0) return '';
    
    return files.map(file => 
      `--- ${file.name} ---\n${file.content}\n`
    ).join('\n');
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!selectedModel) {
      toast.error('Please select a model first');
      return;
    }

    if (!isConnected) {
      toast.error('Not connected to Ollama. Make sure Ollama is running.');
      return;
    }

    const currentMessages = messages || [];
    const currentFiles = projectFiles || [];

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
      model: selectedModel,
    };

    const newMessages = [...currentMessages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const context = buildContext(currentFiles);
      let assistantContent = '';
      
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        model: selectedModel,
      };

      const messagesWithAssistant = [...newMessages, assistantMessage];
      setMessages(messagesWithAssistant);

      const stream = ollamaAPI.streamChat(selectedModel, newMessages, context);
      
      for await (const chunk of stream) {
        assistantContent += chunk;
        
        // Update the assistant message content
        setMessages((currentMessages) => 
          (currentMessages || []).map(msg => 
            msg.id === assistantMessage.id 
              ? { ...msg, content: assistantContent }
              : msg
          )
        );
      }

      if (!assistantContent.trim()) {
        throw new Error('Empty response from model');
      }

    } catch (error) {
      console.error('Chat error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to get response');
      
      // Remove the failed assistant message
      setMessages(newMessages);
    } finally {
      setIsLoading(false);
    }
  }, [selectedModel, isConnected, messages, projectFiles, buildContext, setMessages]);

  const handleClearChat = () => {
    setMessages([]);
    toast.success('Chat cleared');
  };

  return (
    <div className="h-screen bg-background text-foreground flex">
      <ProjectFilesSidebar 
        files={projectFiles || []} 
        onFilesChange={setProjectFiles} 
      />
      
      <div className="flex-1 flex flex-col">
        <ModelSelector
          selectedModel={selectedModel || ''}
          onModelChange={setSelectedModel}
          isConnected={isConnected}
          onConnectionChange={setIsConnected}
        />
        
        <div className="flex-1 flex flex-col min-h-0">
          {(messages || []).length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <h2 className="text-2xl font-bold mb-4">Welcome to Ollama Spark</h2>
                <p className="text-muted-foreground mb-6">
                  Your local AI development assistant. Upload project files for context 
                  and start chatting with your local Ollama models.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Upload files to provide project context</p>
                  <p>• Select an Ollama model from the dropdown</p>
                  <p>• Ask questions about your code</p>
                  <p>• Get help with debugging and improvements</p>
                </div>
              </div>
            </div>
          ) : (
            <ChatInterface messages={messages || []} isLoading={isLoading} />
          )}
          
          <MessageInput 
            onSendMessage={handleSendMessage}
            disabled={!selectedModel || !isConnected || isLoading}
          />
        </div>
      </div>
      
      <Toaster position="top-right" />
    </div>
  );
}

export default App;