import React from 'react';

type QuestionCardProps = {
  question: string;
  answers: string[];
  callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
  userAnswer: string | null;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, answers, callback, userAnswer }) => {
  return (
    <div className="question-card">
      <h3 dangerouslySetInnerHTML={{ __html: question }} />
      {answers.map(answer => (
        <button
          key={answer}
          disabled={!!userAnswer}
          onClick={callback}
          value={answer}
        >
          <span dangerouslySetInnerHTML={{ __html: answer }} />
        </button>
      ))}
    </div>
  );
};

export default QuestionCard;
