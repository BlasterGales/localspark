import { ChatMessage } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { oneDark } from 'react-sy
interface ChatInterfaceProps {
  isLoading: boolean;

  return (

          <div
            className={cn(
              message
 

              </div>
          
              'p-4 max-w-[80%]',
            )}>
                {message.role === 'u
              
                    componen
                        co
                        ret
                            style={oneDark as any}
              
           
                        ) : (
                            {children}
                        );
                    
              
            
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
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={oneDark}
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









































