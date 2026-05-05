import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuestionCount } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const questionSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    question: { type: Type.STRING },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Exactly 4 multiple choice options"
    },
    correctAnswerIndex: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
    explanation: { type: Type.STRING, description: "Brief explanation of why the answer is correct" }
  },
  required: ["id", "question", "options", "correctAnswerIndex", "explanation"]
};

const quizSchema = {
  type: Type.ARRAY,
  items: questionSchema
};

export async function generateQuiz(
  text: string, 
  count: QuestionCount, 
  previousQuestions: string[] = [],
  language: 'ca' | 'en' | 'es' = 'en'
): Promise<Question[]> {
  try {
    const langNames = { ca: "Catalan", en: "English", es: "Spanish" };
    const prompt = `
      Based on the following document content, generate exactly ${count} multiple-choice questions for a study questionnaire in ${langNames[language]}.
      
      CRITICAL REQUIREMENTS:
      1. Each question must have exactly 4 options.
      2. The correct answer must be clearly identified by its index (0-3).
      3. Provide a helpful explanation for the correct answer.
      4. DO NOT repeat or use questions similar to these previously seen questions:
         ${previousQuestions.length > 0 ? previousQuestions.join("\n") : "None"}
      5. Ensure the questions cover different parts of the document to ensure thorough study.
      6. The output must be a JSON array of question objects.
      7. ALL generated text (questions, options, explanations) MUST be in ${langNames[language]}.

      Document Content:
      ${text.slice(0, 30000)} // Limiting text length for token safety
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        temperature: 0.7,
      },
    });

    const result = JSON.parse(response.text || "[]") as Question[];
    return result;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate questions. Please try again.");
  }
}
