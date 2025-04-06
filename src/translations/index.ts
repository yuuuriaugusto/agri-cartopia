
import { ptBR } from './pt-BR';
import { en } from './en';

export type Language = 'pt-BR' | 'en';

export const translations = {
  'pt-BR': ptBR,
  'en': en
};

// Keep backwards compatibility
export const traducoes = translations;
