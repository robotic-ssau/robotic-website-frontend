import type { ReactNode } from 'react';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from '@/features/theme';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
