import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-gray-900/80 backdrop-blur-sm text-center p-6 border-b border-gray-700">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        SuaíaPhoto
      </h1>
      <p className="text-gray-400 mt-2">
        Envie sua imagem, escolha um estilo e deixe a mágica acontecer.
      </p>
    </header>
  );
};

export default Header;
