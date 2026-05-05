import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, RefreshCcw, PartyPopper, ArrowRight, Info } from 'lucide-react';
import { Question, Language } from '../types';
import { cn } from '../lib/utils';
import { TRANSLATIONS } from '../constants';

interface ResultsViewProps {
  questions: Question[];
  userAnswers: number[];
  onRetry: () => void;
  onRestart: () => void;
  language: Language;
}

export function ResultsView({ questions, userAnswers, onRetry, onRestart, language }: ResultsViewProps) {
  const t = TRANSLATIONS[language];
  const score = questions.reduce((acc, q, idx) => (userAnswers[idx] === q.correctAnswerIndex ? acc + 1 : acc), 0);
  const isPerfect = score === questions.length;
  const accuracy = Math.round((score / questions.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto space-y-12 pb-20 px-4"
    >
      {/* Mastery Summary Card */}
      <div className={cn(
        "relative overflow-hidden rounded-[3rem] p-16 text-center border shadow-sm",
        isPerfect 
          ? "bg-natural-accent border-natural-accent text-white" 
          : "bg-white border-natural-border text-natural-text"
      )}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 space-y-6"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">{t.resultAnalysis}</span>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-7xl font-serif font-black">{score}<span className="text-3xl opacity-40 ml-1">/{questions.length}</span></p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-2">{t.score}</p>
            </div>
            <div className="w-[1px] h-20 bg-current opacity-20" />
            <div className="text-center">
              <p className="text-7xl font-serif font-bold">{accuracy}<span className="text-3xl opacity-40 ml-1">%</span></p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-2">{t.accuracy}</p>
            </div>
          </div>
          <p className="text-xl font-medium max-w-md mx-auto leading-relaxed">
            {isPerfect 
              ? t.perfectMessage 
              : t.retryMessage}
          </p>
          
          {isPerfect && (
             <div className="flex justify-center pt-4">
                <PartyPopper className="w-12 h-12" />
             </div>
          )}
        </motion.div>
      </div>

      {!isPerfect && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Review List */}
          <div className="md:col-span-2 space-y-8">
            <h2 className="text-sm font-black text-natural-heading uppercase tracking-widest flex items-center gap-4">
              <span className="p-1 px-1"><Info className="w-5 h-5" /></span>
              {t.insights}
            </h2>
            <div className="space-y-6 max-h-[800px] overflow-y-auto pr-6 custom-scrollbar">
              {questions.map((q, idx) => {
                const isCorrect = userAnswers[idx] === q.correctAnswerIndex;
                if (isCorrect) return null;
                
                return (
                  <motion.div 
                    key={q.id || idx}
                    className="p-8 bg-white rounded-[2.5rem] border border-natural-border space-y-6 shadow-sm"
                  >
                    <div className="flex items-start gap-5">
                      <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                         <XCircle className="w-5 h-5" />
                      </div>
                      <div className="space-y-6 flex-1">
                        <p className="text-xl font-serif text-natural-heading leading-snug">{q.question}</p>
                        
                        <div className="grid grid-cols-1 gap-3">
                          <div className="p-4 bg-natural-bg text-natural-text rounded-2xl text-sm font-medium border border-natural-border">
                            <span className="text-[10px] font-black uppercase tracking-widest block mb-1 opacity-50">{t.providedAnswer}</span>
                            {q.options[userAnswers[idx]] || "No selection"}
                          </div>
                          <div className="p-4 bg-natural-surface text-natural-accent rounded-2xl text-sm font-bold border border-natural-accent/20">
                            <span className="text-[10px] font-black uppercase tracking-widest block mb-1 opacity-60">{t.correctResponse}</span>
                            {q.options[q.correctAnswerIndex]}
                          </div>
                        </div>
                        
                        <div className="p-5 bg-natural-surface/50 rounded-2xl text-xs text-natural-muted leading-relaxed font-medium">
                          {q.explanation}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Action Sidebar */}
          <aside className="space-y-6 sticky top-24">
            <div className="bg-natural-heading rounded-[2rem] p-8 text-white space-y-8 shadow-xl shadow-natural-heading/20">
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-serif">{t.continueMastery}</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {t.masterySub.replace('{count}', questions.length.toString())}
                </p>
              </div>
              
              <button
                onClick={onRetry}
                className="w-full py-4 px-6 bg-natural-accent text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-natural-accent/90 transition-all active:scale-95"
              >
                {t.launchNew}
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onRestart}
              className="w-full py-5 px-8 bg-white border border-natural-border text-natural-muted rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:text-natural-heading hover:bg-natural-bg transition-colors"
            >
              {t.studyNew}
            </button>
          </aside>
        </div>
      )}

      {isPerfect && (
        <div className="flex flex-col items-center space-y-10 py-12">
           <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif font-black text-natural-heading">{t.objectivePerfected}</h2>
              <p className="text-natural-muted max-w-xs font-medium">{t.perfectSummary}</p>
           </div>
           
           <button
            onClick={onRestart}
            className="group py-5 px-16 bg-natural-heading text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-natural-text transition-all shadow-xl shadow-natural-heading/20"
          >
            {t.studyNext}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
