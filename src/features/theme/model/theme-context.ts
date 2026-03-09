import { createContext } from 'react';
import type { ThemeMode } from '@/shared/lib/theme';

export interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme?: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
