// /src/components/StartScreen.tsx
import React, { useEffect } from 'react';
import useGameSounds from '../hooks/useGameSounds';
import { motion } from 'framer-motion';

type StartScreenProps = {
  onStart: () => void;
};

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const { playClickSound, playIntroSound } = useGameSounds();

  useEffect(() => {
    playIntroSound();
  }, [playIntroSound]);

  const handleStart = () => {
    playClickSound();
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-6 animate-fade-in">
      <motion.div
        className="bg-slate-900 p-8 rounded-xl shadow-lg max-w-sm w-full text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-3xl font-bold mb-6"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          🚇 Welcome to Transit Trivia
        </motion.h1>
        <p className="mb-6 text-gray-400">Test your knowledge on the go in this fast-paced quiz adventure!</p>
        <motion.button
          onClick={handleStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-600 hover:bg-green-500 text-white py-3 px-6 rounded-lg transition"
        >
          Start Game
        </motion.button>
      </motion.div>
    </div>
  );
};

export default StartScreen;
