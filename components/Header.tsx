import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900/30 backdrop-blur-lg text-center p-4 md:p-6 border-b border-white/10">
      <h1 className="text-3xl md:text-4xl font-semibold text-slate-50">
        LuxiaEstudio
      </h1>
      <p className="text-slate-300 font-light mt-1 md:mt-2 text-sm md:text-base">
        Envie sua imagem, escolha um estilo e deixe a mágica acontecer.
      </p>
    </header>
  );
};

export default Header;
