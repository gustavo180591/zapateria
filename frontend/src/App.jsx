import React from 'react';
import HelloWorld from './components/HelloWorld';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center my-8">Zapatería</h1>
        <HelloWorld />
      </main>
    </div>
  );
}

export default App;