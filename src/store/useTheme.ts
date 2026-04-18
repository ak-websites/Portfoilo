import { create } from 'zustand';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export type ThemeSet = 'architectural' | 'concrete' | 'luxury' | 'nordic' | 'precision' | 'blueprint';
export type ThemeMode = 'light' | 'dark' | 'brown';

interface ThemeState {
  themeSet: ThemeSet;
  mode: ThemeMode;
  setThemeSet: (themeSet: ThemeSet) => void;
  setMode: (mode: ThemeMode) => void;
  syncWithFirestore: () => () => void;
}

export const useTheme = create<ThemeState>((set) => ({
  themeSet: 'architectural',
  mode: 'light',
  setThemeSet: (themeSet) => {
    set({ themeSet });
    document.documentElement.setAttribute('data-theme', themeSet);
  },
  setMode: (mode) => {
    set({ mode });
    document.documentElement.setAttribute('data-mode', mode);
    localStorage.setItem('theme-mode', mode);
  },
  syncWithFirestore: () => {
    // Load initial local preference
    const localMode = localStorage.getItem('theme-mode') as ThemeMode;
    if (localMode) {
      set({ mode: localMode });
      document.documentElement.setAttribute('data-mode', localMode);
    }

    const unsub = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.themeSet) {
          set({ themeSet: data.themeSet });
          document.documentElement.setAttribute('data-theme', data.themeSet);
        }
        if (data.mode) {
          // If we are not admin, we might want to keep our local choice, 
          // but the requirements say global control. 
          // So we sync but allow local override until next sync.
          set({ mode: data.mode });
          document.documentElement.setAttribute('data-mode', data.mode);
          localStorage.setItem('theme-mode', data.mode);
        }
      }
    });
    return unsub;
  },
}));
