import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { TriviaQuestion } from '../types';
import { VISUAL_QUESTION_CHANCE } from '../constants';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const JSON_PROMPT_INSTRUCTIONS = `
Respond ONLY with a valid, parseable JSON object adhering strictly to this format:
{
  "category": "string",
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "correctAnswer": "string"
}

Key rules for your response:
- The JSON object must be the only content in your response.
- Do not wrap the JSON in markdown fences (e.g., \`\`\`json).
- Do not use trailing commas in arrays or objects.
- The 'options' array must contain exactly 4 string elements.
- The 'correctAnswer' value must be an exact match to one of the strings in the 'options' array.
`;

const JSON_ARRAY_PROMPT_INSTRUCTIONS = `
Respond ONLY with a valid, parseable JSON array of objects, where each object adheres strictly to this format:
{
  "category": "string",
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "correctAnswer": "string"
}

Key rules for your response:
- The JSON array must be the only content in your response.
- Do not wrap the JSON array in markdown fences (e.g., \`\`\`json).
- Each object in the array must have an 'options' array with exactly 4 strings.
- Each object's 'correctAnswer' must exactly match one of its 'options'.
- Do not use trailing commas.
`;

const parseAndValidateQuestion = (jsonStr: string): TriviaQuestion | null => {
    let cleanJsonStr = jsonStr.trim();
    
    // 1. Remove markdown fences
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = cleanJsonStr.match(fenceRegex);
    if (match && match[2]) {
      cleanJsonStr = match[2].trim();
    }
    
    // 2. Isolate the main JSON object to remove extraneous text outside of it
    const firstBrace = cleanJsonStr.indexOf('{');
    const lastBrace = cleanJsonStr.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
        cleanJsonStr = cleanJsonStr.substring(firstBrace, lastBrace + 1);
    }

    // 3. Aggressively clean the 'options' array, a common source of malformed content.
    // This regex finds the entire 'options' array string.
    const optionsArrayRegex = /"options"\s*:\s*\[.*?\]/s;
    const optionsMatch = cleanJsonStr.match(optionsArrayRegex);

    if (optionsMatch) {
        const originalOptionsArrayString = optionsMatch[0];
        // Find all quoted strings within the matched array string.
        const strings = originalOptionsArrayString.match(/"(?:\\.|[^"\\])*"/g) || [];
        
        // The first string is "options", the rest are the actual options.
        if (strings.length > 1) {
            const cleanedOptions = strings.slice(1).join(',');
            const reconstructedArray = `"options": [${cleanedOptions}]`;
            // Replace the original, potentially malformed array string with the clean one.
            cleanJsonStr = cleanJsonStr.replace(originalOptionsArrayString, reconstructedArray);
        }
    }
    
    // 4. Remove trailing commas, another common LLM error.
    cleanJsonStr = cleanJsonStr.replace(/,\s*([}\]])/g, '$1');

    try {
        const parsedData = JSON.parse(cleanJsonStr);

        // Final validation
        if (
            !parsedData.category ||
            !parsedData.question ||
            !Array.isArray(parsedData.options) ||
            parsedData.options.length !== 4 ||
            !parsedData.correctAnswer ||
            !parsedData.options.includes(parsedData.correctAnswer)
        ) {
            console.error("Invalid question format after parsing. Data:", parsedData);
            console.error("Original string was:", jsonStr);
            return null;
        }
        return parsedData as TriviaQuestion;
    } catch (error) {
        if (error instanceof Error && error.name === 'SyntaxError') {
             console.error("Problematic JSON string received:", jsonStr);
             console.error("Cleaned JSON string that failed to parse:", cleanJsonStr);
        }
        throw new Error("Failed to parse JSON response from API.");
    }
};

const parseAndValidateQuestionBatch = (jsonStr: string): TriviaQuestion[] | null => {
    let cleanJsonStr = jsonStr.trim();
    
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = cleanJsonStr.match(fenceRegex);
    if (match && match[2]) {
      cleanJsonStr = match[2].trim();
    }

    const firstBracket = cleanJsonStr.indexOf('[');
    const lastBracket = cleanJsonStr.lastIndexOf(']');
    if (firstBracket === -1 || lastBracket <= firstBracket) {
        console.error("Could not find a valid JSON array structure.");
        return null;
    }
    cleanJsonStr = cleanJsonStr.substring(firstBracket, lastBracket + 1);
    
    cleanJsonStr = cleanJsonStr.replace(/,\s*([}\]])/g, '$1');

    try {
        const parsedArray = JSON.parse(cleanJsonStr);

        if (!Array.isArray(parsedArray)) {
            console.error("Parsed data is not an array:", parsedArray);
            return null;
        }
        
        const validQuestions: TriviaQuestion[] = [];
        for (const item of parsedArray) {
            if (
                item.category &&
                item.question &&
                Array.isArray(item.options) &&
                item.options.length === 4 &&
                item.correctAnswer &&
                item.options.includes(item.correctAnswer)
            ) {
                validQuestions.push(item as TriviaQuestion);
            } else {
                console.warn("Skipping invalid question object in batch:", item);
            }
        }
        
        return validQuestions.length > 0 ? validQuestions : null;

    } catch (error) {
        if (error instanceof Error) {
             console.error("Problematic JSON string received:", jsonStr);
             console.error("Cleaned JSON string that failed to parse:", cleanJsonStr);
             console.error(`Error parsing batch JSON: ${error.message}`);
        }
        return null;
    }
};

