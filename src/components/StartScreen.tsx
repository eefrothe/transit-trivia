import React from 'react';

type StartScreenProps = {
  onStart: () => void;
};

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-6 animate-fade-in">
      <div className="bg-slate-900 p-8 rounded-xl shadow-lg max-w-sm w-full text-center">
        <h1 className="text-3xl font-bold mb-6">Welcome to Transit Trivia</h1>
        <p className="mb-6 text-gray-400">Test your knowledge in a fast-paced quiz game!</p>
        <button
          onClick={onStart}
          className="bg-green-600 hover:bg-green-500 text-white py-3 px-6 rounded-lg transition"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
