import { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { oneDark } from 'react-syntax-highligh
interface ChatInterfaceProps {
  isLoading: boolean;


      {messages.map((message) 
          key={message.id}
            'flex',
 

            message.role === 'user' ? 'bg-primary text-primary-foreground' :
          
                <Badge variant={message.role === 'user' ? 
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
                </ReactM
            </div>
        </div>
      
        <div classNa
            <d
              <span className="text-muted-
          </Card>
      )}
  );






















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
              <span className="text-muted-foreground">AI is thinking...</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}