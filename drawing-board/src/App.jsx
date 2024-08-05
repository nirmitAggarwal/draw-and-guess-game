import React from 'react';
import Canvas from './components/canvas';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-8">Drawing Board</h1>
      <Canvas />
    </div>
  );
};

export default App;
