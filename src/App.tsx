import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { supabase } from './lib/supabaseClient';
import QuestionCard from './components/QuestionCard';
import GameOver from './components/GameOver';
import StartScreen from './components/StartScreen';
import { Question } from './types';
import { generateQuestionBatch, generateTheme } from './services/geminiService';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionQueue, setQuestionQueue] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [theme, setTheme] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeGame = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const gameTheme = await generateTheme();
      setTheme(gameTheme);

      let questions: Question[] = [];

      const { data: supabaseData, error: supabaseError } = await supabase
        .from('questions')
        .select('*')
        .limit(15)
        .order('id', { ascending: false });

      if (supabaseError) {
        console.warn("Supabase error:", supabaseError.message);
      }

      if (supabaseData && supabaseData.length > 0) {
        questions = supabaseData;
      } else {
        console.log("Falling back to Gemini AI...");
        questions = await generateQuestionBatch(gameTheme, 15);
      }

      if (questions.length === 0) {
        throw new Error('No questions available from Supabase or Gemini.');
      }

      setCurrentQuestion(questions[0]);
      setQuestionQueue(questions.slice(1));
      setScore(0);
      setIsGameOver(false);
    } catch (err) {
      console.error(err);
      setError('Failed to start the game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore((prev) => prev + 1);
    if (questionQueue.length > 0) {
      const nextQuestion = questionQueue[0];
      setQuestionQueue((prev) => prev.slice(1));
      setCurrentQuestion(nextQuestion);
    } else {
      setIsGameOver(true);
      setCurrentQuestion(null);
    }
  };

  if (isLoading) return <div className="App">Loading...</div>;
  if (error) return <div className="App">Error: {error}</div>;

  return (
    <div className="App">
      {isGameOver ? (
        <GameOver score={score} onRestart={initializeGame} />
      ) : currentQuestion ? (
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          theme={theme}
        />
      ) : (
        <StartScreen onStart={initializeGame} />
      )}
    </div>
  );
}

export default App;
