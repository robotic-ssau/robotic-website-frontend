import type { ReactNode } from 'react';

import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme';
import { AntdConfigProvider } from '@/app/providers/antd-config';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AntdConfigProvider>
        <QueryProvider>{children}</QueryProvider>
      </AntdConfigProvider>
    </ThemeProvider>
  );
}
