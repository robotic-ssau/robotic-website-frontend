import {
  THEME_STORAGE_KEY,
  THEME_DARK,
  THEME_LIGHT,
  DEFAULT_THEME,
  type ThemeMode,
} from './constants';

/**
 * Синхронно читает сохранённую тему из localStorage.
 * Используется при первой отрисовке и в inline-скрипте в index.html.
 */
export function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === THEME_DARK || stored === THEME_LIGHT) return stored;
  } catch {
    // ignore
  }
  return DEFAULT_THEME;
}
