import { ChatMessage } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function ChatInterface({ messages, isLoading }: ChatInterfaceProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'flex',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          )}
        >
          <Card className={cn(
            'p-4 max-w-[80%]',
            message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'
          )}>
            <div className="space-y-2">
              {message.role === 'user' ? (
                <div className="whitespace-pre-wrap">{message.content}</div>
              ) : (
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={oneDark as any}
                          language={match[1]}
                          PreTag="div"
                          {...props}
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
              )}
              <div className="text-xs text-muted-foreground opacity-60">
                {message.timestamp.toLocaleTimeString()} • {message.model}
              </div>
            </div>
          </Card>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <Card className="p-4 max-w-[80%] bg-card">
            <div className="flex items-center space-x-2">
              <div className="animate-pulse">Thinking...</div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}