import { Question } from '../types';

export async function generateTheme(): Promise<string> {
  return 'Transit & Travel';
}

export async function generateQuestionBatch(theme: string, count: number): Promise<Question[]> {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1000,
    question: `What is question ${i + 1} about ${theme}?`,
    correct_answer: 'Correct',
    incorrect_answers: ['Wrong A', 'Wrong B', 'Wrong C'],
    theme,
  }));
}
