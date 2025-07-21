import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import Spinner from "./Spinner";
import VolumeControl from "./VolumeControl";
import QuestionCard from "./QuestionCard";
import ShareButtons from "./ShareButtons";
import { useGameSounds } from "../hooks/useGameSounds";
import confetti from "canvas-confetti";
import GameOver from "./GameOver";

const MAX_QUESTIONS = 5;
const TIME_LIMIT = 15;

interface Question {
  id: string;
  question: string;
  correct: string;
  incorrect_1: string;
  incorrect_2: string;
  incorrect_3?: string;
  category?: string;
}

interface GameScreenProps {
  user: any;
  onLogout: () => Promise<void>;
}

const GameScreen: React.FC<GameScreenProps> = ({ user, onLogout }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [musicPlaying, setMusicPlaying] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const {
    playClickSound,
    playCorrectSound,
    playWrongSound,
    playHoverSound,
    playErrorSound,
    playConfettiSound,
    playBackgroundMusic,
    pauseBackgroundMusic,
  } = useGameSounds();

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .order("id", { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      setCurrentQuestion(data);
    } catch (error) {
      console.error("Error fetching question:", error);
      playErrorSound();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    playBackgroundMusic();
    return pauseBackgroundMusic;
  }, []);

  useEffect(() => {
    if (!gameOver) {
      fetchQuestion();
    }
  }, [questionCount]);

  useEffect(() => {
    if (!loading && currentQuestion && !gameOver) {
      setTimeLeft(TIME_LIMIT);
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAnswer(false);
            return TIME_LIMIT;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestion]);

  const handleAnswer = (isCorrect: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current);

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
        if (score + (isCorrect ? 1 : 0) >= MAX_QUESTIONS * 0.7) {
          confetti({ spread: 100, particleCount: 150 });
          playConfettiSound();
        }
      } else {
        setQuestionCount((prev) => prev + 1);
      }
    }, 1200);
  };

  const handleRestart = () => {
    setScore(0);
    setQuestionCount(0);
    setGameOver(false);
    fetchQuestion();
  };

  const toggleMusic = () => {
    if (musicPlaying) {
      pauseBackgroundMusic();
    } else {
      playBackgroundMusic();
    }
    setMusicPlaying(!musicPlaying);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-start p-6 bg-slate-950 text-white">
      <div className="w-full max-w-2xl mt-8 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Transit Trivia</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">{user?.email}</span>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-500 text-white py-1 px-3 rounded-lg text-sm font-medium"
            >
              Logout
            </button>
            <VolumeControl />
            <button
              onClick={toggleMusic}
              className="ml-2 text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded"
            >
              {musicPlaying ? "Pause Music" : "Play Music"}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4 text-sm text-gray-300 px-2">
          <span>Score: <strong>{score}</strong></span>
          <span>Question {questionCount + 1} / {MAX_QUESTIONS}</span>
          <span>Time Left: <strong>{timeLeft}s</strong></span>
        </div>

        {gameOver ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold mb-4">🎉 Game Over!</h3>
            <p className="text-gray-400 mb-4">
              Your score: <strong>{score} / {MAX_QUESTIONS}</strong>
            </p>
            <ShareButtons score={score} />
            <button
              onClick={handleRestart}
              className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium"
            >
              Play Again
            </button>
          </div>
        ) : loading || !currentQuestion ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <QuestionCard
            question={currentQuestion.question}
            correct={currentQuestion.correct}
            incorrectAnswers={[
              currentQuestion.incorrect_1,
              currentQuestion.incorrect_2,
              currentQuestion.incorrect_3,
            ].filter(Boolean)}
            onAnswer={handleAnswer}
            playClickSound={playClickSound}
            playHoverSound={playHoverSound}
            answeredCorrectly={answeredCorrectly}
            timeLeft={timeLeft}
            totalTime={TIME_LIMIT}
            playConfettiSound={playConfettiSound}
          />
        )}
      </div>
    </div>
  );
};

export default GameScreen;
