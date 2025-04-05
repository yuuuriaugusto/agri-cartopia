
import { createContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '@/translations';

export type Language = 'pt-BR' | 'en';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const TranslationContext = createContext<TranslationContextType>({
  language: 'pt-BR',
  setLanguage: () => {},
  t: () => '',
});

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider = ({ children }: TranslationProviderProps) => {
  const [language, setLanguage] = useState<Language>('pt-BR');

  useEffect(() => {
    // Check for stored language preference
    const storedLang = localStorage.getItem('language') as Language;
    if (storedLang && (storedLang === 'pt-BR' || storedLang === 'en')) {
      setLanguage(storedLang);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language;
      if (browserLang.startsWith('pt')) {
        setLanguage('pt-BR');
      } else if (browserLang.startsWith('en')) {
        setLanguage('en');
      } else {
        // Definir português como idioma padrão
        setLanguage('pt-BR');
      }
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return value || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Export with Portuguese name for backwards compatibility
export const ProvedorTraducao = TranslationProvider;
