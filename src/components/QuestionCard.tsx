// src/components/QuestionCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

type QuestionCardProps = {
  question: string;
  choices: string[];
  correct: string;
  selected: string | null;
  onSelect: (choice: string) => void;
  disabled: boolean;
};

const variants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

const feedbackVariants = {
  initial: { opacity: 0 },
  show: (color: string) => ({
    opacity: 1,
    borderColor: color,
    transition: { duration: 0.3 },
  }),
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  choices,
  correct,
  selected,
  onSelect,
  disabled,
}) => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold">{question}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {choices.map(choice => {
        const isCorrect = selected === choice && choice === correct;
        const isWrong = selected === choice && choice !== correct;
        const borderColor = isCorrect ? 'border-green-500' : isWrong ? 'border-red-500' : 'border-transparent';
        return (
          <motion.button
            key={choice}
            onClick={() => onSelect(choice)}
            disabled={disabled}
            className={`p-4 rounded-lg border-2 ${borderColor} bg-slate-800 hover:bg-slate-700 text-left`}
            variants={variants}
            whileHover="hover"
            whileTap="tap"
          >
            {choice}
          </motion.button>
        );
      })}
    </div>
  </div>
);

export default QuestionCard;
