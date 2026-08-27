import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, Literature } from '../types';

interface ReaderState {
  theme: Theme;
  fontSize: number;
  savedItems: Literature[];
  setTheme: (theme: Theme) => void;
  setFontSize: (size: number) => void;
  toggleSaveOffline: (item: Literature) => void;
  isSavedOffline: (id: string) => boolean;
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      fontSize: 16,
      savedItems: [],

      setTheme: (theme: Theme) => set({ theme }),

      setFontSize: (fontSize: number) => set({ fontSize }),

      toggleSaveOffline: (item: Literature) => {
        const { savedItems } = get();
        const exists = savedItems.some((saved) => saved.id === item.id);
        if (exists) {
          set({ savedItems: savedItems.filter((saved) => saved.id !== item.id) });
        } else {
          set({ savedItems: [...savedItems, item] });
        }
      },

      isSavedOffline: (id: string) => {
        return get().savedItems.some((item) => item.id === id);
      },
    }),
    {
      name: 'lit_pwa_reader_store',
    }
  )
);
