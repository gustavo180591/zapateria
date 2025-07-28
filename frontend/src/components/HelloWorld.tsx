import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HelloWorld: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Using the standalone server we created earlier
    axios.get('http://localhost:3001/api/hello')
      .then(res => setMessage(res.data.message))
      .catch(() => setError('No se pudo conectar al servidor'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error)   return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 m-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">¡Bienvenido a Zapatería!</h2>
      <p>{message}</p>
    </div>
  );
};

export default HelloWorld;
