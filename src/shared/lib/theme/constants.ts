/** Ключ сохранения темы в localStorage (синхронно читается до загрузки React) */
export const THEME_STORAGE_KEY = 'app-theme';

export const THEME_LIGHT = 'light';
export const THEME_DARK = 'dark';
export const THEME_SYSTEM = 'system';

export type ThemeMode = typeof THEME_LIGHT | typeof THEME_DARK | typeof THEME_SYSTEM;

export const DEFAULT_THEME: ThemeMode = THEME_SYSTEM;
