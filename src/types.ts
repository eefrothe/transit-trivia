export type Question = {
  id: number;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  theme?: string;
};
