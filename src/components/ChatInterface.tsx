import { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '@/lib/types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check } from 'lucide-react'; // Agregado para botón Apply
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onApplyFix?: (msg: ChatMessage, filePath?: string) => void; // Nuevo: callback para aplicar fixes
}

export function ChatInterface({ messages, isLoading, onApplyFix }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4 max-w-4xl mx-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <Card className={cn(
              "max-w-[85%] p-4",
              message.role === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-card'
            )}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={message.role === 'user' ? 'secondary' : 'default'}>
                    {message.role === 'user' ? 'You' : message.role === 'system' ? 'System' : 'Assistant'}
                  </Badge>
                  {message.model && (
                    <span className="text-xs text-muted-foreground">
                      {message.model}
                    </span>
                  )}
                </div>
                
                <div className={cn(
                  'prose prose-sm max-w-none',
                  message.role === 'user' 
                    ? 'prose-invert' 
                    : 'prose-slate dark:prose-invert'
                )}>
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>

                {/* Nuevo: Botón Apply Fix si hay metadata */}
                {message.metadata?.suggestedAction === 'apply_fix' && onApplyFix && (
                  <div className="mt-2 flex justify-end">
                    <Button 
                      onClick={() => onApplyFix(message)} 
                      size="sm" 
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Check size={16} /> Apply Fix
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <Card className="max-w-[85%] p-4 bg-card">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
                <span className="text-muted-foreground text-sm">Assistant is typing...</span>
              </div>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}