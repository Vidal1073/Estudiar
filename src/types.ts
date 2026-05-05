export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizSession {
  questions: Question[];
  userAnswers: number[]; // index of selected option, -1 if unanswered
  score: number;
  completed: boolean;
}

export type QuestionCount = 10 | 15 | 20;

export type Language = 'ca' | 'en' | 'es';

export interface AppState {
  documentText: string;
  sourceName: string;
  questionCount: QuestionCount;
  language: Language;
  currentQuiz: QuizSession | null;
  history: string[]; // List of previously asked questions to avoid duplication
  isLoading: boolean;
  error: string | null;
}
