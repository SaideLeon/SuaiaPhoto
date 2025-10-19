import React, { useState, ChangeEvent, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Loader from './components/Loader';
import { PROMPT_TEMPLATES, DEFAULT_IMAGE_URL } from './constants';
import { editImageWithGemini } from './services/geminiService';
import type { Gender, PromptTemplate } from './types';

// Helper para converter um objeto File em uma Data URL Base64
const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Helper para converter uma Data URL Base64 de volta para um objeto File
const dataURLtoFile = (dataUrl: string, filename: string): File | null => {
  try {
    const arr = dataUrl.split(',');
    if (arr.length < 2) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  } catch (e) {
    console.error("Erro ao converter data URL para arquivo:", e);
    return null;
  }
};

const STORAGE_KEY = 'suaiaPhotoAppState';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(DEFAULT_IMAGE_URL);
  const [clothingImageFile, setClothingImageFile] = useState<File | null>(null);
  const [clothingImagePreviewUrl, setClothingImagePreviewUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate>(PROMPT_TEMPLATES[0]);
  const [gender, setGender] = useState<Gender>('feminino');
  const [customClothing, setCustomClothing] = useState<string>('');

  // Efeito para carregar o estado do localStorage na montagem inicial do componente
  useEffect(() => {
    const savedStateJSON = localStorage.getItem(STORAGE_KEY);
    if (savedStateJSON) {
      try {
        const savedState = JSON.parse(savedStateJSON);
        if (savedState.gender) setGender(savedState.gender);
        if (savedState.customClothing) setCustomClothing(savedState.customClothing);
        if (savedState.selectedTemplateTitle) {
          const template = PROMPT_TEMPLATES.find(t => t.title === savedState.selectedTemplateTitle);
          if (template) setSelectedTemplate(template);
        }
        if (savedState.previewUrl && savedState.previewUrl !== DEFAULT_IMAGE_URL) {
          setPreviewUrl(savedState.previewUrl);
          const file = dataURLtoFile(savedState.previewUrl, savedState.imageName || 'restored-image.png');
          if (file) {
            setImageFile(file);
          }
        }
        if (savedState.clothingImagePreviewUrl) {
            setClothingImagePreviewUrl(savedState.clothingImagePreviewUrl);
            const file = dataURLtoFile(savedState.clothingImagePreviewUrl, savedState.clothingImageName || 'restored-clothing-image.png');
            if (file) {
                setClothingImageFile(file);
            }
        }
      } catch (e) {
        console.error("Falha ao carregar ou analisar o estado do localStorage", e);
        localStorage.removeItem(STORAGE_KEY); // Limpa estado corrompido
      }
    }
  }, []);

  // Efeito para salvar o estado no localStorage sempre que ele mudar
  useEffect(() => {
    const handler = setTimeout(() => {
      if (previewUrl === DEFAULT_IMAGE_URL && !imageFile) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      
      const stateToSave = {
        gender,
        customClothing,
        selectedTemplateTitle: selectedTemplate.title,
        previewUrl: previewUrl,
        imageName: imageFile?.name,
        clothingImagePreviewUrl: clothingImagePreviewUrl,
        clothingImageName: clothingImageFile?.name,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }, 100);

    return () => clearTimeout(handler);
  }, [gender, customClothing, selectedTemplate, previewUrl, imageFile, clothingImagePreviewUrl, clothingImageFile]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      fileToDataURL(file).then(dataUrl => {
        setPreviewUrl(dataUrl);
        setImageFile(file);
        setGeneratedImageUrl(null);
        setError(null);
      });
    }
  };

  const handleClothingImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        fileToDataURL(file).then(dataUrl => {
            setClothingImagePreviewUrl(dataUrl);
            setClothingImageFile(file);
            setCustomClothing(''); // Limpa texto para evitar confusão
        });
    }
  };

  const handleRemoveClothingImage = () => {
    setClothingImageFile(null);
    setClothingImagePreviewUrl(null);
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
      const prompt = selectedTemplate.prompt(gender, customClothing || undefined, !!clothingImageFile);
      const resultUrl = await editImageWithGemini(imageFile, clothingImageFile, prompt);
      
      setGeneratedImageUrl(resultUrl);
      setPreviewUrl(resultUrl);
      const newFileName = `edited-${imageFile.name || 'image.png'}`;
      const newFile = dataURLtoFile(resultUrl, newFileName);
      if (newFile) {
        setImageFile(newFile);
      }
      
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
  }, [imageFile, clothingImageFile, selectedTemplate, gender, customClothing]);

  return (
    <div className="bg-gray-900 h-screen text-white font-sans flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar: Controles & Input */}
        <div className="w-full md:w-[400px] flex-shrink-0 bg-gray-800 p-6 flex flex-col gap-6 overflow-y-auto">
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
            <label className="block text-lg font-medium text-gray-300 mb-2">
              2. Escolha um Estilo
            </label>
            <div className="grid grid-cols-2 gap-3">
              {PROMPT_TEMPLATES.map(template => (
                <button
                  key={template.title}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-3 h-full rounded-lg text-sm text-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500
                    ${selectedTemplate.title === template.title
                      ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
                      : 'bg-gray-700 hover:bg-gray-600'
                    }`
                  }
                >
                  {template.title}
                </button>
              ))}
            </div>
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
              onChange={(e) => {
                setCustomClothing(e.target.value);
                if (e.target.value && clothingImageFile) {
                    handleRemoveClothingImage();
                }
              }}
              placeholder="Ex: um vestido vermelho elegante"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">Deixe em branco para usar a roupa padrão do estilo.</p>
          </div>

          <div>
            <label htmlFor="clothing-image-upload" className="block text-lg font-medium text-gray-300 mb-2">
              5. Usar Roupa de uma Imagem (Opcional)
            </label>
            <input
              id="clothing-image-upload"
              type="file"
              accept="image/*"
              onChange={handleClothingImageChange}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600 cursor-pointer"
            />
            {clothingImagePreviewUrl && (
                <div className="mt-4 relative w-24">
                    <img src={clothingImagePreviewUrl} alt="Pré-visualização da roupa" className="rounded-lg w-full h-auto" />
                    <button onClick={handleRemoveClothingImage} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 text-xs w-6 h-6 flex items-center justify-center font-bold">
                        X
                    </button>
                </div>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !imageFile}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform hover:scale-105 mt-auto"
          >
            {isLoading ? 'Gerando...' : 'Gerar Imagem'}
          </button>
        </div>

        {/* Conteúdo Principal: Pré-visualização & Resultado */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center min-h-0">
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
      </main>
    </div>
  );
};

export default App;
