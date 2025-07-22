import React from "react";

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white dark:bg-slate-900 dark:text-white p-6 animate-fade-in">
      <div className="bg-slate-900 dark:bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center transition-transform duration-300 ease-in-out transform hover:scale-[1.02]">
        <h1 className="text-4xl font-extrabold mb-6 tracking-tight">Welcome to Transit Trivia</h1>
        <p className="mb-6 text-gray-400 dark:text-gray-300 text-base leading-relaxed">
          Test your knowledge in a fast-paced quiz game!
        </p>
        <button
          onClick={onStart}
          className="bg-green-600 hover:bg-green-500 focus:ring-4 focus:ring-green-300 focus:outline-none text-white py-3 px-6 rounded-xl font-medium shadow transition duration-200 ease-in-out transform hover:scale-105 active:scale-95"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
