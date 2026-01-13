import { createContext, useContext, createSignal } from 'solid-js';
import type { ParentComponent, Accessor } from 'solid-js';
import { messages } from './messages';
import type { Locale } from './messages';

type I18nContextType = {
  locale: Accessor<Locale>;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, any>) => string;
};

const I18nContext = createContext<I18nContextType>();

export const I18nProvider: ParentComponent = (props) => {
  const [locale, setLocale] = createSignal<Locale>('km');

  const t = (key: string, params?: Record<string, any>): string => {
    const currentLocale = locale();
    let message: any = messages[currentLocale];
    
    // Navigate nested keys (e.g., "message.finishedPlaying")
    const keys = key.split('.');
    for (const k of keys) {
      message = message?.[k];
    }
    
    // Return key if message not found
    if (typeof message !== 'string') {
      return key;
    }
    
    // Replace parameters (e.g., {score})
    if (params) {
      return message.replace(/\{(\w+)\}/g, (_, param) => params[param] ?? '');
    }
    
    return message;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {props.children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};
