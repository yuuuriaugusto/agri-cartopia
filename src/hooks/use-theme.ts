import { useContext } from 'react';
import { ThemeContext } from '@/contexto/ContextoTema';

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const useTema = useTheme;
