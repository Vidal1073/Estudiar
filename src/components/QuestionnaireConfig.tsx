import React from 'react';
import { motion } from 'motion/react';
import { Settings2, ArrowRight } from 'lucide-react';
import { QuestionCount, Language } from '../types';
import { cn } from '../lib/utils';
import { TRANSLATIONS } from '../constants';

interface QuestionnaireConfigProps {
  onStart: (count: QuestionCount) => void;
  isLoading: boolean;
  sourceName: string;
  language: Language;
}

export function QuestionnaireConfig({ onStart, isLoading, sourceName, language }: QuestionnaireConfigProps) {
  const t = TRANSLATIONS[language];
  const [selectedCount, setSelectedCount] = React.useState<QuestionCount>(15);

  const counts: QuestionCount[] = [10, 15, 20];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-xl mx-auto space-y-8 p-10 bg-white rounded-[2.5rem] shadow-sm border border-natural-border"
    >
      <div className="flex items-center gap-4 border-b border-natural-surface pb-8">
        <div className="p-3 bg-natural-surface text-natural-accent rounded-xl">
          <Settings2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-natural-heading">{t.sessionConfig}</h2>
          <p className="text-xs text-natural-muted font-bold uppercase tracking-widest truncate max-w-[300px]">
             {sourceName}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <label className="text-[10px] uppercase tracking-widest text-natural-muted font-bold block px-1">
          {t.questionCount}
        </label>
        <div className="grid grid-cols-3 gap-3">
          {counts.map((count) => (
            <button
              key={count}
              onClick={() => setSelectedCount(count)}
              className={cn(
                "py-4 px-6 rounded-2xl font-bold transition-all duration-300 border-2",
                selectedCount === count 
                  ? "bg-natural-accent border-natural-accent text-white shadow-lg shadow-natural-accent/20" 
                  : "bg-white border-natural-border text-natural-muted hover:border-natural-accent hover:bg-natural-surface"
              )}
            >
              {count}
            </button>
          ))}
        </div>
        <p className="text-xs text-natural-muted/70 px-1 italic leading-relaxed">
          {t.questionCountSub}
        </p>
      </div>

      <button
        onClick={() => onStart(selectedCount)}
        disabled={isLoading}
        className={cn(
          "w-full py-5 px-8 bg-natural-text text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-natural-text/20",
          isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-natural-heading hover:scale-[1.02] active:scale-95"
        )}
      >
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
            />
            {t.analyzingText}
          </>
        ) : (
          <>
            {t.launchSession}
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </motion.div>
  );
}
