import { useEffect, useMemo, useState } from 'react';
import type { MenuProps } from 'antd';
import { Button, Dropdown } from 'antd';
import { MoonOutlined, SunOutlined, SyncOutlined } from '@ant-design/icons';
import { useTheme } from '../model/use-theme';
import { THEME_DARK, THEME_LIGHT, THEME_SYSTEM, type ThemeMode } from '@/shared/lib/theme';
import styles from './theme-toggle.module.css';

/**
 * Универсальный переключатель темы с поддержкой light/dark/system.
 * Основан на Ant Design Dropdown + Button.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mode: ThemeMode =
    theme === THEME_LIGHT || theme === THEME_DARK || theme === THEME_SYSTEM ? theme : THEME_SYSTEM;

  const items = useMemo<MenuProps['items']>(
    () => [
      {
        key: THEME_SYSTEM,
        label: 'Системная',
        icon: <SyncOutlined />,
        onClick: () => setTheme(THEME_SYSTEM),
      },
      {
        key: THEME_LIGHT,
        label: 'Светлая',
        icon: <SunOutlined />,
        onClick: () => setTheme(THEME_LIGHT),
      },
      {
        key: THEME_DARK,
        label: 'Тёмная',
        icon: <MoonOutlined />,
        onClick: () => setTheme(THEME_DARK),
      },
    ],
    [setTheme],
  );

  let IconComponent = SyncOutlined;
  let ariaLabel = 'Системная тема';

  if (mode === THEME_DARK) {
    IconComponent = MoonOutlined;
    ariaLabel = 'Тёмная тема';
  } else if (mode === THEME_LIGHT) {
    IconComponent = SunOutlined;
    ariaLabel = 'Светлая тема';
  }

  if (!mounted) {
    return null;
  }

  return (
    <Dropdown
      menu={{
        items,
        selectedKeys: [mode],
      }}
      trigger={['hover']}
      placement="bottomRight"
    >
      <Button
        type="text"
        className={styles.toggle}
        icon={<IconComponent />}
        aria-label={ariaLabel}
      />
    </Dropdown>
  );
}
