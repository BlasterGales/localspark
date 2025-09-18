import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function ChatInterface({ messages, isLoading }: ChatInterfaceProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
      <div className="space-y-4 max-w-4xl mx-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <Card className={cn(
              'max-w-[85%] p-4',
              message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'
            )}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={message.role === 'user' ? 'secondary' : 'outline'}>
                    {message.role === 'user' ? 'You' : message.model}
                  </Badge>
                  <span className="text-xs opacity-70">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
                
                <div className={cn(
                  'prose prose-sm max-w-none',
                  message.role === 'user' 
                    ? 'prose-invert' 
                    : 'prose-slate dark:prose-invert'
                )}>
                  <ReactMarkdown
                    components={{
                      code({ node, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !props || typeof props.inline === 'undefined' ? false : props.inline;
                        return !isInline && match ? (
                          <SyntaxHighlighter
                            style={oneDark as any}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-md"
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            </Card>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <Card className="max-w-[85%] p-4 bg-card">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
                <span className="text-muted-foreground">AI is thinking...</span>
              </div>
            </Card>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}