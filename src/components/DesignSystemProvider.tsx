import React from 'react';
import { useDesignSystemPreview } from '@/hooks/useThemeProvider';

interface DesignSystemProviderProps {
  children: React.ReactNode;
  className?: string;
}

export const DesignSystemProvider: React.FC<DesignSystemProviderProps> = ({ 
  children, 
  className = "" 
}) => {
  useDesignSystemPreview();
  
  return (
    <div className={`design-system-preview ${className}`}>
      {children}
    </div>
  );
};