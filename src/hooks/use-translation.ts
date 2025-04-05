import { useContext } from 'react';
import { TranslationContext } from '@/contexto/ContextoTraducao';

export const useTranslation = () => {
  return useContext(TranslationContext);
};

export const useTraducao = useTranslation;
