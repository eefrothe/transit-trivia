import React, { useEffect, useState, useCallback } from "react";
import QuestionCard from "./QuestionCard";
import GameOverScreen from "./GameOverScreen";
import { supabase } from "../lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import useGameSounds from "../hooks/useGameSounds";
import Confetti from "react-confetti";
import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

interface GameScreenProps {
  user: User;
  onLogout: () => void;
}

interface Question {
  id: number;
  question: string;
  correct: string;
  incorrect_1: string;
  incorrect_2: string;
  incorrect_3?: string;
  category?: string;
}

const TOTAL_QUESTIONS = 10;

const GameScreen: React.FC<GameScreenProps> = ({ user, onLogout }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const {
    playCorrectSound,
    playWrongSound,
    playConfettiSound,
    playBackgroundMusic,
    stopBackgroundMusic,
  } = useGameSounds();

  const fetchQuestions = useCallback(async () => {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("id", { ascending: true })
      .limit(TOTAL_QUESTIONS);

    if (error) {
      console.error("Error fetching questions:", error.message);
      return;
    }

    setQuestions(data || []);
    setCurrentIndex(0);
    setScore(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    fetchQuestions();
    playBackgroundMusic();
    return stopBackgroundMusic;
  }, []);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
      playCorrectSound();
    } else {
      playWrongSound();
    }

    if (currentIndex + 1 >= TOTAL_QUESTIONS) {
      setGameOver(true);
      if (score + (isCorrect ? 1 : 0) === TOTAL_QUESTIONS) {
        setShowConfetti(true);
        playConfettiSound();
      }
    } else {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 600);
    }
  };

  const handleRestart = () => {
    fetchQuestions();
    setShowConfetti(false);
  };

  if (gameOver) {
    return (
      <>
        {showConfetti && <Confetti />}
        <GameOverScreen score={score} maxScore={TOTAL_QUESTIONS} onRestart={handleRestart} />
      </>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 text-white">
      {/* Top Controls */}
      <div className="absolute top-4 left-4 z-50 flex gap-2">
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
        >
          Logout
        </button>

        <Link
          to="/settings"
          className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-sm hidden sm:inline"
        >
          ⚙️ Settings
        </Link>

        <Link
          to="/settings"
          className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded sm:hidden"
        >
          <Cog6ToothIcon className="w-5 h-5" />
        </Link>
      </div>

      {/* Progress */}
      <div className="absolute top-4 right-4 z-50 w-40">
        <ProgressBar value={(currentIndex / TOTAL_QUESTIONS) * 100} />
      </div>

      {/* Question */}
      {currentQuestion ? (
        <>
          <h2 className="text-xl font-semibold mb-2 fade-in">
            Question {currentIndex + 1} / {TOTAL_QUESTIONS}
          </h2>
          <QuestionCard question={currentQuestion} onAnswer={handleAnswer} />
          <p className="mt-6 text-lg font-bold">Score: {score}</p>
        </>
      ) : (
        <p>Loading question...</p>
      )}
    </div>
  );
};

export default GameScreen;
