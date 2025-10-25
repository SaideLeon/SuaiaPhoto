

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

const STORAGE_KEY = 'luxiaEstudioAppState';

const ASPECT_RATIO_OPTIONS = [
    { label: 'Quadrado', value: '1:1', icon: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H20V20H4V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { label: 'Story', value: '9:16', icon: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 3H17C17.5523 3 18 3.44772 18 4V20C18 20.5523 17.5523 21 17 21H7C6.44772 21 6 20.5523 6 20V4C6 3.44772 6.44772 3 7 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { label: 'Pin', value: '2:3', icon: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 2H18C19.1046 2 20 2.89543 20 4V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { label: 'Widescreen', value: '16:9', icon: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7V17C3 17.5523 3.44772 18 4 18H20C20.5523 18 21 17.5523 21 17V7C21 6.44772 20.5523 6 20 6H4C3.44772 6 3 6.44772 3 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(DEFAULT_IMAGE_URL);
  const [bodyImageFile, setBodyImageFile] = useState<File | null>(null);
  const [bodyImagePreviewUrl, setBodyImagePreviewUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate>(PROMPT_TEMPLATES[0]);
  const [gender, setGender] = useState<Gender>('feminino');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [customClothing, setCustomClothing] = useState<string>('');
  const [marketingText, setMarketingText] = useState<string>('');
  const [refinementPrompt, setRefinementPrompt] = useState<string>('');
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
        if (savedState.bodyImagePreviewUrl) {
            setBodyImagePreviewUrl(savedState.bodyImagePreviewUrl);
            const file = dataURLtoFile(savedState.bodyImagePreviewUrl, savedState.bodyImageName || 'restored-body-image.png');
            if (file) {
                setBodyImageFile(file);
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
        bodyImagePreviewUrl: bodyImagePreviewUrl,
        bodyImageName: bodyImageFile?.name,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }, 100);

    return () => clearTimeout(handler);
  }, [gender, aspectRatio, customClothing, selectedTemplate, previewUrl, imageFile, bodyImagePreviewUrl, bodyImageFile, marketingText]);

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
        setRefinementPrompt('');
      });
    }
  };

  const handleBodyImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        fileToDataURL(file).then(dataUrl => {
            setBodyImagePreviewUrl(dataUrl);
            setBodyImageFile(file);
            setCustomClothing(''); // Limpa texto para evitar confusão
        });
    }
  };

  const handleRemoveBodyImage = () => {
    setBodyImageFile(null);
    setBodyImagePreviewUrl(null);
  };

  const handleGenerate = useCallback(async () => {
    if (!imageFile) {
      setError("Por favor, envie uma imagem primeiro.");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      let finalPrompt: string;
      
      if (refinementPrompt.trim() !== '') {
          finalPrompt = `Edite a imagem fornecida aplicando a seguinte instrução: "${refinementPrompt}". Preserve todos os outros elementos da imagem original que não estão diretamente relacionados à instrução. Mantenha o mesmo estilo, iluminação e qualidade fotográfica. Adicione o texto minimalista da marca 'LuxiaEstudio' em uma fonte sans-serif limpa e cinza claro no canto inferior direito. Garanta que a imagem final tenha uma proporção de ${aspectRatio}.`;
      } else {
          finalPrompt = selectedTemplate.prompt(gender, customClothing || undefined, !!bodyImageFile, marketingText || undefined, aspectRatio);
      }

      const resultUrl = await editImageWithGemini(imageFile, bodyImageFile, finalPrompt);
      
      setGeneratedImageUrl(resultUrl);
      setPreviewUrl(resultUrl);
      const newFileName = `edited-${imageFile.name || 'image.png'}`;
      const newFile = dataURLtoFile(resultUrl, newFileName);
      if (newFile) {
        setImageFile(newFile);
      }
      setRefinementPrompt(''); // Limpa o prompt de refinamento após o uso
      
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
  }, [imageFile, bodyImageFile, selectedTemplate, gender, customClothing, marketingText, aspectRatio, refinementPrompt]);
  
  const handleShare = async () => {
    if (!generatedImageUrl) return;

    const file = dataURLtoFile(generatedImageUrl, 'imagem-gerada-pelo-luxiaestudio.png');
    if (!file) {
      setError('Não foi possível criar o arquivo para compartilhamento.');
      return;
    }

    if (canShare) {
      try {
        await navigator.share({
          files: [file],
          title: 'Minha Criação LuxiaEstudio',
          text: 'Veja a imagem que criei com o LuxiaEstudio!',
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
  const hasBodyImage = !!bodyImageFile;
  
  let stepCounter = 1;

  return (
    <div className="h-screen font-sans flex flex-col relative overflow-hidden isolate">
      <div className="absolute top-[-250px] right-[-250px] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(148,163,184,0.1)_0%,transparent_70%)]" aria-hidden="true"></div>
      <div className="absolute bottom-[-200px] left-[-200px] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(148,163,184,0.08)_0%,transparent_70%)]" aria-hidden="true"></div>
      
      <Header />
      <main className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden p-4 md:p-8 gap-8">
        {/* Sidebar: Controles & Input */}
        <div className="animate-slideIn order-2 md:order-1 w-full md:w-[420px] lg:w-[450px] flex-shrink-0 bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-[24px] shadow-2xl p-6 md:p-8 flex flex-col gap-6 md:overflow-y-auto">
          <div>
            <label htmlFor="image-upload" className="block text-lg font-medium text-slate-200 mb-2">
              {stepCounter++}. Imagem do Rosto
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/5 file:text-slate-100 hover:file:bg-white/10 cursor-pointer transition-colors"
            />
          </div>
          
          <div>
             <label className="block text-lg font-medium text-slate-200 mb-2">
              {stepCounter++}. Formato da Imagem
            </label>
            <div className="grid grid-cols-4 gap-2">
                {ASPECT_RATIO_OPTIONS.map(option => (
                    <button
                        key={option.value}
                        onClick={() => setAspectRatio(option.value)}
                        className={`p-2 flex flex-col items-center justify-center gap-1 backdrop-blur-md border rounded-xl text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white/50
                        ${aspectRatio === option.value
                            ? 'bg-white/10 border-white/20 text-slate-50 shadow-md'
                            : 'bg-white/[.03] border-white/[.08] text-slate-300 hover:bg-white/5'
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
            <label htmlFor="body-image-upload" className="block text-lg font-medium text-slate-200 mb-2">
             {stepCounter++}. Corpo e Pose (Opcional)
            </label>
            <input
              id="body-image-upload"
              type="file"
              accept="image/*"
              onChange={handleBodyImageChange}
              className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-400/10 file:text-teal-300 hover:file:bg-teal-400/20 cursor-pointer transition-colors"
            />
            <p className="text-sm text-slate-400 mt-1">Use para definir o corpo, a pose e a roupa.</p>
            {bodyImagePreviewUrl && (
                <div className="mt-4 relative w-24">
                    <img src={bodyImagePreviewUrl} alt="Pré-visualização do corpo" className="rounded-lg w-full h-auto border border-white/10" />
                    <button onClick={handleRemoveBodyImage} className="absolute -top-2 -right-2 bg-red-600/50 backdrop-blur-sm border border-white/10 text-white rounded-full p-1 text-xs w-6 h-6 flex items-center justify-center font-bold">
                        X
                    </button>
                </div>
            )}
          </div>

          <div>
            <label className="block text-lg font-medium text-slate-200 mb-2">
              {stepCounter++}. Escolha um Estilo
            </label>
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
              {PROMPT_TEMPLATES.map(template => (
                <button
                  key={template.title}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-3 h-full rounded-xl text-sm text-center font-medium backdrop-blur-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white/50
                    ${selectedTemplate.title === template.title
                      ? 'bg-white/10 border-white/20 text-slate-50 shadow-lg'
                      : 'bg-white/[.03] border-white/[.08] text-slate-300 hover:bg-white/5'
                    }`
                  }
                >
                  {template.title}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium text-slate-200 mb-2">
              {stepCounter++}. Gênero
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setGender('masculino')}
                className={`px-4 py-2 rounded-xl flex-1 backdrop-blur-md border transition-colors ${gender === 'masculino' ? 'bg-white/10 border-white/20 text-slate-50' : 'bg-white/[.03] border-white/[.08] text-slate-300 hover:bg-white/5'}`}
              >
                Masculino
              </button>
              <button
                onClick={() => setGender('feminino')}
                className={`px-4 py-2 rounded-xl flex-1 backdrop-blur-md border transition-colors ${gender === 'feminino' ? 'bg-white/10 border-white/20 text-slate-50' : 'bg-white/[.03] border-white/[.08] text-slate-300 hover:bg-white/5'}`}
              >
                Feminino
              </button>
            </div>
          </div>
          
          {hasCustomTextInput && (
            <div>
              <label htmlFor="marketing-text" className="block text-lg font-medium text-slate-200 mb-2">
                {stepCounter++}. Texto da Imagem (Opcional)
              </label>
              <textarea
                id="marketing-text"
                rows={3}
                value={marketingText}
                onChange={(e) => setMarketingText(e.target.value)}
                placeholder={isPosterTemplate ? "Ex: MAKE IT HAPPEN." : "Ex: WE'RE HIRING, com 'HIRING' em destaque"}
                className="w-full bg-slate-900/20 text-slate-200 border border-white/10 rounded-lg p-3 focus:ring-white/50 focus:border-white/50 transition"
              />
              <p className="text-sm text-slate-400 mt-1">Deixe em branco para o texto padrão.</p>
            </div>
          )}

          {!hasBodyImage && (
            <div>
                <label htmlFor="custom-clothing" className="block text-lg font-medium text-slate-200 mb-2">
                {stepCounter++}. Roupas (Opcional)
                </label>
                <input
                id="custom-clothing"
                type="text"
                value={customClothing}
                onChange={(e) => setCustomClothing(e.target.value)}
                placeholder="Ex: um vestido vermelho elegante"
                className="w-full bg-slate-900/20 text-slate-200 border border-white/10 rounded-lg p-3 focus:ring-white/50 focus:border-white/50 transition"
                />
                <p className="text-sm text-slate-400 mt-1">Deixe em branco para usar a roupa padrão do estilo.</p>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isLoading || !imageFile}
            className="w-full mt-auto bg-white/10 backdrop-blur-md border border-white/20 text-slate-50 font-bold py-4 px-10 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 hover:bg-white/15 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-white"
          >
            {isLoading ? 'Gerando...' : 'Gerar Imagem'}
          </button>
        </div>

        {/* Conteúdo Principal: Pré-visualização & Resultado */}
        <div className="animate-slideIn order-1 md:order-2 md:flex-1 p-4 md:p-6 flex flex-col items-center justify-start overflow-y-auto">
          <h2 className="text-xl md:text-2xl font-semibold mb-2 text-center text-slate-100">Sua Criação</h2>
          <p className="text-slate-400 text-sm mb-4 text-center">Use o scroll do mouse ou o gesto de pinça para dar zoom.</p>
          {error && <p className="text-red-400 mb-4 text-center bg-red-500/10 p-3 rounded-lg border border-red-500/30">{error}</p>}

          <div className="w-full max-w-2xl aspect-square relative bg-white/[.03] backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-2">
            <ZoomableImage
              src={generatedImageUrl || previewUrl}
              alt={generatedImageUrl ? 'Imagem Gerada' : 'Pré-visualização'}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 rounded-3xl backdrop-blur-sm z-10">
                <Loader />
              </div>
            )}
          </div>
          {generatedImageUrl && !isLoading && (
            <div className="w-full max-w-2xl mt-6 flex flex-col gap-4 pb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                    <a
                        href={generatedImageUrl}
                        download="imagem-gerada-luxiaestudio.png"
                        className="flex-1 flex items-center justify-center gap-2 bg-green-500/10 border border-green-400/30 text-green-300 hover:bg-green-500/20 hover:border-green-400/50 font-bold py-3 px-6 rounded-lg transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Salvar
                    </a>
                    {canShare && (
                        <button
                        onClick={handleShare}
                        className="flex-1 flex items-center justify-center gap-2 bg-sky-500/10 border border-sky-400/30 text-sky-300 hover:bg-sky-500/20 hover:border-sky-400/50 font-bold py-3 px-6 rounded-lg transition"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                        Compartilhar
                        </button>
                    )}
                </div>
                
                <div>
                    <label htmlFor="refinement-prompt" className="block text-lg font-medium text-slate-200 mb-2">
                        Refine a Imagem (Opcional)
                    </label>
                    <textarea
                        id="refinement-prompt"
                        rows={2}
                        value={refinementPrompt}
                        onChange={(e) => setRefinementPrompt(e.target.value)}
                        placeholder="Ex: mude a cor da camisa para azul, adicione um chapéu..."
                        className="w-full bg-slate-900/20 text-slate-200 border border-white/10 rounded-lg p-3 focus:ring-white/50 focus:border-white/50 transition"
                    />
                    <p className="text-sm text-slate-400 mt-1">Descreva as alterações que você deseja fazer na imagem acima.</p>
                </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;