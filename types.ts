export type Gender = 'masculino' | 'feminino';

export interface PromptTemplate {
  title: string;
  prompt: (gender: Gender, customClothing?: string, hasBodyImage?: boolean, marketingText?: string, aspectRatio?: string) => string;
}