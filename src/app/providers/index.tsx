import type { ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import { QueryProvider } from './query-provider';
import { ThemeProvider } from '@/features/theme';

import { DEFAULT_THEME, THEME_STORAGE_KEY } from '@/shared/lib/theme';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      enableSystem
      defaultTheme={DEFAULT_THEME}
      storageKey={THEME_STORAGE_KEY}
    >
      <ThemeProvider>
        <QueryProvider>{children}</QueryProvider>
      </ThemeProvider>
    </NextThemesProvider>
  );
}
