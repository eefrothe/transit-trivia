import React from 'react';

type GameOverProps = {
  score: number;
  onRestart: () => void;
};

const GameOver: React.FC<GameOverProps> = ({ score, onRestart }) => {
  return (
    <div className="game-over">
      <h2>Game Over!</h2>
      <p>Your Score: {score}</p>
      <button onClick={onRestart}>Play Again</button>
    </div>
  );
};

export default GameOver;
