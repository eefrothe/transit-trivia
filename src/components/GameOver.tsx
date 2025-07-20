import React from 'react';

type GameOverProps = {
  score: number;
  total: number;
  onRestart: () => void;
};

const GameOver: React.FC<GameOverProps> = ({ score, total, onRestart }) => {
  return (
    <div className="text-center animate-fade-in mt-20">
      <h2 className="text-3xl font-bold mb-4">🎉 Game Over!</h2>
      <p className="text-gray-300 text-lg mb-6">
        You scored <strong>{score}</strong> out of <strong>{total}</strong>
      </p>
      <button
        onClick={onRestart}
        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition"
      >
        Play Again
      </button>
    </div>
  );
};

export default GameOver;
