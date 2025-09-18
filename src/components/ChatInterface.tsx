import { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { oneDark } from 'react-syntax-high
interface ChatInterfaceProps {
  isLoading: boolean;

import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function ChatInterface({ messages, isLoading }: ChatInterfaceProps) {
  };

      <div classNam
          <div
            className={cn(
              message.role
          >
       
     
                <div classNa

                  <span className="text-xs opaci
                  </span>
                
                  'prose
       
    

          
                        return !isInline && match ? (
                            style={oneDark as any}
                            PreTag="
              
                          </
                          
                     
                      },
              
           
              </div>
          </div>
        
          <div 
              <div className="flex items-
                <span className="text-muted-foreground">AI is think
            </Card>
        )}
    </ScrollArea>
}









                )}>
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-md"
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