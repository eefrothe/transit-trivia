import React, { useEffect, useState, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";

import QuestionCard from "./QuestionCard";
import GameOverScreen from "../components/GameOverScreen";
import useGameSounds from "../hooks/useGameSounds";
import ProgressBar from "../components/ProgressBar";
import TopBar from "./shared/TopBar";
import fetchQuestions from "../lib/fetchQuestions";

interface GameScreenProps {
  user: User;
  onLogout: () => void;
}

const TOTAL_QUESTIONS = 10;

const GameScreen: React.FC<GameScreenProps> = ({ user, onLogout }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const {
    playCorrectSound,
    playWrongSound,
    playConfettiSound,
    playBackgroundMusic,
    stopBackgroundMusic,
  } = useGameSounds();

  const loadQuestions = useCallback(async () => {
    const data = await fetchQuestions(TOTAL_QUESTIONS);
    setQuestions(data || []);
    setCurrentIndex(0);
    setScore(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    loadQuestions();
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

    const nextIndex = currentIndex + 1;

    if (nextIndex >= TOTAL_QUESTIONS) {
      setGameOver(true);
      if (score + (isCorrect ? 1 : 0) === TOTAL_QUESTIONS) {
        setShowConfetti(true);
        playConfettiSound();
      }
    } else {
      setTimeout(() => {
        setCurrentIndex(nextIndex);
      }, 600);
    }
  };

  const handleRestart = () => {
    loadQuestions();
    setShowConfetti(false);
  };

  const currentQuestion = questions[currentIndex];

  if (gameOver) {
    return (
      <>
        {showConfetti && <Confetti />}
        <GameOverScreen score={score} maxScore={TOTAL_QUESTIONS} onRestart={handleRestart} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 text-white">
      <TopBar onLogout={onLogout}>
        <div className="w-40 ml-auto">
          <ProgressBar value={(currentIndex / TOTAL_QUESTIONS) * 100} />
        </div>
      </TopBar>

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
