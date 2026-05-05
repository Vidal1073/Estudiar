import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, GraduationCap, Timer } from 'lucide-react';
import { Question, Language } from '../types';
import { cn } from '../lib/utils';
import { TRANSLATIONS } from '../constants';

interface QuizEngineProps {
  questions: Question[];
  onComplete: (answers: number[]) => void;
  language: Language;
}

export function QuizEngine({ questions, onComplete, language }: QuizEngineProps) {
  const t = TRANSLATIONS[language];
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<number[]>(new Array(questions.length).fill(-1));
  const [startTime] = React.useState(Date.now());
  const [elapsedTime, setElapsedTime] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const handleSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 flex flex-col items-center">
      {/* Header Stats */}
      <div className="w-full flex items-center justify-between px-8 py-5 bg-white rounded-2xl border border-natural-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="px-4 py-1.5 bg-natural-surface rounded-full text-[10px] font-black text-natural-accent tracking-[0.2em] uppercase">
            {t.questionOf.replace('{current}', (currentIndex + 1).toString()).replace('{total}', questions.length.toString())}
          </div>
        </div>
        <div className="flex items-center gap-3 text-natural-muted">
           <Timer className="w-4 h-4" />
           <span className="text-sm font-mono font-bold">{formatTime(elapsedTime)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-natural-border rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-natural-accent"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 40, damping: 15 }}
        />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          className="w-full bg-white rounded-[40px] p-12 border border-natural-border shadow-sm space-y-10"
        >
          <h2 className="text-3xl font-serif text-natural-heading leading-tight max-w-4xl">
            {currentQuestion.question}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={cn(
                  "p-6 text-left rounded-2xl border-2 transition-all duration-300 group flex items-start gap-5",
                  answers[currentIndex] === idx
                    ? "bg-natural-surface border-natural-accent ring-8 ring-natural-surface/30"
                    : "bg-white border-natural-border hover:border-natural-accent hover:bg-natural-bg/30"
                )}
              >
                <div className={cn(
                  "flex-shrink-0 w-7 h-7 rounded-full border-2 transition-colors flex items-center justify-center",
                  answers[currentIndex] === idx
                    ? "border-natural-accent bg-natural-accent"
                    : "border-natural-border group-hover:border-natural-accent"
                )}>
                    {answers[currentIndex] === idx && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className={cn(
                  "text-lg transition-colors",
                  answers[currentIndex] === idx ? "font-bold text-natural-heading" : "text-natural-text"
                )}>
                  {option}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="w-full flex items-center justify-between gap-6 pt-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={cn(
            "px-8 py-4 rounded-xl border-2 border-natural-border font-bold text-natural-muted transition-all uppercase tracking-widest text-[10px]",
            currentIndex === 0 
              ? "opacity-30 cursor-not-allowed" 
              : "bg-white hover:bg-natural-surface hover:text-natural-text"
          )}
        >
          {t.previous}
        </button>

        <button
          onClick={handleNext}
          disabled={answers[currentIndex] === -1}
          className={cn(
            "flex-1 py-5 px-10 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all",
            answers[currentIndex] === -1
              ? "bg-natural-border text-natural-muted cursor-not-allowed"
              : "bg-natural-heading text-white hover:bg-natural-text shadow-xl shadow-natural-heading/20 active:scale-[0.98]"
          )}
        >
          {currentIndex === questions.length - 1 ? t.complete : t.next}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
