import { useTheme as useNextTheme, UseThemeProps } from 'next-themes';
import { ThemeMode } from './constants.ts';

type TypedUseThemeProps = Omit<
  UseThemeProps,
  'theme' | 'setTheme' | 'resolvedTheme' | 'systemTheme' | 'themes'
> & {
  theme: ThemeMode | undefined;
  resolvedTheme: Exclude<ThemeMode, 'system'> | undefined;
  systemTheme: Exclude<ThemeMode, 'system'> | undefined;
  themes: ThemeMode[];
  setTheme: (theme: ThemeMode) => void;
};

export const useTheme = () => {
  return useNextTheme() as TypedUseThemeProps;
};
