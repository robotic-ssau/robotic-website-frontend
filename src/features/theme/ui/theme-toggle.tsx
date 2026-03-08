import { Segmented } from 'antd';
import { useTheme } from '../model/use-theme';
import { THEME_DARK, THEME_LIGHT, type ThemeMode } from '@/shared/lib/theme';

const THEME_OPTIONS: { label: string; value: ThemeMode }[] = [
  { label: 'Светлая', value: THEME_LIGHT },
  { label: 'Тёмная', value: THEME_DARK },
];

/**
 * Переключатель светлой/тёмной темы. Используется на экране логина и в шапке приложения.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Segmented
      value={theme}
      options={THEME_OPTIONS}
      onChange={(value) => {
        if (value === THEME_LIGHT || value === THEME_DARK) setTheme(value);
      }}
      size="small"
      aria-label="Переключить тему"
    />
  );
}
