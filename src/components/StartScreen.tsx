import React from 'react';

type StartScreenProps = {
  onStart: () => void;
};

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="start-screen">
      <h1>Welcome to Transit Trivia</h1>
      <button onClick={onStart}>Start Game</button>
    </div>
  );
};

export default StartScreen;
