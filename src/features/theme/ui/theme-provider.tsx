import type { ReactNode } from 'react';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import {
  getStoredTheme,
  THEME_STORAGE_KEY,
  THEME_DARK,
  THEME_LIGHT,
  type ThemeMode,
} from '@/shared/lib/theme';
import { ThemeContext } from '../model/theme-context';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Применяет сохранённую тему к document до гидрации React (совпадает с inline-скриптом в index.html).
 */
function applyThemeToDocument(theme: ThemeMode) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme === THEME_DARK ? 'dark' : 'light';
  document.body.style.backgroundColor = theme === THEME_DARK ? '#141414' : '#ffffff';
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(getStoredTheme);

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
      applyThemeToDocument(next);
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === THEME_DARK ? THEME_LIGHT : THEME_DARK);
  }, [theme, setTheme]);

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const contextValue = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  const algorithm = theme === THEME_DARK ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider
        locale={ruRU}
        theme={{
          algorithm,
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
