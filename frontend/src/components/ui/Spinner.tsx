// src/components/ui/Spinner.tsx
import React from 'react';

interface SpinnerProps {
  text?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  text = 'Cargando...',
  className = '' 
}) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
    <span className="text-gray-600">{text}</span>
  </div>
);