export const generateTheme = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: `Generate a single, fun, and interesting trivia theme. Examples: "80s Action Movies", "Deep Sea Mysteries", "Ancient Roman History". Respond with only the theme name, no extra text or quotes.`,
        });
        return response.text.trim();
    } catch(error) {
        console.error("Failed to generate theme:", error);
        return "General Knowledge"; // Fallback theme
    }
};

export const generateQuestionBatch = async (theme: string, count: number): Promise<TriviaQuestion[]> => {
    const prompt = `Generate a batch of ${count} unique, text-only trivia questions of normal difficulty. The theme is "${theme}".\n${JSON_ARRAY_PROMPT_INSTRUCTIONS}`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
            config: { responseMimeType: "application/json", temperature: 0.7 },
        });

        const batchData = parseAndValidateQuestionBatch(response.text);

        if (!batchData || batchData.length === 0) {
            throw new Error("Failed to generate a valid batch of questions from the API.");
        }
        
        const processedBatch = batchData.map(q => ({
            ...q,
            options: [...q.options].sort(() => Math.random() - 0.5),
            questionType: 'text' as 'text' | 'visual',
        }));

        return processedBatch;

    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error generating question batch: ${error.message}`);
        } else {
            console.error("An unknown error occurred while generating question batch", error);
        }
        // Fallback to generating one question at a time if batch fails
        console.warn("Falling back to single question generation.");
        const singleQuestion = await generateNewQuestion(theme, [], 'normal');
        return [singleQuestion];
    }
};

export const generateNewQuestion = async (theme: string, askedQuestions: string[], difficulty: 'normal' | 'hard'): Promise<TriviaQuestion> => {
    const isVisual = Math.random() < VISUAL_QUESTION_CHANCE && difficulty === 'normal';

    try {
        let questionData: TriviaQuestion | null = null;
        
        if (isVisual) {
             const subjectResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash-preview-04-17',
                contents: `Give me a single, specific, well-known noun (a person, place, or thing) that fits the trivia theme "${theme}". The noun should be visually distinct and something that can be clearly depicted in an image. Examples: if theme is "Fruits", respond "Apple". If theme is "World Landmarks", respond "Eiffel Tower". Respond with only the noun.`,
                config: { temperature: 1.0 }
            });
            const subject = subjectResponse.text.trim();

            const imageResponse = await ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: `A clear, high-quality, photorealistic image of: ${subject}.`,
                config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
            });

            if (imageResponse.generatedImages?.length > 0 && imageResponse.generatedImages[0]?.image?.imageBytes) {
                const base64Image = imageResponse.generatedImages[0].image.imageBytes;
                const imagePart = { inlineData: { mimeType: 'image/jpeg', data: base64Image } };
                
                const questionPromptContents = [
                    { text: `Based on the provided image, generate a trivia question whose correct answer is "${subject}". The general theme is "${theme}".\nDo not ask a question that is on this list: [${askedQuestions.join(', ')}].\n${JSON_PROMPT_INSTRUCTIONS}`},
                    imagePart,
                ];
                
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash-preview-04-17",
                    contents: { parts: questionPromptContents },
                    config: { responseMimeType: "application/json", temperature: 0.5 },
                });
                
                questionData = parseAndValidateQuestion(response.text);
                if (questionData) {
                    questionData.questionType = 'visual';
                    questionData.imageUrl = `data:image/jpeg;base64,${base64Image}`;
                }
            } else {
                 console.warn(`Image generation for subject "${subject}" failed or returned no images. Falling back to a text question.`);
            }
        } 
        
        if (!questionData) { 
            const difficultyInstruction = difficulty === 'hard' ? 'Generate a VERY HARD trivia question.' : 'Generate a trivia question of normal difficulty.';
            const prompt = `${difficultyInstruction} The theme is "${theme}".\nDo not ask a question that is on this list: [${askedQuestions.join(', ')}].\n${JSON_PROMPT_INSTRUCTIONS}`;
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-04-17",
                contents: prompt,
                config: { responseMimeType: "application/json", temperature: 0.5 },
            });

            questionData = parseAndValidateQuestion(response.text);
            if (questionData) {
                questionData.questionType = 'text';
            }
        }

        if (!questionData) {
            throw new Error("Failed to generate a valid question from the API.");
        }

        const shuffledOptions = [...questionData.options].sort(() => Math.random() - 0.5);
        return { ...questionData, options: shuffledOptions };

    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error generating trivia question: ${error.message}`);
        } else {
            console.error("An unknown error occurred while generating trivia question", error);
        }
        throw new Error("Failed to communicate with the Gemini API or parse its response.");
    }
};