// src/components/ui/ErrorCard.tsx
import React from 'react';

interface ErrorCardProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ 
  message, 
  onRetry,
  className = '' 
}) => (
  <div className={`bg-red-50 border border-red-200 rounded-xl p-4 ${className}`}>
    <div className="flex items-center space-x-2 text-red-600">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 className="text-xl font-bold">¡Ups! Algo salió mal</h2>
    </div>
    <p className="mt-2 text-red-600">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Reintentar
      </button>
    )}
  </div>
);