import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '../types';

interface LanguageState {
  uiLang: Language;
  setUiLang: (lang: Language) => void;
  toggleUiLang: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      uiLang: 'bn',
      setUiLang: (uiLang: Language) => set({ uiLang }),
      toggleUiLang: () => set({ uiLang: get().uiLang === 'bn' ? 'en' : 'bn' }),
    }),
    {
      name: 'lit_pwa_language_store',
    }
  )
);
