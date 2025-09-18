import { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-
import { ChatMessage } from '@/lib/types';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  };
  useEffect(() => {
  }, [messages, isLoa
 

          <div
            className={cn(

          >
              "max-w-[85%] p-4",
    

                <di
                    {
                  <span clas

          
                  'prose prose-sm max-w
                    ? 'prose-invert' 
                )}>
              
                        cons
                        co
                     
                            style={oneDark as any}
              
           
                          </Synt
                          <code 
                          </code>
                      },
                  >
               
              </div>
          </div>
        
          <div className="flex justify-start">
              <div classNa
                <span className="text-muted-foreground"
            </Card>
        )}
        <div ref={mess
    </ScrollArea
}


















































