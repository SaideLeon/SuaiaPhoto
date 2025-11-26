

import { GoogleGenAI, Modality } from "@google/genai";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove "data:mime/type;base64," prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const editImageWithGemini = async (mainImageFile: File, bodyImageFile: File | null, prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("A variável de ambiente API_KEY não está definida.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const mainImageBase64 = await fileToBase64(mainImageFile);

  const parts: any[] = [
    {
      inlineData: {
        data: mainImageBase64,
        mimeType: mainImageFile.type,
      },
    },
  ];

  if (bodyImageFile) {
    const bodyImageBase64 = await fileToBase64(bodyImageFile);
    parts.push({
      inlineData: {
        data: bodyImageBase64,
        mimeType: bodyImageFile.type,
      },
    });
  }
  
  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: parts,
    },
    config: {
        responseModalities: [Modality.IMAGE],
    },
  });

  // Check for blocking reasons
  if (response.promptFeedback?.blockReason) {
    let reasonMessage = `A geração foi bloqueada. Motivo: ${response.promptFeedback.blockReason}.`;
    if (response.promptFeedback.blockReason === 'SAFETY' && response.promptFeedback.safetyRatings) {
      const safetyDetails = response.promptFeedback.safetyRatings
        .filter(rating => rating.probability !== 'NEGLIGIBLE' && rating.probability !== 'LOW')
        .map(rating => `- Categoria ${rating.category.replace('HARM_CATEGORY_', '')} com probabilidade ${rating.probability}`)
        .join('\n');
      
      if (safetyDetails) {
        reasonMessage += `\n\nDetalhes de segurança:\n${safetyDetails}\n\nPor favor, ajuste o prompt ou a imagem para estar em conformidade com as políticas de segurança.`;
      } else {
        reasonMessage += " Por favor, tente um prompt ou imagem diferente.";
      }
    } else {
      reasonMessage += " Por favor, tente um prompt ou imagem diferente.";
    }
    throw new Error(reasonMessage);
  }

  const generatedPart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

  if (generatedPart?.inlineData) {
    const base64ImageBytes: string = generatedPart.inlineData.data;
    return `data:${generatedPart.inlineData.mimeType};base64,${base64ImageBytes}`;
  }
  
  const textPart = response.candidates?.[0]?.content?.parts?.find(part => part.text);
  if (textPart?.text) {
      throw new Error(`A IA retornou um texto em vez de uma imagem: "${textPart.text.substring(0, 100)}...". Isso pode indicar um problema com o seu prompt ou a imagem enviada. Por favor, tente novamente com uma solicitação diferente.`);
  }

  throw new Error("Nenhuma imagem foi gerada. A resposta da IA estava vazia ou em um formato inesperado. Verifique a imagem de entrada e tente novamente.");
};