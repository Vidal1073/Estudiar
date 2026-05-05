/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { extractTextFromFile } from './lib/documentParser';
import { generateQuiz } from './services/geminiService';
import { AppState, QuestionCount, QuizSession, Language } from './types';
import { FileUploader } from './components/FileUploader';
import { QuestionnaireConfig } from './components/QuestionnaireConfig';
import { QuizEngine } from './components/QuizEngine';
import { ResultsView } from './components/ResultsView';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, GraduationCap, Github, Globe } from 'lucide-react';
import { cn } from './lib/utils';
import { TRANSLATIONS } from './constants';

export default function App() {
  const [state, setState] = React.useState<AppState>({
    documentText: '',
    sourceName: '',
    questionCount: 15,
    language: 'ca', // Default to Catalan as requested
    currentQuiz: null,
    history: [],
    isLoading: false,
    error: null,
  });

  const t = TRANSLATIONS[state.language];

  const handleLanguageChange = (lang: Language) => {
    setState(prev => ({ ...prev, language: lang }));
  };

  const handleFileSelect = async (file: File) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const text = await extractTextFromFile(file);
      setState(prev => ({ 
        ...prev, 
        documentText: text, 
        sourceName: file.name,
        isLoading: false 
      }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: err instanceof Error ? err.message : t.errorTitle 
      }));
    }
  };

  const startQuiz = async (count: QuestionCount) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, questionCount: count }));
    try {
      const questions = await generateQuiz(state.documentText, count, state.history, state.language);
      
      const newQuiz: QuizSession = {
        questions,
        userAnswers: new Array(questions.length).fill(-1),
        score: 0,
        completed: false,
      };

      // Add new questions to history to avoid repetition later
      const newHistory = [...state.history, ...questions.map(q => q.question)];

      setState(prev => ({ 
        ...prev, 
        currentQuiz: newQuiz, 
        history: newHistory,
        isLoading: false 
      }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: err instanceof Error ? err.message : t.errorTitle 
      }));
    }
  };

  const handleQuizComplete = (answers: number[]) => {
    if (!state.currentQuiz) return;

    const score = state.currentQuiz.questions.reduce((acc, q, idx) => 
      (answers[idx] === q.correctAnswerIndex ? acc + 1 : acc), 0
    );

    setState(prev => ({
      ...prev,
      currentQuiz: prev.currentQuiz ? {
        ...prev.currentQuiz,
        userAnswers: answers,
        score,
        completed: true
      } : null
    }));
  };

  const handleRetry = () => {
    // Generate new questions using the same count
    startQuiz(state.questionCount);
  };

  const handleRestart = () => {
    setState(prev => ({
      ...prev,
      documentText: '',
      sourceName: '',
      questionCount: 15,
      currentQuiz: null,
      history: [],
      isLoading: false,
      error: null,
    }));
  };

  const renderContent = () => {
    if (state.error) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8 bg-red-50 border-2 border-red-100 rounded-3xl text-center space-y-4 max-w-lg mx-auto"
        >
          <div className="flex justify-center text-red-500">
            <BookOpen className="w-12 h-12" />
          </div>
          <h2 className="text-xl font-bold text-red-900">{t.errorTitle}</h2>
          <p className="text-red-700 font-medium">{state.error}</p>
          <button 
            onClick={handleRestart}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
          >
            {t.tryAgain}
          </button>
        </motion.div>
      );
    }

    if (!state.documentText) {
      return <FileUploader onFileSelect={handleFileSelect} isProcessing={state.isLoading} language={state.language} />;
    }

    if (!state.currentQuiz) {
      return (
        <QuestionnaireConfig 
          onStart={startQuiz} 
          isLoading={state.isLoading} 
          sourceName={state.sourceName} 
          language={state.language}
        />
      );
    }

    if (state.currentQuiz.completed) {
      return (
        <ResultsView 
          questions={state.currentQuiz.questions}
          userAnswers={state.currentQuiz.userAnswers}
          onRetry={handleRetry}
          onRestart={handleRestart}
          language={state.language}
        />
      );
    }

    return (
      <QuizEngine 
        questions={state.currentQuiz.questions} 
        onComplete={handleQuizComplete} 
        language={state.language}
      />
    );
  };

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text font-sans flex flex-col">
      {/* Header Navigation */}
      <header className="h-20 px-8 flex items-center justify-between bg-white border-b border-natural-border sticky top-0 z-50">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={handleRestart}
        >
          <div className="w-10 h-10 bg-natural-accent rounded-xl flex items-center justify-center text-white transition-transform group-hover:rotate-6">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-natural-heading">{t.appName}</span>
        </div>
        
        <div className="flex items-center gap-8">
          {state.sourceName && (
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-natural-muted font-black">{t.docSource}</span>
              <span className="text-sm font-bold max-w-[200px] truncate underline decoration-natural-accent/30 underline-offset-4">{state.sourceName}</span>
            </div>
          )}

          {/* Language Switcher */}
          <div className="flex items-center gap-2 p-1 bg-natural-surface rounded-xl border border-natural-border">
             <button 
               onClick={() => handleLanguageChange('ca')}
               className={cn(
                 "w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all",
                 state.language === 'ca' ? "bg-white shadow-sm scale-110" : "grayscale opacity-50 hover:grayscale-0 hover:opacity-100"
               )}
               title="Català"
             >
               🇦🇩
             </button>
             <button 
               onClick={() => handleLanguageChange('en')}
               className={cn(
                 "w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all",
                 state.language === 'en' ? "bg-white shadow-sm scale-110" : "grayscale opacity-50 hover:grayscale-0 hover:opacity-100"
               )}
               title="English"
             >
               🇺🇸
             </button>
             <button 
               onClick={() => handleLanguageChange('es')}
               className={cn(
                 "w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all",
                 state.language === 'es' ? "bg-white shadow-sm scale-110" : "grayscale opacity-50 hover:grayscale-0 hover:opacity-100"
               )}
               title="Español"
             >
               🇪🇸
             </button>
          </div>

          <div className="w-12 h-12 rounded-full bg-natural-surface border border-natural-border flex items-center justify-center text-natural-accent">
            {state.sourceName ? <BookOpen className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-8 md:p-12 gap-8">
         <AnimatePresence mode="wait">
            {renderContent()}
         </AnimatePresence>
      </main>

      {/* Footer Status */}
      <footer className="h-16 px-8 flex items-center justify-center bg-natural-border text-[10px] uppercase tracking-[0.3em] font-black text-natural-accent">
        {t.tagline}
      </footer>
    </div>
  );
}
