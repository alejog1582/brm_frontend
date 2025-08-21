import React from 'react';
import Spinner from './spinner';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isLoading, 
  message = 'Cargando...',
  className 
}) => {
  if (!isLoading) return null;

  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm',
      className
    )}>
      <div className="flex flex-col items-center gap-4 p-6 bg-card border border-border rounded-lg shadow-lg">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;