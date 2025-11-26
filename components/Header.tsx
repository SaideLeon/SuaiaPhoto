import React from 'react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 py-3 md:px-8 md:py-4">
      <div className="flex items-center gap-4">
        <button 
            onClick={onMenuClick} 
            className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            aria-label="Abrir menu"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
        
        <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                    Luxia
                </span>
                <span className="text-slate-100">Estudio</span>
            </h1>
        </div>
      </div>
      
      <div className="hidden md:block">
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
            Powered by Gemini 2.5
        </span>
      </div>
    </header>
  );
};

export default Header;