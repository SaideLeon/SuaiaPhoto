
import React, { useState, ChangeEvent, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Loader from './components/Loader';
import ZoomableImage from './components/ZoomableImage';
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

const ASPECT_RATIO_OPTIONS = [
    { label: 'Quadrado', value: '1:1', icon: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H20V20H4V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { label: 'Story', value: '9:16', icon: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 3H17C17.5523 3 18 3.44772 18 4V20C18 20.5523 17.5523 21 17 21H7C6.44772 21 6 20.5523 6 20V4C6 3.44772 6.44772 3 7 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { label: 'Pin', value: '2:3', icon: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 2H18C19.1046 2 20 2.89543 20 4V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { label: 'Widescreen', value: '16:9', icon: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7V17C3 17.5523 3.44772 18 4 18H20C20.5523 18 21 17.5523 21 17V7C21 6.44772 20.5523 6 20 6H4C3.44772 6 3 6.44772 3 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(DEFAULT_IMAGE_URL);
  const [clothingImageFile, setClothingImageFile] = useState<File | null>(null);
  const [clothingImagePreviewUrl, setClothingImagePreviewUrl] = useState<string | null>(null);
  const [hairstyleImageFile, setHairstyleImageFile] = useState<File | null>(null);
  const [hairstyleImagePreviewUrl, setHairstyleImagePreviewUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate>(PROMPT_TEMPLATES[0]);
  const [gender, setGender] = useState<Gender>('feminino');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [customClothing, setCustomClothing] = useState<string>('');
  const [marketingText, setMarketingText] = useState<string>('');
  const [canShare, setCanShare] = useState<boolean>(false);


  // Efeito para carregar o estado do localStorage na montagem inicial do componente
  useEffect(() => {
    const savedStateJSON = localStorage.getItem(STORAGE_KEY);
    if (savedStateJSON) {
      try {
        const savedState = JSON.parse(savedStateJSON);
        if (savedState.gender) setGender(savedState.gender);
        if (savedState.aspectRatio) setAspectRatio(savedState.aspectRatio);
        if (savedState.customClothing) setCustomClothing(savedState.customClothing);
        if (savedState.marketingText) setMarketingText(savedState.marketingText);
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
        if (savedState.hairstyleImagePreviewUrl) {
          setHairstyleImagePreviewUrl(savedState.hairstyleImagePreviewUrl);
          const file = dataURLtoFile(savedState.hairstyleImagePreviewUrl, savedState.hairstyleImageName || 'restored-hairstyle-image.png');
          if (file) {
            setHairstyleImageFile(file);
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
        aspectRatio,
        customClothing,
        marketingText,
        selectedTemplateTitle: selectedTemplate.title,
        previewUrl: previewUrl,
        imageName: imageFile?.name,
        clothingImagePreviewUrl: clothingImagePreviewUrl,
        clothingImageName: clothingImageFile?.name,
        hairstyleImagePreviewUrl: hairstyleImagePreviewUrl,
        hairstyleImageName: hairstyleImageFile?.name,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }, 100);

    return () => clearTimeout(handler);
  }, [gender, aspectRatio, customClothing, selectedTemplate, previewUrl, imageFile, clothingImagePreviewUrl, clothingImageFile, hairstyleImagePreviewUrl, hairstyleImageFile, marketingText]);

  // Efeito para verificar o suporte à API de Compartilhamento Web
  useEffect(() => {
    if (navigator.share && navigator.canShare) {
      // É necessário um arquivo de teste para verificar se o compartilhamento de arquivos é suportado
      const dummyFile = new File([""], "dummy.png", { type: "image/png" });
      if (navigator.canShare({ files: [dummyFile] })) {
        setCanShare(true);
      }
    }
  }, []);

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

  const handleHairstyleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        fileToDataURL(file).then(dataUrl => {
            setHairstyleImagePreviewUrl(dataUrl);
            setHairstyleImageFile(file);
        });
    }
  };

  const handleRemoveHairstyleImage = () => {
    setHairstyleImageFile(null);
    setHairstyleImagePreviewUrl(null);
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
      const prompt = selectedTemplate.prompt(gender, customClothing || undefined, !!clothingImageFile, !!hairstyleImageFile, marketingText || undefined, aspectRatio);
      const resultUrl = await editImageWithGemini(imageFile, clothingImageFile, hairstyleImageFile, prompt);
      
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
  }, [imageFile, clothingImageFile, hairstyleImageFile, selectedTemplate, gender, customClothing, marketingText, aspectRatio]);
  
  const handleShare = async () => {
    if (!generatedImageUrl) return;

    const file = dataURLtoFile(generatedImageUrl, 'imagem-gerada-pelo-suaiaphoto.png');
    if (!file) {
      setError('Não foi possível criar o arquivo para compartilhamento.');
      return;
    }

    if (canShare) {
      try {
        await navigator.share({
          files: [file],
          title: 'Minha Criação SuaíaPhoto',
          text: 'Veja a imagem que criei com o SuaíaPhoto!',
        });
      } catch (err) {
        // Ignora o erro se o usuário simplesmente cancelou o compartilhamento
        if ((err as Error).name !== 'AbortError') {
          console.error('Erro ao compartilhar:', err);
          setError('Ocorreu um erro ao tentar compartilhar a imagem.');
        }
      }
    } else {
      setError('Seu navegador não suporta o compartilhamento de arquivos.');
    }
  };

  const isMarketingTemplate = selectedTemplate.title === 'Visionário de Marketing (Contratando)';
  const isPosterTemplate = selectedTemplate.title === 'Pôster de Moda (Vermelho)';
  const hasCustomTextInput = isMarketingTemplate || isPosterTemplate;
  
  const baseStepNumber = 3;
  const customTextStep = hasCustomTextInput ? 1 : 0;


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
              2. Formato da Imagem
            </label>
            <div className="grid grid-cols-4 gap-2">
                {ASPECT_RATIO_OPTIONS.map(option => (
                    <button
                        key={option.value}
                        onClick={() => setAspectRatio(option.value)}
                        className={`p-2 flex flex-col items-center justify-center gap-1 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500
                        ${aspectRatio === option.value
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        title={`${option.label} (${option.value})`}
                    >
                        <div className="w-6 h-6">{option.icon}</div>
                        <span>{option.label}</span>
                    </button>
                ))}
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              {baseStepNumber}. Escolha um Estilo
            </label>
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
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
              {baseStepNumber + 1}. Gênero
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
          
          {hasCustomTextInput && (
            <div>
              <label htmlFor="marketing-text" className="block text-lg font-medium text-gray-300 mb-2">
                {baseStepNumber + 2}. Texto da Imagem (Opcional)
              </label>
              <textarea
                id="marketing-text"
                rows={3}
                value={marketingText}
                onChange={(e) => setMarketingText(e.target.value)}
                placeholder={isPosterTemplate ? "Ex: MAKE IT HAPPEN." : "Ex: WE'RE HIRING, com 'HIRING' em destaque"}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">Deixe em branco para o texto padrão.</p>
            </div>
          )}

          <div>
            <label htmlFor="custom-clothing" className="block text-lg font-medium text-gray-300 mb-2">
              {baseStepNumber + 2 + customTextStep}. Roupas (Opcional)
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
             {baseStepNumber + 3 + customTextStep}. Usar Roupa de uma Imagem (Opcional)
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

          <div>
            <label htmlFor="hairstyle-image-upload" className="block text-lg font-medium text-gray-300 mb-2">
              {baseStepNumber + 4 + customTextStep}. Usar Cabelo de uma Imagem (Opcional)
            </label>
            <input
              id="hairstyle-image-upload"
              type="file"
              accept="image/*"
              onChange={handleHairstyleImageChange}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-500 file:text-white hover:file:bg-pink-600 cursor-pointer"
            />
            {hairstyleImagePreviewUrl && (
                <div className="mt-4 relative w-24">
                    <img src={hairstyleImagePreviewUrl} alt="Pré-visualização do cabelo" className="rounded-lg w-full h-auto" />
                    <button onClick={handleRemoveHairstyleImage} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 text-xs w-6 h-6 flex items-center justify-center font-bold">
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
          <h2 className="text-2xl font-semibold mb-2 text-center">Sua Criação</h2>
          <p className="text-gray-500 text-sm mb-4 text-center">Use o scroll do mouse ou o gesto de pinça para dar zoom.</p>
          {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

          <div className="w-full max-w-md aspect-square relative bg-gray-950 rounded-lg shadow-lg">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader />
              </div>
            ) : (
              <ZoomableImage
                src={generatedImageUrl || previewUrl}
                alt={generatedImageUrl ? 'Imagem Gerada' : 'Pré-visualização'}
              />
            )}
          </div>
          {generatedImageUrl && !isLoading && (
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <a
                href={generatedImageUrl}
                download="imagem-gerada.png"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Salvar Imagem
              </a>
              {canShare && (
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  Compartilhar
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;