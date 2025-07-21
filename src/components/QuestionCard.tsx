import React, { useEffect, useState } from "react";
import clsx from "clsx";

interface Question {
  question: string;
  correct: string;
  incorrect_1: string;
  incorrect_2: string;
  incorrect_3?: string;
  category?: string;
}

interface Props {
  questionData: Question;
  onAnswer: (isCorrect: boolean) => void;
  playClickSound: () => void;
  playHoverSound: () => void;
  answeredCorrectly: boolean | null;
  timeLeft: number;
  totalTime: number;
  playConfettiSound: () => void; // 👈 Add this prop
}

const QuestionCard: React.FC<Props> = ({
  questionData,
  onAnswer,
  playClickSound,
  playHoverSound,
  answeredCorrectly,
  timeLeft,
  totalTime,
  playConfettiSound,
}) => {
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);

  useEffect(() => {
    const options = [
      questionData.correct,
      questionData.incorrect_1,
      questionData.incorrect_2,
      ...(questionData.incorrect_3 ? [questionData.incorrect_3] : []),
    ];
    setShuffledAnswers(options.sort(() => Math.random() - 0.5));
  }, [questionData]);

  const handleAnswer = (answer: string) => {
    playClickSound();
    const isCorrect = answer === questionData.correct;
    if (isCorrect) {
      playConfettiSound(); // 🎉 Play confetti sound on correct answer
    }
    onAnswer(isCorrect);
  };

  return (
    <div className={clsx("p-6 rounded-xl bg-slate-800 shadow-md transition-all duration-300", {
      "animate-shake bg-red-700/60": answeredCorrectly === false,
      "bg-green-700/60": answeredCorrectly === true,
    })}>
      <p className="text-lg font-medium mb-4">{questionData.question}</p>

      <div className="grid gap-4">
        {shuffledAnswers.map((answer, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(answer)}
            onMouseEnter={playHoverSound}
            className="bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
            disabled={answeredCorrectly !== null}
          >
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
