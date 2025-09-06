import { useState, useEffect } from "react";
import { Language, Translation } from "../types";
import { getStoredLanguage, setStoredLanguage, detectLanguageFromIP } from "../lib/language";
import translationsData from "../data/translations.json";

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('fr');
  const [translations] = useState<Translation>(translationsData);

  useEffect(() => {
    const initLanguage = async () => {
      const stored = getStoredLanguage();
      if (stored) {
        setLanguage(stored);
      } else {
        const detected = await detectLanguageFromIP();
        setLanguage(detected);
        setStoredLanguage(detected);
      }
    };
    
    initLanguage();
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setStoredLanguage(newLanguage);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (value && typeof value === 'object' && value[language]) {
      return value[language];
    }
    
    return key; // Return key if translation not found
  };

  return {
    language,
    changeLanguage,
    t
  };
}
