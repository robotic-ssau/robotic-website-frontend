import type { ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import { DEFAULT_THEME, THEME_STORAGE_KEY, THEMES } from '@/shared/lib/theme';

interface ThemeProviderProps {
  children: ReactNode;
}

function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={DEFAULT_THEME}
      themes={THEMES}
      storageKey={THEME_STORAGE_KEY}
      enableSystem
    >
      {children}
    </NextThemesProvider>
  );
}

export default ThemeProvider;
