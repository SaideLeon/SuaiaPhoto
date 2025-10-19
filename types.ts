export type Gender = 'masculino' | 'feminino';

export interface PromptTemplate {
  title: string;
  prompt: (gender: Gender, customClothing?: string, hasClothingImage?: boolean, hasHairstyleImage?: boolean, marketingText?: string) => string;
}