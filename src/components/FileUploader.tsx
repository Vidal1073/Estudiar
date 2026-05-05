import React from 'react';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  language: Language;
}

export function FileUploader({ onFileSelect, isProcessing, language }: FileUploaderProps) {
  const t = TRANSLATIONS[language];
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        className={cn(
          "relative group cursor-pointer rounded-[2.5rem] border-2 border-dashed p-16 transition-all duration-300 bg-white",
          isDragging 
            ? "border-natural-accent bg-natural-surface" 
            : "border-natural-border hover:border-natural-accent hover:bg-natural-bg/50",
          isProcessing && "opacity-50 pointer-events-none"
        )}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isProcessing && document.getElementById('file-upload')?.click()}
      >
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".pdf,.txt"
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center text-center space-y-6">
          <div className={cn(
            "p-6 rounded-2xl bg-natural-surface text-natural-accent ring-1 ring-natural-border group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300",
            isDragging && "scale-110 bg-natural-accent text-white"
          )}>
            {isProcessing ? (
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
               >
                 <Upload className="w-8 h-8" />
               </motion.div>
            ) : (
              <Upload className={cn("w-8 h-8", isDragging ? "text-white" : "text-natural-accent")} />
            )}
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl font-serif text-natural-heading">
              {isProcessing ? t.uploadProcessing : t.uploadTitle}
            </h3>
            <p className="text-natural-text/70 max-w-sm mx-auto leading-relaxed">
              {t.uploadDrop}
            </p>
          </div>

          <div className="flex items-center gap-6 text-[10px] font-bold text-natural-muted uppercase tracking-widest pt-4">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> {t.adaptive}</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> {t.poolSync}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
