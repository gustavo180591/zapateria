// src/components/HelloWorld.tsx
import React from 'react';
import { useHello } from '../hooks/useHello';
import { Spinner } from './ui/Spinner';
import { ErrorCard } from './ui/ErrorCard';

export const HelloWorld: React.FC = () => {
  const { 
    data: message, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useHello();

  if (isLoading) return <Spinner text="Conectando..." className="justify-center p-6" />;
  if (isError) return <ErrorCard message={error?.message || 'Error al cargar el mensaje'} onRetry={refetch} />;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-blue-600 p-4 text-white">
        <h2 className="text-xl font-bold">¡Bienvenido a Zapatería!</h2>
      </div>
      <div className="p-4">
        <p className="text-gray-700">{message}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Última actualización: {new Date().toLocaleTimeString()}
          </span>
          <button
            onClick={() => refetch()}
            className="text-xs text-blue-600 hover:text-blue-800"
            title="Actualizar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelloWorld;