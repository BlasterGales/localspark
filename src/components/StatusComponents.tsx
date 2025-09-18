import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Warning, WifiX, ArrowClockwise, CheckCircle } from '@phosphor-icons/react';
import { ollamaAPI } from '@/lib/ollama';

interface ConnectionStatusProps {
  isConnected: boolean;
  onRetry: () => void;
}

export function ConnectionStatus({ isConnected, onRetry }: ConnectionStatusProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  if (isConnected) {
    return null;
  }

  return (
    <Alert className="m-4">
      <WifiX className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <strong>Connection Lost</strong>
          <br />
          Cannot connect to Ollama. Make sure it's running on localhost:11434
        </div>
        <Button 
          onClick={handleRetry} 
          variant="outline" 
          size="sm"
          disabled={isRetrying}
        >
          <ArrowClockwise 
            className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} 
          />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
}

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <Card className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-muted-foreground">{message}</p>
      </Card>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <Card className="p-6 text-center max-w-md">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </Card>
    </div>
  );
}

export function HealthCheck() {
  const [status, setStatus] = useState<'checking' | 'healthy' | 'unhealthy'>('checking');
  const [details, setDetails] = useState<string>('');

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setStatus('checking');
    try {
      const isConnected = await ollamaAPI.checkConnection();
      if (isConnected) {
        setStatus('healthy');
        setDetails('Connected to Ollama successfully');
      } else {
        setStatus('unhealthy');
        setDetails('Cannot connect to Ollama on localhost:11434');
      }
    } catch (error) {
      setStatus('unhealthy');
      setDetails(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <Alert className={`m-4 ${status === 'healthy' ? 'border-green-500' : status === 'unhealthy' ? 'border-red-500' : ''}`}>
      {status === 'checking' && <ArrowClockwise className="h-4 w-4 animate-spin" />}
      {status === 'healthy' && <CheckCircle className="h-4 w-4 text-green-500" />}
      {status === 'unhealthy' && <Warning className="h-4 w-4 text-red-500" />}
      <AlertDescription className="flex items-center justify-between">
        <div>
          <strong>
            {status === 'checking' && 'Checking connection...'}
            {status === 'healthy' && 'Connection Healthy'}
            {status === 'unhealthy' && 'Connection Issues'}
          </strong>
          <br />
          {details}
        </div>
        {status !== 'checking' && (
          <Button onClick={checkHealth} variant="outline" size="sm">
            Check Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}