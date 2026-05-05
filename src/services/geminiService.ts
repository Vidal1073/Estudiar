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
      description: "Exactament 4 opcions de resposta"
    },
    correctAnswerIndex: { type: Type.INTEGER, description: "Índex de la resposta correcta (0-3)" },
    explanation: { type: Type.STRING, description: "Explicació breu de la resposta correcta" }
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
      Basant-te en el següent text, genera exactament ${count} preguntes d'opció múltiple per a un qüestionari d'estudi en ${langNames[language]}.
      
      REQUISITS CRÍTICS:
      1. Cada pregunta ha de tenir exactament 4 opcions.
      2. La resposta correcta ha d'estar identificada pel seu índex (0-3).
      3. Proporciona una explicació útil.
      4. NO repeteixis preguntes similars a aquestes: ${previousQuestions.length > 0 ? previousQuestions.join("\n") : "Cap"}.
      5. L'idioma de SORTIDA (preguntes, opcions i explicacions) ha de ser EXCLUSIVAMENT ${langNames[language]}.
      
      Contingut del Document:
      ${text.slice(0, 25000)}
    `;

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" }); // Actualitzat a versió estable
    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: quizSchema as any,
        temperature: 0.7,
      },
    });

    const result = JSON.parse(response.response.text() || "[]") as Question[];
    return result;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("No s'han pogut generar les preguntes. Revisa la teva API Key.");
  }
}
