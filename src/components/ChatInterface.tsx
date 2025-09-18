import { ChatMessage } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { User, Robot } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function ChatInterface({ messages, isLoading }: ChatInterfaceProps) {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-accent text-accent-foreground">
                <Robot size={16} />
              </div>
            )}
            
            <Card className={cn(
              'max-w-[80%] p-4',
              message.role === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-card'
            )}>
              {message.role === 'user' ? (
                <p className="text-sm">{message.content}</p>
              ) : (
                <div className="prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      code: ({ className, children }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match;
                        
                        if (isInline) {
                          return (
                            <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
                              {children}
                            </code>
                          );
                        }
                        
                        return (
                          <SyntaxHighlighter
                            language={match[1]}
                            PreTag="div"
                            className="rounded-md"
                            customStyle={{ background: 'transparent' }}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
              
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                {message.model && (
                  <Badge variant="secondary" className="text-xs">
                    {message.model}
                  </Badge>
                )}
              </div>
            </Card>
            
            {message.role === 'user' && (
              <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-primary text-primary-foreground">
                <User size={16} />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Robot size={16} />
            </div>
            <Card className="p-4 bg-card">
              <div className="flex items-center gap-2">
                <div className="animate-pulse">Thinking...</div>
                <div className="flex gap-1">
                  <div className="h-2 w-2 bg-accent rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="h-2 w-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}