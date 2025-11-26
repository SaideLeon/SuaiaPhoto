import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
        <div className="relative">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping"></div>
            {/* Spinner */}
            <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-purple-500 border-l-transparent animate-spin"></div>
            </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
            <h3 className="text-xl font-medium text-white tracking-wide">Criando Arte</h3>
            <p className="text-sm text-slate-400 animate-pulse">A IA está reimaginando sua imagem...</p>
        </div>
    </div>
  );
};

export default Loader;