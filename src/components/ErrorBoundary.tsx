import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react'; // Cambiado a lucide para consistencia con Shadcn
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary: () => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LocalSpark ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent 
          error={this.state.error} 
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}

export function DefaultErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full p-6 text-center">
        <AlertTriangle size={48} className="mx-auto mb-4 text-destructive" />
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-4">
          The LocalSpark application encountered an unexpected error. Your project data is safe.
        </p>
        {error && (
          <details className="mb-4 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              Technical details
            </summary>
            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
              {error.message}
              {error.stack && `\n\nStack:\n${error.stack}`}
            </pre>
          </details>
        )}
        <Button onClick={resetErrorBoundary} className="w-full">
          <RefreshCw size={16} className="mr-2" />
          Try again
        </Button>
      </Card>
    </div>
  );
}

// Hook for graceful error handling in functional components (mejorado con toast si sonner está disponible)
export function useErrorHandler() {
  return (error: Error, errorInfo?: string) => {
    console.error('LocalSpark Application error:', error, errorInfo);
    // Opcional: integra con toast si lo usas en App.tsx
    // toast.error('An error occurred: ' + error.message);
  };
}