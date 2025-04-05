
import { useContext } from 'react';
import { TranslationContext } from '@/contexto/ContextoTraducao';

export const useTraducao = () => {
  return useContext(TranslationContext);
};
