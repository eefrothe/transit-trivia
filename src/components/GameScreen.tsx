import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { TriviaQuestion } from '../types';
import { POST_ANSWER_DELAY_MS } from '../constants';
import useGameSounds from '../hooks/useGameSounds';
import { CheckIcon, XIcon } from './icons';
import AuthScreen from './AuthScreen';

interface GameScreenProps {
  user: any;
  onLogout: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ user, onLogout }) => {
  const {
    playClickSound,
    playCorrectSound,
    playWrongSound,
    playHoverSound,
    playErrorSound,
  } = useGameSounds();

  const sampleQuestion: TriviaQuestion = {
    question: 'What is the capital of France?',
    correctAnswer: 'Paris',
    options: ['Paris', 'London', 'Berlin', 'Rome'],
    category: 'Geography',
    questionType: 'text',
    imageUrl: '',
  };

  const [question, setQuestion] = useState<TriviaQuestion | null>(sampleQuestion);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);

  const handleAnswerClick = (answer: string) => {
    if (isAnswered) {
      playErrorSound();
      return;
    }

    const isCorrect = answer === question?.correctAnswer;
    setSelectedAnswer(answer);
    setIsAnswered(true);

    playClickSound();
    isCorrect ? playCorrectSound() : playWrongSound();

    setTimeout(() => {
      setIsAnswered(false);
      setSelectedAnswer(null);
      setDisabledOptions([]);
    }, POST_ANSWER_DELAY_MS);
  };

  const handleLogoutClick = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const getButtonClass = (option: string) => {
    const isDisabledByPowerUp = disabledOptions.includes(option);
    if (isDisabledByPowerUp) return 'bg-slate-900 !opacity-20 cursor-not-allowed';
    if (!isAnswered) return 'bg-slate-800 hover:bg-slate-700';
    const isCorrect = option === question?.correctAnswer;
    if (isCorrect) return 'bg-green-500 scale-105';
    const isSelected = option === selectedAnswer;
    if (isSelected && !isCorrect) return 'bg-red-500';
    return 'bg-slate-800 opacity-50';
  };

  if (!user) return <AuthScreen />;

  return (
    <div className="flex flex-col items-center justify-center p-6 text-white animate-fade-in">
      <div className="w-full max-w-xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome, {user.email || 'Player'}!</h1>
          <button
            onClick={handleLogoutClick}
            className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">{question?.question}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question?.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerClick(option)}
                onMouseEnter={() => playHoverSound()}
                disabled={isAnswered || disabledOptions.includes(option)}
                className={`w-full py-3 px-4 rounded-lg text-lg font-semibold transition-all duration-300 ${getButtonClass(option)}`}
              >
                <div className="flex items-center justify-center">
                  {isAnswered && option === question.correctAnswer && <CheckIcon className="w-6 h-6 mr-2" />}
                  {isAnswered && selectedAnswer === option && option !== question.correctAnswer && <XIcon className="w-6 h-6 mr-2" />}
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
