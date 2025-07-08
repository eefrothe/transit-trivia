import { TriviaQuestion } from '../types';
import { VISUAL_QUESTION_CHANCE } from '../constants';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-04-17' });

export const generateTheme = async (): Promise<string> => {
  try {
    const result = await model.generateContent([
      'Generate a single, fun, and interesting trivia theme. Examples: "80s Action Movies", "Deep Sea Mysteries", "Ancient Roman History". Respond with only the theme name, no extra text or quotes.'
    ]);
    const text = await result.response.text();
    return text.trim();
  } catch (error) {
    console.error('Failed to generate theme:', error);
    return 'General Knowledge';
  }
};

export const generateQuestionBatch = async (theme: string, count: number): Promise<TriviaQuestion[]> => {
  const prompt = `Generate a batch of ${count} unique, text-only trivia questions of normal difficulty. The theme is "${theme}".\n${JSON_ARRAY_PROMPT_INSTRUCTIONS}`;

  try {
    const result = await model.generateContent([prompt]);
    const text = await result.response.text();
    const batchData = parseAndValidateQuestionBatch(text);

    if (!batchData || batchData.length === 0) {
      throw new Error('Failed to generate a valid batch of questions from the API.');
    }

    return batchData.map(q => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5),
      questionType: 'text',
    }));
  } catch (error) {
    console.error('Error generating question batch:', error);
    const fallbackQuestion = await generateNewQuestion(theme, [], 'normal');
    return [fallbackQuestion];
  }
};

export const generateNewQuestion = async (theme: string, askedQuestions: string[], difficulty: 'normal' | 'hard'): Promise<TriviaQuestion> => {
  const isVisual = Math.random() < VISUAL_QUESTION_CHANCE && difficulty === 'normal';

  try {
    let questionData: TriviaQuestion | null = null;

    if (isVisual) {
      const subjectModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-04-17' });
      const subjectResult = await subjectModel.generateContent([
        `Give me a single, specific, well-known noun (a person, place, or thing) that fits the trivia theme "${theme}". The noun should be visually distinct. Respond with only the noun.`
      ]);
      const subject = (await subjectResult.response.text()).trim();

      const imageModel = genAI.getGenerativeModel({ model: 'imagen-3.0-generate-002' });
      const imageResult = await imageModel.generateContent([
        `A clear, high-quality, photorealistic image of: ${subject}.`
      ]);

      const base64Image = imageResult.response.parts?.[0]?.inlineData?.data;

      if (base64Image) {
        const imagePart = { inlineData: { mimeType: 'image/jpeg', data: base64Image } };
        const questionPromptContents = [
          { text: `Based on the provided image, generate a trivia question whose correct answer is "${subject}". The general theme is "${theme}".\nDo not ask a question that is on this list: [${askedQuestions.join(', ')}].\n${JSON_PROMPT_INSTRUCTIONS}` },
          imagePart,
        ];

        const questionResult = await model.generateContent({ parts: questionPromptContents });
        const questionText = await questionResult.response.text();
        questionData = parseAndValidateQuestion(questionText);

        if (questionData) {
          questionData.questionType = 'visual';
          questionData.imageUrl = `data:image/jpeg;base64,${base64Image}`;
        }
      }
    }

    if (!questionData) {
      const prompt = `${difficulty === 'hard' ? 'Generate a VERY HARD trivia question.' : 'Generate a trivia question of normal difficulty.'} The theme is "${theme}".\nDo not ask a question that is on this list: [${askedQuestions.join(', ')}].\n${JSON_PROMPT_INSTRUCTIONS}`;
      const result = await model.generateContent([prompt]);
      const text = await result.response.text();
      questionData = parseAndValidateQuestion(text);
      if (questionData) {
        questionData.questionType = 'text';
      }
    }

    if (!questionData) {
      throw new Error('Failed to generate a valid question from the API.');
    }

    return {
      ...questionData,
      options: [...questionData.options].sort(() => Math.random() - 0.5),
    };
  } catch (error) {
    console.error('Error generating trivia question:', error);
    throw new Error('Failed to communicate with the Gemini API or parse its response.');
  }
};

const JSON_PROMPT_INSTRUCTIONS = `
Respond ONLY with a valid, parseable JSON object adhering strictly to this format:
{
  "category": "string",
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "correctAnswer": "string"
}

Key rules:
- Response must only include the JSON object (no text or markdown fences).
- The 'options' array must contain exactly 4 string elements.
- 'correctAnswer' must exactly match one of the 'options'.
- No trailing commas.
`;

const JSON_ARRAY_PROMPT_INSTRUCTIONS = `
Respond ONLY with a valid, parseable JSON array of objects, where each object adheres strictly to this format:
{
  "category": "string",
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "correctAnswer": "string"
}

Key rules:
- Response must only include the JSON array (no text or markdown fences).
- Each 'options' array must contain exactly 4 strings.
- 'correctAnswer' must exactly match one of the options.
- No trailing commas.
`;

const parseAndValidateQuestion = (jsonStr: string): TriviaQuestion | null => {
  let clean = jsonStr.trim().replace(/^```\w*\n?|```$/g, '');
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  clean = clean.slice(firstBrace, lastBrace + 1).replace(/,\s*([}\]])/g, '$1');

  try {
    const parsed = JSON.parse(clean);
    if (
      parsed.category &&
      parsed.question &&
      Array.isArray(parsed.options) &&
      parsed.options.length === 4 &&
      parsed.correctAnswer &&
      parsed.options.includes(parsed.correctAnswer)
    ) {
      return parsed as TriviaQuestion;
    }
    return null;
  } catch {
    return null;
  }
};

const parseAndValidateQuestionBatch = (jsonStr: string): TriviaQuestion[] | null => {
  let clean = jsonStr.trim().replace(/^```\w*\n?|```$/g, '');
  const firstBracket = clean.indexOf('[');
  const lastBracket = clean.lastIndexOf(']');
  if (firstBracket === -1 || lastBracket <= firstBracket) return null;
  clean = clean.slice(firstBracket, lastBracket + 1).replace(/,\s*([}\]])/g, '$1');

  try {
    const parsed = JSON.parse(clean);
    if (!Array.isArray(parsed)) return null;
    const valid = parsed.filter(q =>
      q.category &&
      q.question &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      q.correctAnswer &&
      q.options.includes(q.correctAnswer)
    );
    return valid.length > 0 ? (valid as TriviaQuestion[]) : null;
  } catch {
    return null;
  }
};

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable not set');
}
