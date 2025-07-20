import React from "react";

interface QuestionCardProps {
  question: string;
  onAnswer: (isCorrect: boolean) => void;
  playClickSound: () => void;
  playHoverSound: () => void;
  answeredCorrectly: boolean | null;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  playClickSound,
  playHoverSound,
  answeredCorrectly,
}) => {
  const handleClick = (isCorrect: boolean) => {
    playClickSound();
    onAnswer(isCorrect);
  };

  const feedbackClass = answeredCorrectly === null
    ? ""
    : answeredCorrectly
    ? "border-green-500 bg-green-900 text-green-200"
    : "border-red-500 bg-red-900 text-red-200";

  return (
    <div
      className={`rounded-xl border p-6 shadow-md transition-all duration-500 ${feedbackClass}`}
    >
      <h3 className="text-lg font-semibold mb-6">{question}</h3>
      <div className="flex gap-4 justify-center">
        <button
          onMouseEnter={playHoverSound}
          onClick={() => handleClick(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium"
        >
          True
        </button>
        <button
          onMouseEnter={playHoverSound}
          onClick={() => handleClick(false)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium"
        >
          False
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
