import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface TranslationContextType {
  currentLanguage: string;
  changeLanguage: (language: string) => void;
  isRTL: boolean;
  t: (key: string, options?: any) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: React.ReactNode;
  defaultLanguage?: string;
}

export function TranslationProvider({ children, defaultLanguage = 'en' }: TranslationProviderProps) {
  const { t, changeLanguage, getCurrentLanguage, isRTL } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);

  useEffect(() => {
    // Initialize with default language
    changeLanguage(defaultLanguage);
    setCurrentLanguage(defaultLanguage);
  }, [defaultLanguage, changeLanguage]);

  const handleChangeLanguage = (language: string) => {
    changeLanguage(language);
    setCurrentLanguage(language);
    
    // Save to localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('palmera-language', language);
    }
  };

  useEffect(() => {
    // Load saved language from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedLanguage = localStorage.getItem('palmera-language');
      if (savedLanguage && savedLanguage !== currentLanguage) {
        handleChangeLanguage(savedLanguage);
      }
    }
  }, []);

  const value: TranslationContextType = {
    currentLanguage,
    changeLanguage: handleChangeLanguage,
    isRTL: isRTL(),
    t,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationContext() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslationContext must be used within a TranslationProvider');
  }
  return context;
}
