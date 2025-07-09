import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TriviaQuestion } from '../types';
import { VISUAL_QUESTION_CHANCE } from '../constants';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const STABLE_DIFFUSION_URL = 'https://api.stability.ai/v1/generation/stable-diffusion-v1-5/text-to-image';
const STABLE_DIFFUSION_API_KEY = process.env.STABILITY_API_KEY as string;

// === JSON Instructions ===
const JSON_PROMPT = `
Respond ONLY with a valid JSON object:
{
  "category": "string",
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "correctAnswer": "string"
}
`;

// === Theme Generation ===
export const generateTheme = async (): Promise<string> => {
  try {
    const result = await model.generateContent(`Give a fun trivia theme like "80s Cartoons", "Space Mysteries", or "Mythical Creatures". Only return the theme, no extra text.`);
    return result.response.text().trim();
  } catch (e) {
    console.error('Theme generation error:', e);
    return 'General Knowledge';
  }
};

// === Question Batch ===
export const generateQuestionBatch = async (theme: string, count: number): Promise<TriviaQuestion[]> => {
  const prompt = `Generate ${count} trivia questions on "${theme}". Each question must follow:\n${JSON_PROMPT}`;

  try {
    const result = await model.generateContent(prompt);
    const cleanJson = cleanAndParseArray(result.response.text());
    return cleanJson || [];
  } catch (e) {
    console.error('Batch generation failed, falling back to single question:', e);
    const single = await generateNewQuestion(theme, [], 'normal');
    return [single];
  }
};

// === New Single Question ===
export const generateNewQuestion = async (
  theme: string,
  askedQuestions: string[],
  difficulty: 'normal' | 'hard'
): Promise<TriviaQuestion> => {
  const useVisual = Math.random() < VISUAL_QUESTION_CHANCE && difficulty === 'normal';

  try {
    if (useVisual) {
      const subjectPrompt = `Suggest a highly visual noun for "${theme}". Respond only with the noun.`;
      const subjectResult = await model.generateContent(subjectPrompt);
      const subject = subjectResult.response.text().trim();

      const imageUrl = await generateStableDiffusionImage(subject);
      const questionPrompt = `Using the subject "${subject}", generate a trivia question (theme: "${theme}"). Avoid duplicates: [${askedQuestions.join(',')}]\n${JSON_PROMPT}`;

      const result = await model.generateContent(questionPrompt);
      const parsed = cleanAndParse(result.response.text());

      if (parsed) {
        return {
          ...parsed,
          options: shuffleArray(parsed.options),
          questionType: 'visual',
          imageUrl,
        };
      }
    }

    // fallback: text question
    const difficultyMsg = difficulty === 'hard' ? 'Generate a VERY HARD question' : 'Generate a normal question';
    const prompt = `${difficultyMsg} for theme "${theme}". Avoid: [${askedQuestions.join(',')}]\n${JSON_PROMPT}`;
    const result = await model.generateContent(prompt);
    const parsed = cleanAndParse(result.response.text());

    if (parsed) {
      return {
        ...parsed,
        options: shuffleArray(parsed.options),
        questionType: 'text',
      };
    }

    throw new Error('Failed to parse Gemini response');
  } catch (e) {
    console.error('Error generating question:', e);
    throw new Error('Could not generate a trivia question.');
  }
};

// === Image Generation (Stable Diffusion) ===
const generateStableDiffusionImage = async (prompt: string): Promise<string> => {
  try {
    const response = await axios.post(
      STABLE_DIFFUSION_URL,
      {
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: 512,
        width: 512,
        samples: 1,
        steps: 30,
      },
      {
        headers: {
          Authorization: `Bearer ${STABLE_DIFFUSION_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    const base64Image = response.data.artifacts?.[0]?.base64;
    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.error('Image generation failed:', error);
    return '';
  }
};

// === Utility Functions ===
const cleanAndParse = (raw: string): TriviaQuestion | null => {
  try {
    const cleaned = raw.replace(/```(json)?/g, '').trim();
    const json = JSON.parse(cleaned);
    if (
      json &&
      typeof json.category === 'string' &&
      typeof json.question === 'string' &&
      Array.isArray(json.options) &&
      json.options.length === 4 &&
      json.options.includes(json.correctAnswer)
    ) {
      return json as TriviaQuestion;
    }
  } catch (e) {
    console.error('Parsing error:', e);
  }
  return null;
};

const cleanAndParseArray = (raw: string): TriviaQuestion[] | null => {
  try {
    const cleaned = raw.replace(/```(json)?/g, '').trim();
    const array = JSON.parse(cleaned);
    if (!Array.isArray(array)) return null;

    return array.filter(q =>
      q.category &&
      q.question &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      q.options.includes(q.correctAnswer)
    );
  } catch (e) {
    console.error('Batch parse error:', e);
    return null;
  }
};

const shuffleArray = <T>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);
