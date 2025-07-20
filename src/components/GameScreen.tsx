import React, { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";
import { supabase } from "../lib/supabaseClient";
import Spinner from "./Spinner";
import VolumeControl from "./VolumeControl";
import { useGameSounds } from "../hooks/useGameSounds";

interface GameScreenProps {
  user: any;
  onLogout: () => Promise<void>;
}

const MAX_QUESTIONS = 5;

const GameScreen: React.FC<GameScreenProps> = ({ user, onLogout }) => {
  const [question, setQuestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const {
    playClickSound,
    playCorrectSound,
    playWrongSound,
    playHoverSound,
    playErrorSound,
  } = useGameSounds();

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("question")
        .limit(1)
        .single();

      if (error) throw error;
      setQuestion(data?.question);
    } catch (err) {
      console.error("Failed to load question", err);
      playErrorSound();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!gameOver) fetchQuestion();
  }, [questionCount, gameOver]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      playCorrectSound();
      setScore((prev) => prev + 1);
    } else {
      playWrongSound();
    }

    setAnsweredCorrectly(isCorrect);

    setTimeout(() => {
      setAnsweredCorrectly(null);
      if (questionCount + 1 >= MAX_QUESTIONS) {
        setGameOver(true);
      } else {
        setQuestionCount((prev) => prev + 1);
      }
    }, 1000);
  };

  const resetGame = () => {
    setScore(0);
    setQuestionCount(0);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-900 text-white flex flex-col items-center p-6">
      <div className="w-full max-w-2xl mt-8 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold tracking-tight">🚋 Transit Trivia</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">{user?.email}</span>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-500 text-white py-1 px-3 rounded-lg text-sm font-medium"
            >
              Logout
            </button>
            <VolumeControl />
          </div>
        </div>

        {/* Score HUD */}
        <div className="flex justify-between items-center mb-6 px-4 text-sm text-gray-400">
          <span>Score: <strong>{score}</strong></span>
          <span>Question {questionCount + 1} / {MAX_QUESTIONS}</span>
        </div>

        {/* Game State */}
        {gameOver ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold mb-4">🎉 Game Over!</h3>
            <p className="text-gray-400 mb-6">
              Your score: <strong>{score} / {MAX_QUESTIONS}</strong>
            </p>
            <button
              onClick={resetGame}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium"
            >
              Play Again
            </button>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : question ? (
          <QuestionCard
            question={question}
            onAnswer={handleAnswer}
            playClickSound={playClickSound}
            playHoverSound={playHoverSound}
            answeredCorrectly={answeredCorrectly}
          />
        ) : (
          <div className="text-center text-gray-400 py-12">
            No question available.
          </div>
        )}
      </div>
    </div>
  );
};

export default GameScreen;
