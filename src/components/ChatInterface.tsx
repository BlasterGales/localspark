import { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/lib/types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function ChatInterface({ messages, isLoading }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
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
                    {message.role === 'user' ? 'You' : 'AI'}
                  </Badge>
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
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
                      code(props) {
                        const { children, className, node, ...rest } = props;
                        const match = /language-(\w+)/.exec(className || '');
                        const inline = !match;
                        
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={oneDark as any}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-md"
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...rest}>
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
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}