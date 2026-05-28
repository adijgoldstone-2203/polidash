import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { en } from './translations/en';
import { he } from './translations/he';
import { enData } from './data/en';
import { heData } from './data/he';

type Lang = 'en' | 'he';
type Dir = 'ltr' | 'rtl';

interface LanguageContextType {
  lang: Lang;
  dir: Dir;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  tParty: (name: string) => string;
  tPolitician: (name: string) => string;
  tIssue: (key: string) => string;
  tIntelligenceTopic: (key: string) => string;
  tStance: (stance: string) => string;
  tIssueDefinition: (key: string) => string;
  tBloc: (name: string) => string;
  tPollSource: (source: string) => string;
  tBio: (id: string) => string;
  tQuote: (id: string) => string;
  tFacts: (id: string) => string[];
  tIntelligence: (id: string, topic: string) => string;
  dateLocale: string;
}

const translations: Record<Lang, Record<string, string>> = { en, he };

const LanguageContext = createContext<LanguageContextType | null>(null);

const getInitialLang = (): Lang => {
  try {
    const stored = localStorage.getItem('polidash-lang');
    if (stored === 'en' || stored === 'he') return stored;
  } catch {}
  return 'en';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    try { localStorage.setItem('polidash-lang', newLang); } catch {}
  }, []);

  useEffect(() => {
    const dir = lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang]);

  const dir: Dir = lang === 'he' ? 'rtl' : 'ltr';
  const data = lang === 'he' ? heData : enData;
  const strings = translations[lang];

  const t = useCallback((key: string): string => {
    return strings[key] || key;
  }, [strings]);

  const tParty = useCallback((name: string): string => {
    return (data.partyNames as Record<string, string>)[name] || name;
  }, [data]);

  const tPolitician = useCallback((name: string): string => {
    return (data.politicianNames as Record<string, string>)[name] || name;
  }, [data]);

  const tIssue = useCallback((key: string): string => {
    return (data.issueNames as Record<string, string>)[key] || key;
  }, [data]);

  const tIntelligenceTopic = useCallback((key: string): string => {
    return (data.intelligenceTopics as Record<string, string>)[key] || key;
  }, [data]);

  const tStance = useCallback((stance: string): string => {
    return (data.stances as Record<string, string>)[stance] || stance;
  }, [data]);

  const tIssueDefinition = useCallback((key: string): string => {
    return (data.issueDefinitions as Record<string, string>)[key] || key;
  }, [data]);

  const tBloc = useCallback((name: string): string => {
    return (data.blocNames as Record<string, string>)[name] || name;
  }, [data]);

  const tPollSource = useCallback((source: string): string => {
    return (data.pollSources as Record<string, string>)[source] || source;
  }, [data]);

  const tBio = useCallback((id: string): string => {
    return (data.politicians as Record<string, any>)[id]?.biography || '';
  }, [data]);

  const tQuote = useCallback((id: string): string => {
    return (data.politicians as Record<string, any>)[id]?.quote || '';
  }, [data]);

  const tFacts = useCallback((id: string): string[] => {
    return (data.politicians as Record<string, any>)[id]?.facts || [];
  }, [data]);

  const tIntelligence = useCallback((id: string, topic: string): string => {
    return (data.politicians as Record<string, any>)[id]?.intelligence?.[topic] || '';
  }, [data]);

  const dateLocale = lang === 'he' ? 'he-IL' : 'en-US';

  const value: LanguageContextType = {
    lang, dir, setLang, t,
    tParty, tPolitician, tIssue, tIntelligenceTopic,
    tStance, tIssueDefinition, tBloc, tPollSource,
    tBio, tQuote, tFacts, tIntelligence,
    dateLocale,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
};
