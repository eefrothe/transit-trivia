import React, { useState, useEffect } from 'react';
import { Player, TriviaQuestion } from '../types';
import { generateNewQuestion } from '../services/geminiService';
import Spinner from './Spinner';
import { XIcon } from './icons';

interface SuddenDeathScreenProps {
  players: Player[];
  onWin: (winnerId: string) => void;
  theme: string;
}

const SuddenDeathScreen: React.FC<SuddenDeathScreenProps> = ({ players, onWin, theme }) => {
  const [question, setQuestion] = useState<TriviaQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    const fetchSuddenDeathQuestion = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const hardQuestion = await generateNewQuestion(theme, [], 'hard');
        setQuestion(hardQuestion);
      } catch (err) {
        setError("Failed to generate a tie-breaker question. The crown is shared!");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuddenDeathQuestion();
  }, [theme]);

  // Simulate bot answers for the tie-breaker
  useEffect(() => {
    if (!question || isLoading || isAnswered) return;

    const botsInSuddenDeath = players.filter(p => p.isBot);
    botsInSuddenDeath.forEach(bot => {
      // Bots are faster and better under pressure in a tie-breaker
      const botDelay = Math.random() * 2500 + 500; 
      setTimeout(() => {
        if (isAnswered) return;
        const isCorrect = Math.random() > 0.35; 
        if (isCorrect) {
          setIsAnswered(true);
          onWin(bot.id);
        }
      }, botDelay);
    });
  }, [question, isLoading, isAnswered, players, onWin]);

  const handleAnswerClick = (answer: string) => {
    if (isAnswered || !question) return;

    setIsAnswered(true);
    const isCorrect = answer === question.correctAnswer;
    if (isCorrect) {
      onWin('user');
    } else {
      // If user answers wrong, a bot wins almost instantly.
      const botWinner = players.find(p => p.isBot);
      if (botWinner) {
        setTimeout(() => onWin(botWinner.id), 500);
      } else {
        // Fallback for a user-only tie (not possible in current game structure)
        const otherPlayer = players.find(p => p.id !== 'user');
        if (otherPlayer) {
          onWin(otherPlayer.id);
        }
      }
    }
  };

  const userIsInSuddenDeath = players.some(p => p.id === 'user');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-4xl font-extrabold text-red-500 mb-4 animate-pulse">SUDDEN DEATH</h1>
        <Spinner />
        <p className="mt-4 text-slate-300">Generating a tie-breaker question...</p>
      </div>
    );
  }

  if (error || !question) {
     return (
      <div className="flex flex-col items-center justify-center text-center p-8">
        <XIcon className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-red-400">{error || 'Could not load question.'}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center animate-fade-in-slide-up text-center">
      <h1 className="text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 animate-pulse">
        SUDDEN DEATH
      </h1>
      <p className="text-slate-300 mb-8">First to answer correctly wins!</p>

      {question.questionType === 'visual' && question.imageUrl && (
        <div className="my-4 w-full aspect-video bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
            <img src={question.imageUrl} alt="Visual trivia question" className="w-full h-full object-contain" />
        </div>
      )}

      <h2 className="text-xl md:text-2xl font-bold my-6 min-h-[50px] flex items-center justify-center">{question.question}</h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map(option => (
          <button
            key={option}
            onClick={() => handleAnswerClick(option)}
            disabled={isAnswered || !userIsInSuddenDeath}
            className="w-full p-4 rounded-lg text-lg font-semibold text-white transition-all duration-200 bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-cyan-500 disabled:bg-slate-900 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuddenDeathScreen;