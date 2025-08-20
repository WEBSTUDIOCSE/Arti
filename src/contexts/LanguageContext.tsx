'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '@/locales/en.json';
// import mrTranslations from '@/locales/mr.json';

type Language = 'en' | 'mr';
type Translations = typeof enTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isMarathi: boolean;
  isEnglish: boolean;
}

// Temporary fallback Marathi translations
const mrTranslations: Translations = {
  ...enTranslations,
  header: {
    title: "आरती सभा",
    tagline: "डिजिटल आरती पुस्तक आणि सभा साथी",
    language: "मराठी",
    settings: "सेटिंग्स",
    profile: "प्रोफाइल"
  },
  navigation: {
    browse: "शोध",
    favorites: "आवडते",
    sabha: "सभा",
    profile: "प्रोफाइल"
  },
  hero: {
    title: "दैवी अनुभव",
    titleHighlight: "सामंजस्य",
    subtitle: "स्वरसेतू तंत्रज्ञानासह समक्रमित आरती गायनाद्वारे कुटुंबाशी अंतरावर जोडले रहा",
    hostSabha: "सभा आयोजित करा",
    joinSabha: "सभेत सामील व्हा",
    browseAartis: "आरत्या शोधा"
  },
  auth: {
    ...enTranslations.auth,
    login: "लॉगिन",
    signup: "साइन अप"
  },
  dialog: {
    startJoinSabha: "सभा सुरू करा किंवा सामील व्हा"
  }
};

const translations = {
  en: enTranslations,
  mr: mrTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Load saved language preference from localStorage
    const savedLanguage = localStorage.getItem('aarti-sabha-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'mr')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('aarti-sabha-language', lang);
  };

  const value: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t: translations[language] as Translations,
    isMarathi: language === 'mr',
    isEnglish: language === 'en',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
