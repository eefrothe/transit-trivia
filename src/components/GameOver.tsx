import React from "react";
import ShareButtons from "./ShareButtons";

interface GameOverProps {
  score: number;
  maxQuestions: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, maxQuestions, onRestart }) => {
  return (
    <div className="text-center py-20 animate-fade-in">
      <h2 className="text-3xl font-bold mb-4">🎉 Game Over!</h2>
      <p className="text-xl text-gray-300 mb-6">
        You scored <span className="text-white font-semibold">{score}</span> out of{" "}
        <span className="text-white font-semibold">{maxQuestions}</span>!
      </p>

      <button
        onClick={onRestart}
        className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition"
      >
        Play Again
      </button>

      {/* Share Buttons */}
      <ShareButtons score={score} maxQuestions={maxQuestions} />
    </div>
  );
};

export default GameOver;
