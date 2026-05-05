// ... imports anteriors
export default function App() {
  // ... lògica d'estat anterior

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text font-sans flex flex-col">
      <header className="h-20 px-8 flex items-center justify-between bg-white border-b border-natural-border sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={handleRestart}>
          <div className="w-10 h-10 bg-natural-accent rounded-xl flex items-center justify-center text-white transition-transform group-hover:rotate-6">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-natural-heading">{t.appName}</span>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 p-1 bg-natural-surface rounded-xl border border-natural-border">
            <button 
              onClick={() => handleLanguageChange('ca')}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all",
                state.language === 'ca' ? "bg-white shadow-sm scale-110" : "grayscale opacity-50 hover:grayscale-0"
              )}
              title="Català"
            >
              🇦🇩
            </button>
            <button 
              onClick={() => handleLanguageChange('en')}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all",
                state.language === 'en' ? "bg-white shadow-sm scale-110" : "grayscale opacity-50 hover:grayscale-0"
              )}
              title="English"
            >
              🇬🇧
            </button>
            <button 
              onClick={() => handleLanguageChange('es')}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all",
                state.language === 'es' ? "bg-white shadow-sm scale-110" : "grayscale opacity-50 hover:grayscale-0"
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
    </div>
  );
}
