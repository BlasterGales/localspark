import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowClockwise, CheckCircle, XCircle } from '@phosphor-icons/react';
import { OllamaModel } from '@/lib/types';
import { ollamaAPI } from '@/lib/ollama';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  isConnected: boolean;
  onConnectionChange: (connected: boolean) => void;
}

export function ModelSelector({ 
  selectedModel, 
  onModelChange, 
  isConnected, 
  onConnectionChange 
}: ModelSelectorProps) {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [loading, setLoading] = useState(false);

  const loadModels = async () => {
    setLoading(true);
    try {
      const fetchedModels = await ollamaAPI.getModels();
      setModels(fetchedModels);
      onConnectionChange(true);
      
      // Auto-select first model if none selected
      if (!selectedModel && fetchedModels.length > 0) {
        onModelChange(fetchedModels[0].name);
      }
    } catch (error) {
      console.error('Failed to load models:', error);
      onConnectionChange(false);
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  // Nuevo: Verifica conexión al backend (opcional, para full stack)
  const checkBackend = async () => {
    try {
      const res = await fetch('/api/health', { method: 'GET' }); // Asume ruta simple en server.js
      if (!res.ok) throw new Error('Backend down');
    } catch (err) {
      console.warn('Backend connection issue:', err);
      // No cambia isConnected, ya que es Ollama-focused
    }
  };

  useEffect(() => {
    loadModels();
    checkBackend();
    
    // Start connection monitoring
    ollamaAPI.startConnectionMonitoring(onConnectionChange);
    
    // Cleanup
    return () => {
      ollamaAPI.stopConnectionMonitoring();
    };
  }, [onConnectionChange]);

  const formatModelSize = (size: number) => {
    const gb = size / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)}GB`;
  };

  return (
    <div className="flex items-center gap-2 p-4 border-b">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {isConnected ? (
            <CheckCircle size={16} className="text-accent" />
          ) : (
            <XCircle size={16} className="text-destructive" />
          )}
          <span className="text-sm font-medium">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={loadModels}
          disabled={loading}
          className="h-6 w-6 p-0"
        >
          <ArrowClockwise 
            size={12} 
            className={loading ? 'animate-spin' : ''} 
          />
        </Button>
      </div>

      <div className="flex-1" />

      {isConnected && models.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Model:</span>
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.name} value={model.name}>
                  <div className="flex items-center gap-2">
                    <span>{model.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {formatModelSize(model.size)}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}