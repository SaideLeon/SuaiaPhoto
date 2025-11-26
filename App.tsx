
import React, { useState, ChangeEvent, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Loader from './components/Loader';
import ZoomableImage from './components/ZoomableImage';
import { PROMPT_TEMPLATES, DEFAULT_IMAGE_URL } from './constants';
import { editImageWithGemini } from './services/geminiService';
import { saveState, loadState, clearState } from './services/storageService';
import type { Gender, PromptTemplate } from './types';

// Interface para itens do histórico
interface HistoryItem {
  id: string;
  url: string;
  templateTitle: string;
  timestamp: number;
}

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
    { label: 'Story', value: '9:16', icon: <svg width="12" height="18" viewBox="0 0 12 18" fill="currentColor"><rect x="0.5" y="0.5" width="11" height="17" rx="1.5" stroke="currentColor"/></svg> },
    { label: 'Pin', value: '2:3', icon: <svg width="12" height="18" viewBox="0 0 12 18" fill="currentColor"><rect x="0.5" y="2.5" width="11" height="13" rx="1.5" stroke="currentColor"/></svg> },
    { label: 'Quadrado', value: '1:1', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1.5" y="1.5" width="13" height="13" rx="1.5" stroke="currentColor"/></svg> },
    { label: 'Foto', value: '3:2', icon: <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="2.5" y="0.5" width="13" height="11" rx="1.5" stroke="currentColor"/></svg> },
    { label: 'Wide', value: '16:9', icon: <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0.5" y="2.5" width="17" height="7" rx="1.5" stroke="currentColor"/></svg> },
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Efeito para carregar o estado do IndexedDB na montagem inicial
  useEffect(() => {
    const load = async () => {
      try {
        // Tenta limpar o localStorage antigo para evitar conflitos de cota em outras partes
        try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}

        const savedState = await loadState(STORAGE_KEY);
        if (savedState) {
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
          if (savedState.history && Array.isArray(savedState.history)) {
              setHistory(savedState.history);
          }
        }
      } catch (e) {
        console.error("Falha ao carregar estado do storage", e);
      }
    };
    load();
  }, []);

  // Efeito para salvar o estado no IndexedDB sempre que ele mudar
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (previewUrl === DEFAULT_IMAGE_URL && !imageFile && history.length === 0) {
        await clearState(STORAGE_KEY);
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
        history: history
      };
      
      try {
          await saveState(STORAGE_KEY, stateToSave);
      } catch (e) {
          console.error("Erro ao salvar no storage:", e);
      }
    }, 1000); // Debounce de 1s

    return () => clearTimeout(handler);
  }, [gender, aspectRatio, customClothing, selectedTemplate, previewUrl, imageFile, bodyImagePreviewUrl, bodyImageFile, marketingText, history]);

  // Efeito para verificar o suporte à API de Compartilhamento Web
  useEffect(() => {
    if (navigator.share && navigator.canShare) {
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
            setCustomClothing(''); 
        });
    }
  };

  const handleRemoveBodyImage = () => {
    setBodyImageFile(null);
    setBodyImagePreviewUrl(null);
  };

  const addToHistory = (url: string, template: string) => {
      const newItem: HistoryItem = {
          id: Date.now().toString(),
          url,
          templateTitle: template,
          timestamp: Date.now()
      };
      setHistory(prev => [newItem, ...prev].slice(0, 5)); // Mantém apenas os 5 mais recentes
  };

  const selectHistoryItem = (item: HistoryItem) => {
      setGeneratedImageUrl(item.url);
      setPreviewUrl(item.url);
      const file = dataURLtoFile(item.url, `historico-${item.id}.png`);
      if (file) {
          setImageFile(file);
      }
      // Opcional: Fechar sidebar no mobile ao selecionar
      if (window.innerWidth < 768) {
          setIsSidebarOpen(false);
      }
  };

  const handleGenerate = useCallback(async () => {
    if (!imageFile) {
      setError("Por favor, envie uma imagem primeiro.");
      return;
    }

    setIsLoading(true);
    setError(null);
    if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
    }
    
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
      
      // Adicionar ao histórico
      addToHistory(resultUrl, selectedTemplate.title);

      const newFileName = `edited-${imageFile.name || 'image.png'}`;
      const newFile = dataURLtoFile(resultUrl, newFileName);
      if (newFile) {
        setImageFile(newFile);
      }
      setRefinementPrompt(''); 
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
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
  
  const StepBadge = ({ num }: { num: number }) => (
    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 mr-2">
        {num}
    </span>
  );

  let stepCounter = 1;

  return (
    <div className="h-screen font-sans flex flex-col relative overflow-hidden isolate">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" aria-hidden="true"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" aria-hidden="true"></div>
      
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
        ></div>
      )}

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Sidebar: Controles & Input */}
        <aside className={`
            fixed md:relative inset-y-0 left-0 z-50 
            w-[85%] max-w-sm md:w-[400px] lg:w-[420px] 
            flex-shrink-0 
            bg-slate-900/90 md:bg-slate-900/40
            backdrop-blur-xl 
            border-r border-white/5
            flex flex-col 
            transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
            shadow-[10px_0_30px_-10px_rgba(0,0,0,0.5)] md:shadow-none
          `}>
          
          <div className="p-4 border-b border-white/5 md:hidden flex justify-between items-center">
            <span className="font-semibold text-slate-200">Configurações</span>
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="p-2 -mr-2 text-slate-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-8 scrollbar-thin">
            
            {/* 1. Upload Section */}
            <div className="space-y-3">
                <div className="flex items-center text-sm font-medium text-slate-300">
                    <StepBadge num={stepCounter++} />
                    Sua Foto (Rosto)
                </div>
                <div className="relative group">
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    <label 
                        htmlFor="image-upload"
                        className={`
                            relative flex flex-col items-center justify-center w-full h-32 
                            rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
                            ${imageFile 
                                ? 'border-indigo-500/50 bg-indigo-500/10' 
                                : 'border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-500'
                            }
                        `}
                    >
                        {imageFile && previewUrl ? (
                            <>
                                <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[2px]" />
                                <div className="absolute inset-0 bg-black/40"></div>
                                <div className="z-10 flex flex-col items-center">
                                    <svg className="w-8 h-8 text-white mb-1 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <span className="text-xs font-medium text-white shadow-sm truncate max-w-[200px]">{imageFile.name}</span>
                                    <span className="text-[10px] text-indigo-200 mt-1 bg-indigo-900/60 px-2 py-0.5 rounded-full">Trocar imagem</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center text-slate-400">
                                <svg className="w-8 h-8 mb-2 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                <span className="text-sm">Clique para enviar foto</span>
                            </div>
                        )}
                    </label>
                </div>
            </div>

            {/* History Section - Only visible if there is history */}
            {history.length > 0 && (
                 <div className="space-y-3">
                    <div className="flex items-center text-sm font-medium text-slate-300">
                        <svg className="w-4 h-4 text-indigo-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Criações Recentes (5)
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {history.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => selectHistoryItem(item)}
                                className={`
                                    relative group aspect-square rounded-lg overflow-hidden border border-white/10 transition-all
                                    hover:border-indigo-400 hover:shadow-[0_0_10px_rgba(99,102,241,0.5)]
                                    ${generatedImageUrl === item.url ? 'ring-2 ring-indigo-500 border-transparent' : ''}
                                `}
                                title={item.templateTitle}
                            >
                                <img src={item.url} alt="Histórico" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                            </button>
                        ))}
                    </div>
                 </div>
            )}

            {/* 2. Style Selection */}
            <div className="space-y-3">
                <div className="flex items-center text-sm font-medium text-slate-300">
                    <StepBadge num={stepCounter++} />
                    Escolha o Estilo
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {PROMPT_TEMPLATES.map(template => (
                    <button
                      key={template.title}
                      onClick={() => setSelectedTemplate(template)}
                      className={`
                        p-3 rounded-lg text-xs font-medium text-left transition-all border
                        flex flex-col justify-between min-h-[60px] relative overflow-hidden group
                        ${selectedTemplate.title === template.title
                          ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]'
                          : 'bg-slate-800/30 border-white/5 text-slate-400 hover:bg-slate-800/60 hover:border-white/10'
                        }
                      `}
                    >
                      <span className="relative z-10">{template.title}</span>
                      {selectedTemplate.title === template.title && (
                          <div className="absolute bottom-0 left-0 h-0.5 w-full bg-indigo-500"></div>
                      )}
                    </button>
                  ))}
                </div>
            </div>

            {/* 3. Gender & Ratio */}
            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-3">
                    <div className="flex items-center text-sm font-medium text-slate-300">
                        <StepBadge num={stepCounter++} />
                        Gênero do Sujeito
                    </div>
                    <div className="bg-slate-900/50 p-1 rounded-lg border border-white/5 flex">
                        {(['masculino', 'feminino'] as Gender[]).map((g) => (
                            <button
                                key={g}
                                onClick={() => setGender(g)}
                                className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${
                                    gender === g 
                                    ? 'bg-slate-700 text-white shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                {g.charAt(0).toUpperCase() + g.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center text-sm font-medium text-slate-300">
                         <StepBadge num={stepCounter++} />
                         Proporção
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                        {ASPECT_RATIO_OPTIONS.map(option => (
                            <button
                                key={option.value}
                                onClick={() => setAspectRatio(option.value)}
                                className={`
                                    flex flex-col items-center justify-center p-2 rounded-lg border transition-all
                                    ${aspectRatio === option.value
                                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200'
                                        : 'bg-slate-800/30 border-white/5 text-slate-500 hover:bg-slate-800/50'
                                    }
                                `}
                                title={option.label}
                            >
                                <div className={`${aspectRatio === option.value ? 'text-indigo-400' : 'text-current'}`}>
                                    {option.icon}
                                </div>
                                <span className="text-[9px] mt-1 font-medium">{option.value}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Optional Settings */}
            <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm font-medium text-slate-300">
                         <StepBadge num={stepCounter++} />
                         Opções Avançadas
                    </div>
                </div>

                {/* Body Image Upload */}
                 <div className="bg-slate-900/30 rounded-lg p-3 border border-white/5">
                    <label className="text-xs text-slate-400 mb-2 block">Referência de Pose/Corpo (Opcional)</label>
                    {!bodyImageFile ? (
                        <label className="flex items-center justify-center gap-2 w-full py-2 border border-dashed border-slate-600 rounded-md text-xs text-slate-400 cursor-pointer hover:bg-slate-800/50 hover:text-slate-200 transition-colors">
                            <input type="file" accept="image/*" onChange={handleBodyImageChange} className="hidden" />
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Adicionar Imagem
                        </label>
                    ) : (
                         <div className="flex items-center gap-3 bg-slate-800/50 p-2 rounded-md">
                            {bodyImagePreviewUrl && (
                                <img src={bodyImagePreviewUrl} alt="Ref" className="w-10 h-10 object-cover rounded" />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-300 truncate">{bodyImageFile.name}</p>
                            </div>
                            <button onClick={handleRemoveBodyImage} className="text-slate-500 hover:text-red-400 p-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                         </div>
                    )}
                 </div>

                {hasCustomTextInput && (
                    <div>
                        <label htmlFor="marketing-text" className="text-xs text-slate-400 mb-1.5 block">Texto da Imagem</label>
                        <input
                            id="marketing-text"
                            type="text"
                            value={marketingText}
                            onChange={(e) => setMarketingText(e.target.value)}
                            placeholder={isPosterTemplate ? "MAKE IT HAPPEN" : "WE'RE HIRING"}
                            className="w-full bg-slate-950/50 text-slate-200 text-sm border border-white/10 rounded-lg px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        />
                    </div>
                )}

                {!hasBodyImage && (
                    <div>
                        <label htmlFor="custom-clothing" className="text-xs text-slate-400 mb-1.5 block">Roupa Personalizada</label>
                        <input
                            id="custom-clothing"
                            type="text"
                            value={customClothing}
                            onChange={(e) => setCustomClothing(e.target.value)}
                            placeholder="Ex: jaqueta de couro vermelha"
                            className="w-full bg-slate-950/50 text-slate-200 text-sm border border-white/10 rounded-lg px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        />
                    </div>
                )}
            </div>

          </div>
          
          {/* Action Button */}
          <div className="p-5 border-t border-white/5 bg-slate-900/60 backdrop-blur-md z-10">
            <button
                onClick={handleGenerate}
                disabled={isLoading || !imageFile}
                className="
                    w-full py-3.5 px-4 rounded-xl 
                    bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500
                    text-white font-semibold shadow-lg shadow-indigo-500/20
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                    transform transition-all active:scale-[0.98]
                    flex items-center justify-center gap-2
                "
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span>Processando...</span>
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        <span>Gerar Imagem</span>
                    </>
                )}
            </button>
          </div>
        </aside>

        {/* Main Content: Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 flex flex-col items-center">
            
            {/* Error Message */}
            {error && (
                <div className="w-full max-w-2xl bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl mb-6 flex items-start gap-3 animate-slideIn">
                    <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                        <h4 className="font-semibold text-sm">Falha na Geração</h4>
                        <p className="text-xs mt-1 opacity-90">{error}</p>
                    </div>
                </div>
            )}

            {/* Image Canvas */}
            <div className="w-full max-w-3xl flex flex-col items-center animate-slideIn">
                <div className="
                    relative w-full aspect-square md:aspect-auto md:min-h-[500px] md:h-[calc(100vh-250px)]
                    bg-slate-900/50 rounded-2xl border border-white/5 
                    shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)]
                    overflow-hidden flex items-center justify-center
                    group
                ">
                    <div className="absolute inset-0 bg-[url('/icon.svg')] bg-center bg-no-repeat opacity-[0.03] bg-[length:30%] grayscale pointer-events-none"></div>
                    
                    {isLoading ? (
                         <div className="z-10 bg-slate-950/80 backdrop-blur-sm inset-0 absolute flex items-center justify-center">
                            <Loader />
                        </div>
                    ) : (
                         <div className="w-full h-full p-2 md:p-4">
                             <ZoomableImage
                                src={generatedImageUrl || previewUrl}
                                alt="Visualização"
                             />
                         </div>
                    )}
                    
                    {/* Floating Info Pill if showing preview */}
                    {!generatedImageUrl && previewUrl !== DEFAULT_IMAGE_URL && !isLoading && (
                        <div className="absolute bottom-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-xs text-white/80 border border-white/10">
                            Pré-visualização da imagem original
                        </div>
                    )}
                </div>

                {/* Post-Generation Actions */}
                {generatedImageUrl && !isLoading && (
                    <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideIn">
                        {/* Download & Share */}
                        <div className="flex gap-3">
                            <a
                                href={generatedImageUrl}
                                download="luxia-art.png"
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-medium py-3 rounded-xl transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Salvar
                            </a>
                            {canShare && (
                                <button
                                    onClick={handleShare}
                                    className="px-5 bg-slate-800 hover:bg-slate-700 border border-white/10 text-white rounded-xl transition-all"
                                    title="Compartilhar"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                </button>
                            )}
                        </div>

                        {/* Quick Refine Input */}
                        <div className="relative group">
                             <input
                                type="text"
                                value={refinementPrompt}
                                onChange={(e) => setRefinementPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                placeholder="Refinar (ex: adicione óculos de sol...)"
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                            />
                            <button 
                                onClick={handleGenerate}
                                disabled={!refinementPrompt.trim()}
                                className="absolute right-2 top-1.5 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-0 transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
