import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import QuestionCard from "./QuestionCard";
import Spinner from "./Spinner";
import VolumeControl from "./VolumeControl";
import GameOver from "./GameOver";
import { useGameSounds } from "../hooks/useGameSounds";

export interface Question {
  id: string;
  question: string;
  correct: string;
  incorrect_1: string;
  incorrect_2: string;
  incorrect_3?: string;
}

interface GameScreenProps {
  user: any;
  onLogout: () => Promise<void>;
}

const MAX_QUESTIONS = 5;

const GameScreen: React.FC<GameScreenProps> = ({ user, onLogout }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  const {
    playClickSound,
    playCorrectSound,
    playWrongSound,
    playErrorSound,
    playHoverSound,
  } = useGameSounds();

  const fetchQuestions = async () => {
    setLoading(true);
    setGameOver(false);
    setScore(0);
    setSelected(null);
    setCurrentIndex(0);

    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .limit(MAX_QUESTIONS);

      if (error) throw error;

      const shuffled = data.map((q: Question) => {
        const options = [q.correct, q.incorrect_1, q.incorrect_2];
        if (q.incorrect_3) options.push(q.incorrect_3);
        return {
          ...q,
          options: options.sort(() => Math.random() - 0.5),
        };
      });

      setQuestions(shuffled);
    } catch (err) {
      console.error("Failed to load questions", err);
      playErrorSound();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSelect = (choice: string) => {
    setSelected(choice);
    const correctAnswer = questions[currentIndex].correct;

    if (choice === correctAnswer) {
      setScore((prev) => prev + 1);
      playCorrectSound();
    } else {
      playWrongSound();
    }

    setTimeout(() => {
      setSelected(null);
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setGameOver(true);
      }
    }, 1000);
  };

  const current = questions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center">
      <header className="w-full max-w-3xl flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transit Trivia</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">{user?.email}</span>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded text-sm"
          >
            Logout
          </button>
          <VolumeControl />
        </div>
      </header>

      <main className="w-full max-w-2xl flex-grow flex flex-col justify-center">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : gameOver ? (
          <GameOver
            score={score}
            total={questions.length}
            onRestart={fetchQuestions}
          />
        ) : (
          <QuestionCard
            question={current.question}
            choices={current.options}
            correct={current.correct}
            selected={selected}
            onSelect={handleSelect}
            disabled={!!selected}
            playClickSound={playClickSound}
            playHoverSound={playHoverSound}
          />
        )}
      </main>

      {!loading && !gameOver && (
        <footer className="mt-10 text-gray-400 text-sm">
          Question {currentIndex + 1} / {questions.length} | Score: {score}
        </footer>
      )}
    </div>
  );
};

export default GameScreen;
