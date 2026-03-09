import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { App as AntdApp, ConfigProvider, theme as antdTheme } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { useTheme as useNextTheme } from 'next-themes';
import { DEFAULT_THEME, type ThemeMode, THEME_SYSTEM } from '@/shared/lib/theme';
import { ThemeContext } from '../model/theme-context';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, resolvedTheme, setTheme } = useNextTheme();

  const mode: ThemeMode =
    theme === 'light' || theme === 'dark' || theme === THEME_SYSTEM
      ? (theme as ThemeMode)
      : DEFAULT_THEME;

  const raw = mode === THEME_SYSTEM ? resolvedTheme : mode;
  const effective: 'light' | 'dark' = raw === 'dark' ? 'dark' : 'light';

  const contextValue = useMemo(
    () => ({
      theme: mode,
      resolvedTheme: effective,
      setTheme: (next: ThemeMode) => setTheme(next),
    }),
    [mode, effective, setTheme],
  );

  const algorithm = effective === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider
        locale={ruRU}
        theme={{
          algorithm,
        }}
      >
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
