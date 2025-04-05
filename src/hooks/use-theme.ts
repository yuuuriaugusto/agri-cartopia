
import { useContext } from 'react';
import { ThemeContext } from '@/contexto/ContextoTema';

export const useTema = () => {
  return useContext(ThemeContext);
};
