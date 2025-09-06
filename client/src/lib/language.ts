import { Language } from "../types";

const LANGUAGE_STORAGE_KEY = "luxio-language";

export const getStoredLanguage = (): Language | null => {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored as Language;
  } catch {
    return null;
  }
};

export const setStoredLanguage = (language: Language): void => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.error("Failed to store language:", error);
  }
};

export const detectLanguageFromIP = async (): Promise<Language> => {
  try {
    // Try to detect language from browser
    const browserLang = navigator.language.split('-')[0] as Language;
    const supportedLanguages: Language[] = ['fr', 'en', 'pl', 'es', 'pt', 'it', 'hu'];
    
    if (supportedLanguages.includes(browserLang)) {
      return browserLang;
    }
    
    // Try IP-based detection (mock implementation - in real app, use a service like ipapi.co)
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const countryCode = data.country_code?.toLowerCase();
      
      const countryToLanguage: Record<string, Language> = {
        'fr': 'fr',
        'gb': 'en',
        'us': 'en',
        'ca': 'en',
        'au': 'en',
        'pl': 'pl',
        'es': 'es',
        'pt': 'pt',
        'br': 'pt',
        'it': 'it',
        'hu': 'hu'
      };
      
      return countryToLanguage[countryCode] || 'en';
    } catch {
      // Fallback to English if IP detection fails
      return 'en';
    }
  } catch {
    return 'fr'; // Default to French as per original design
  }
};

export const getLanguageEmoji = (language: Language): string => {
  const emojiMap: Record<Language, string> = {
    'fr': '🇫🇷',
    'en': '🇬🇧',
    'pl': '🇵🇱',
    'es': '🇪🇸',
    'pt': '🇵🇹',
    'it': '🇮🇹',
    'hu': '🇭🇺'
  };
  return emojiMap[language];
};
