
// FIX: The content of App.tsx was missing. This new content implements the main application component, fixing the module export error and enabling the application's functionality.
import React, { useState, ChangeEvent, useCallback } from 'react';
import Header from './components/Header';
import Loader from './components/Loader';
import { PROMPT_TEMPLATES, DEFAULT_IMAGE_URL } from './constants';
import { editImageWithGemini } from './services/geminiService';
import type { Gender, PromptTemplate } from './types';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(DEFAULT_IMAGE_URL);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate>(PROMPT_TEMPLATES[0]);
  const [gender, setGender] = useState<Gender>('feminino');
  const [customClothing, setCustomClothing] = useState<string>('');

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setGeneratedImageUrl(null);
      setError(null);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!imageFile) {
      setError("Por favor, envie uma imagem primeiro.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const prompt = selectedTemplate.prompt(gender, customClothing || undefined);
      const resultUrl = await editImageWithGemini(imageFile, prompt);
      setGeneratedImageUrl(resultUrl);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Erro ao gerar imagem: ${err.message}`);
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, selectedTemplate, gender, customClothing]);

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      <Header />
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column: Controls & Input */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col gap-6">
            <div>
              <label htmlFor="image-upload" className="block text-lg font-medium text-gray-300 mb-2">
                1. Envie sua Imagem
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <label htmlFor="template-select" className="block text-lg font-medium text-gray-300 mb-2">
                2. Escolha um Estilo
              </label>
              <select
                id="template-select"
                value={selectedTemplate.title}
                onChange={(e) => {
                  const newTemplate = PROMPT_TEMPLATES.find(t => t.title === e.target.value);
                  if (newTemplate) {
                    setSelectedTemplate(newTemplate);
                  }
                }}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
              >
                {PROMPT_TEMPLATES.map(template => (
                  <option key={template.title} value={template.title}>{template.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-300 mb-2">
                3. Gênero
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setGender('masculino')}
                  className={`px-4 py-2 rounded-lg flex-1 ${gender === 'masculino' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  Masculino
                </button>
                <button
                  onClick={() => setGender('feminino')}
                  className={`px-4 py-2 rounded-lg flex-1 ${gender === 'feminino' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  Feminino
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="custom-clothing" className="block text-lg font-medium text-gray-300 mb-2">
                4. Roupas (Opcional)
              </label>
              <input
                id="custom-clothing"
                type="text"
                value={customClothing}
                onChange={(e) => setCustomClothing(e.target.value)}
                placeholder="Ex: um vestido vermelho elegante"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">Deixe em branco para usar a roupa padrão do estilo.</p>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || !imageFile}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
            >
              {isLoading ? 'Gerando...' : 'Gerar Imagem'}
            </button>
          </div>

          {/* Right Column: Image Preview & Result */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center min-h-[500px]">
            <h2 className="text-2xl font-semibold mb-4 text-center">Sua Criação</h2>
            {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

            <div className="w-full max-w-md aspect-square relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader />
                </div>
              ) : (
                <img
                  src={generatedImageUrl || previewUrl}
                  alt={generatedImageUrl ? 'Imagem Gerada' : 'Pré-visualização'}
                  className="w-full h-full object-contain rounded-lg"
                />
              )}
            </div>
            {generatedImageUrl && !isLoading && (
              <a
                href={generatedImageUrl}
                download="imagem-gerada.png"
                className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                Baixar Imagem
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
