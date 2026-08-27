import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, Literature } from '../types';

interface ReaderState {
  theme: Theme;
  fontSize: number;
  savedItems: Literature[];
  readHistoryItems: Literature[];
  setTheme: (theme: Theme) => void;
  setFontSize: (size: number) => void;
  toggleSaveOffline: (item: Literature) => void;
  autoCacheItem: (item: Literature) => void;
  isSavedOffline: (id: string) => boolean;
  hasRead: (id: string) => boolean;
  clearHistory: () => void;
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      fontSize: 16,
      savedItems: [],
      readHistoryItems: [],

      setTheme: (theme: Theme) => set({ theme }),

      setFontSize: (fontSize: number) => set({ fontSize }),

      toggleSaveOffline: (item: Literature) => {
        const { savedItems } = get();
        const exists = (savedItems || []).some((saved) => saved.id === item.id);
        if (exists) {
          set({ savedItems: (savedItems || []).filter((saved) => saved.id !== item.id) });
        } else {
          set({ savedItems: [item, ...(savedItems || [])] });
        }
      },

      autoCacheItem: (item: Literature) => {
        const { readHistoryItems } = get();
        const exists = (readHistoryItems || []).some((read) => read.id === item.id);
        if (!exists) {
          set({ readHistoryItems: [item, ...(readHistoryItems || [])] });
        }
      },

      isSavedOffline: (id: string) => {
        return (get().savedItems || []).some((item) => item.id === id);
      },

      hasRead: (id: string) => {
        return (get().readHistoryItems || []).some((item) => item.id === id);
      },

      clearHistory: () => set({ readHistoryItems: [] }),
    }),
    {
      name: 'lit_pwa_reader_store',
    }
  )
);
