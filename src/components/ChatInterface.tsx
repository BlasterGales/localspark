import { ChatMessage } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
interface ChatInterfaceProps {
  isLoading: boolean;

import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function ChatInterface({ messages, isLoading }: ChatInterfaceProps) {
          
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
              
            key={message.id}
            <Card classNam
              'flex gap-3',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-accent text-accent-foreground">
                <Robot size={16} />
                    
            )}
            
                        );
                    }}
                    {message.content}
                </div>
              
               
                  <Badge variant="secondar
                  </Badge>
              </div
            
              <div className="fl
              </div>
          </div>
        
          <div className="flex gap-3 justify-sta
              <Robot siz
            <Card className="p-4 bg-car
                <div className="an
                  <div className="h-2 w-2 bg-accent rounded-full animate-bounce"></div>
                  <div className="h-2 w-
              </div>
          </div>
      </div>
  );







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