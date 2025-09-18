import { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
  messages: ChatMessage[];
}

    <div className="flex-1 ove
  messages: ChatMessage[];
  isLoading: boolean;
}

export function ChatInterface({ messages, isLoading }: ChatInterfaceProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
            
          key={message.id}
          className={cn(
            'flex',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          )}
        >
          <Card className={cn(
                        <Synta
            message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'
          )}>
            <div className="space-y-2">
                          {String(children
                <div className="whitespace-pre-wrap">{message.content}</div>
                   
                <ReactMarkdown
        <div className="flex ju
            <div className="flex items-center space-x-2">
            </div>
        </div>
    </div>
}







































