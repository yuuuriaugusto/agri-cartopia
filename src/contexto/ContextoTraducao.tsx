
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { translations, type Language } from '@/translations';

interface TranslationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const defaultLanguage: Language = 'pt-BR';

export const TranslationContext = createContext<TranslationContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: () => '',
});

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  
  // Set language based on browser preference, with a fallback to Portuguese
  useEffect(() => {
    const browserLang = navigator.language;
    // Default to pt-BR, only change to English if explicitly using English
    if (browserLang.startsWith('en')) {
      setLanguage('en');
    } else {
      setLanguage('pt-BR');
    }
  }, []);
  
  // Translation function
  const t = (key: string): string => {
    if (!translations[language] || !translations[language][key]) {
      console.warn(`Translation key not found: ${key}`);
      
      // Try to find the key in the other language as a fallback
      const otherLang: Language = language === 'en' ? 'pt-BR' : 'en';
      if (translations[otherLang] && translations[otherLang][key]) {
        return translations[otherLang][key];
      }
      
      return key;
    }
    return translations[language][key];
  };
  
  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};
