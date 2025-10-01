import React, { createContext, useContext, useState, useEffect } from 'react';

// Import translation files
import en from '../translations/en.json';
import my from '../translations/my.json';
import th from '../translations/th.json';

// Available languages
export const languages = {
  en: { code: 'en', name: 'English', translations: en, flag: '🇺🇸' },
  my: { code: 'my', name: 'မြန်မာ', translations: my, flag: '🇲🇲' },
  th: { code: 'th', name: 'ไทย', translations: th, flag: '🇹🇭' }
};

// Create language context
const LanguageContext = createContext();

// Language provider component
export const LanguageProvider = ({ children }) => {
  // Check for saved language preference or default to 'my' (Myanmar)
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage && languages[savedLanguage] ? savedLanguage : 'my';
  });

  // Get translations for the current language
  const translations = languages[language].translations;

  // Save language choice to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
    // Optionally set html lang attribute
    document.documentElement.lang = language;
  }, [language]);

  // Translate function
  const translate = (key, params = {}) => {
    let text = translations[key] || languages.en.translations[key] || key;
    
    // Replace parameters in the text if any
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
  };
  
  return (
    <LanguageContext.Provider value={{ 
      language: languages[language],
      changeLanguage: setLanguage, 
      translate,
      languages
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using language
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};