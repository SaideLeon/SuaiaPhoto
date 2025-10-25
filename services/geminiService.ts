
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
    throw new Error("API_KEY environment variable is not set.");
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

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
    }
  }

  throw new Error("Nenhuma imagem foi gerada. Tente novamente.");
};