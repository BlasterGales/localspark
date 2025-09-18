import { useState, useCallback } from 'react';
import { useKV } from '@github/spark/hooks';
import { ChatInterface } from '@/components/ChatInterface';
import { MessageInput } from '@/components/MessageInput';
import { ModelSelector } from '@/components/ModelSelector';
import { ProjectFilesSidebar } from '@/components/ProjectFilesSidebar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
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
      const context = buildContext(currentFiles);
      let assistantContent = '';
      let hasContent = false;
      
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
      
      try {
        for await (const chunk of stream) {
          if (chunk?.trim()) {
            assistantContent += chunk;
            hasContent = true;
            
            // Update the assistant message content
            setMessages((currentMessages) => 
              (currentMessages || []).map(msg => 
                msg.id === assistantMessage.id 
                  ? { ...msg, content: assistantContent }
                  : msg
              )
            );
          }
        }
      } catch (streamError) {
        console.error('Stream processing error:', streamError);
        throw streamError;
      }

      if (!hasContent) {
        throw new Error('No response received from the model. It might be loading or unavailable.');
      }

    } catch (error) {
      console.error('Chat error:', error);
      
      let errorMessage = 'Failed to get response from AI';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      
      // Remove the failed assistant message if it was added
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
              <ErrorBoundary>
                <ChatInterface messages={messages || []} isLoading={isLoading} />
              </ErrorBoundary>
            )}
            
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