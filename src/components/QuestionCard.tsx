import React, { useEffect, useState } from "react";
import clsx from "clsx";

interface QuestionCardProps {
  question: string;
  correct: string;
  incorrectAnswers: string[];
  onAnswer: (isCorrect: boolean) => void;
  playClickSound: () => void;
  playHoverSound: () => void;
  answeredCorrectly: boolean | null;
  timeLeft: number;
  totalTime: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  correct,
  incorrectAnswers,
  onAnswer,
  playClickSound,
  playHoverSound,
  answeredCorrectly,
  timeLeft,
  totalTime,
}) => {
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    const allAnswers = [...incorrectAnswers, correct];
    setShuffledAnswers(shuffleArray(allAnswers));
    setSelectedAnswer(null);
  }, [question]);

  const shuffleArray = (array: string[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleAnswerClick = (answer: string) => {
    if (selectedAnswer) return;

    playClickSound();
    setSelectedAnswer(answer);
    const isCorrect = answer === correct;
    onAnswer(isCorrect);
  };

  const getAnswerClass = (answer: string) => {
    if (!selectedAnswer) return "hover:bg-slate-800";
    if (answer === correct) return "bg-green-600 text-white";
    if (answer === selectedAnswer) return "bg-red-600 text-white";
    return "bg-slate-800";
  };

  const progressPercent = (timeLeft / totalTime) * 100;

  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg animate-fade-in">
      {/* Timer Progress Bar */}
      <div className="h-2 bg-slate-700 rounded mb-4 overflow-hidden">
        <div
          className={clsx("h-full transition-all", {
            "bg-green-500": timeLeft > totalTime * 0.5,
            "bg-yellow-400": timeLeft <= totalTime * 0.5 && timeLeft > totalTime * 0.2,
            "bg-red-500": timeLeft <= totalTime * 0.2,
          })}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question */}
      <h3 className="text-lg font-semibold mb-4">{question}</h3>

      {/* Answer Options */}
      <div className="space-y-3">
        {shuffledAnswers.map((answer, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswerClick(answer)}
            onMouseEnter={playHoverSound}
            disabled={!!selectedAnswer}
            className={clsx(
              "w-full py-2 px-4 rounded-lg text-left transition-colors duration-200",
              getAnswerClass(answer)
            )}
          >
            {answer}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {answeredCorrectly !== null && (
        <div className="text-center mt-4 text-sm text-gray-300">
          {answeredCorrectly ? (
            <span className="text-green-400">✅ Correct!</span>
          ) : (
            <span className="text-red-400">❌ Wrong. Correct answer: <strong>{correct}</strong></span>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
