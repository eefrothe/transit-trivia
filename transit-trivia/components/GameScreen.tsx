import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Player, AllPlayerStats, TriviaQuestion, PowerUpType } from '../types';
import { POST_ANSWER_DELAY_MS } from '../constants';
import PlayerAvatar from './PlayerAvatar';
import Spinner from './Spinner';
import { CheckIcon, XIcon, BrainIcon, HintIcon, DoublePointsIcon, SkipIcon } from './icons';

interface GameScreenProps {
  players: Player[];
  playerStats: AllPlayerStats;
  question: TriviaQuestion | null;
  gameTimeLeft: number;
  onAnswer: (playerId: string, isCorrect: boolean) => void;
  onNextQuestion: () => void;
  onUsePowerUp: (playerId: string, powerUp: PowerUpType) => void;
  isLoading: boolean;
  error: string | null;
  theme: string | null;
}

const GameScreen: React.FC<GameScreenProps> = ({
  players,
  playerStats,
  question,
  gameTimeLeft,
  onAnswer,
  onNextQuestion,
  onUsePowerUp,
  isLoading,
  error,
  theme,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);
  
  const botPlayers = useMemo(() => players.filter(p => p.isBot), [players]);
  const userStats = playerStats['user'];
  const { fiftyFifty: hintUsed, skip: skipUsed, doublePoints: doublePointsUsed } = userStats?.powerUpsUsed || {};

  const handleAnswerClick = (answer: string) => {
    if (isAnswered) return;
    const isCorrect = answer === question?.correctAnswer;
    setIsAnswered(true);
    setSelectedAnswer(answer);
    onAnswer('user', isCorrect);
  };

  const handleHint = () => {
      if (!question || hintUsed || isAnswered || disabledOptions.length > 0) return;
      onUsePowerUp('user', 'fiftyFifty');
      const wrongAnswers = question.options.filter(opt => opt !== question.correctAnswer);
      const shuffled = wrongAnswers.sort(() => 0.5 - Math.random());
      setDisabledOptions(shuffled.slice(0, 2));
  };

  const handleSkip = () => {
    if (skipUsed || isAnswered) return;
    onUsePowerUp('user', 'skip');
  };

  const handleDoublePoints = () => {
      if (doublePointsUsed || isAnswered) return;
      onUsePowerUp('user', 'doublePoints');
  };

  const simulateBotAnswers = useCallback(() => {
    botPlayers.forEach(bot => {
      const botDelay = Math.random() * 4000 + 1000;
      setTimeout(() => {
        if (!question) return;
        const isCorrect = Math.random() > 0.3;
        onAnswer(bot.id, isCorrect);
      }, botDelay);
    });
  }, [botPlayers, onAnswer, question]);
  
  useEffect(() => {
    if (question && !isLoading) {
      setIsAnswered(false);
      setSelectedAnswer(null);
      setDisabledOptions([]);
      simulateBotAnswers();
    }
  }, [question, isLoading, simulateBotAnswers]);
  
  useEffect(() => {
    if (isAnswered) {
      const timeout = setTimeout(() => {
        onNextQuestion();
      }, POST_ANSWER_DELAY_MS);
      return () => clearTimeout(timeout);
    }
  }, [isAnswered, onNextQuestion]);
  
  const getButtonClass = (option: string) => {
    const isDisabledByPowerUp = disabledOptions.includes(option);
    if (isDisabledByPowerUp) return "bg-slate-900 !opacity-20 cursor-not-allowed";

    if (!isAnswered) return "bg-slate-800 hover:bg-slate-700";
    
    const isCorrect = option === question?.correctAnswer;
    if (isCorrect) return "bg-green-500 scale-105";

    const isSelected = option === selectedAnswer;
    if (isSelected && !isCorrect) return "bg-red-500";
    
    return "bg-slate-800 opacity-50";
  };
  
  if (isLoading || !question) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Spinner />
        <p className="mt-4 text-slate-400">Loading next question...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <XIcon className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-red-400">{error}</p>
         <button onClick={onNextQuestion} className="mt-4 bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg">Try Again</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full animate-fade-in">
        <header className="mb-4">
            <div className="flex justify-between items-center text-slate-400 mb-2 text-lg">
                <span className="font-bold text-white tabular-nums">Time Left: {gameTimeLeft}s</span>
                <span className="font-semibold text-cyan-400">{question.category}</span>
            </div>
            {theme && (
                <div className="flex items-center justify-center gap-2 text-sm text-slate-300 bg-slate-800/50 rounded-full px-3 py-1 w-fit mx-auto">
                    <BrainIcon className="w-4 h-4" /> <span>{theme}</span>
                </div>
            )}
        </header>

        {question.questionType === 'visual' && question.imageUrl && (
            <div className="my-4 w-full aspect-video bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
                <img src={question.imageUrl} alt="Visual trivia question" className="w-full h-full object-contain" />
            </div>
        )}

        <h2 className="text-xl md:text-2xl font-bold text-center my-6 min-h-[80px] flex items-center justify-center">{question.question}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {question.options.map((option) => (
                <button
                    key={option}
                    onClick={() => handleAnswerClick(option)}
                    disabled={isAnswered || disabledOptions.includes(option)}
                    className={`w-full p-4 rounded-lg text-lg font-semibold text-white transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-opacity-50 ${getButtonClass(option)} disabled:scale-100 disabled:cursor-not-allowed`}
                >
                    <div className="flex items-center justify-center min-h-[28px]">
                        {isAnswered && option === question.correctAnswer && <CheckIcon className="w-6 h-6 mr-2 animate-pop-in"/>}
                        {isAnswered && selectedAnswer === option && option !== question.correctAnswer && <XIcon className="w-6 h-6 mr-2 animate-pop-in"/>}
                        <span>{option}</span>
                    </div>
                </button>
            ))}
        </div>

        <div className="mt-auto flex flex-col items-center">
            <div className="w-full bg-slate-800/50 rounded-xl p-4 mb-4">
                <h3 className="text-center font-semibold text-cyan-400 mb-3">Leaderboard</h3>
                <div className="space-y-2">
                    {players.sort((a,b) => playerStats[b.id].score - playerStats[a.id].score).map(p => 
                      <PlayerAvatar 
                        key={p.id} 
                        player={p} 
                        stats={playerStats[p.id]} 
                        isDoublePointsActive={playerStats[p.id]?.isDoublePointsActive}
                      />
                    )}
                </div>
            </div>
            
            <div className="flex justify-center items-center gap-4 w-full max-w-md">
              <button
                onClick={handleHint}
                disabled={hintUsed || isAnswered || disabledOptions.length > 0}
                className="flex-1 flex flex-col items-center justify-center gap-1 bg-purple-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-purple-500 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50 shadow-lg shadow-purple-600/30 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
              >
                <HintIcon className="w-6 h-6" />
                <span className="text-xs font-semibold">Hint</span>
              </button>

              <button
                onClick={handleDoublePoints}
                disabled={doublePointsUsed || isAnswered || userStats?.isDoublePointsActive}
                className="flex-1 flex flex-col items-center justify-center gap-1 bg-orange-500 text-white font-bold py-2 px-3 rounded-lg hover:bg-orange-400 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 focus:ring-opacity-50 shadow-lg shadow-orange-500/30 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
              >
                <DoublePointsIcon className="w-6 h-6" />
                <span className="text-xs font-semibold">2x Points</span>
              </button>

              <button
                onClick={handleSkip}
                disabled={skipUsed || isAnswered}
                className="flex-1 flex flex-col items-center justify-center gap-1 bg-sky-500 text-white font-bold py-2 px-3 rounded-lg hover:bg-sky-400 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-300 focus:ring-opacity-50 shadow-lg shadow-sky-500/30 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
              >
                <SkipIcon className="w-6 h-6" />
                <span className="text-xs font-semibold">Skip</span>
              </button>
            </div>
        </div>
    </div>
  );
};

export default GameScreen;
