import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Typography, Button, Menu } from 'antd';
import type { MenuProps } from 'antd';
import Logo from '@assets/logo.svg?react';
import { ThemeToggle } from '@/features/theme';
import { UserDropdown } from '@/features/user-dropdown';
import { DEFAULT_AUTH_ROUTES_CONFIG } from '@/shared/routing/auth-routes';
import { useHeaderNav } from '../facade/hooks/use-header-nav';
import type { AppHeaderProps } from './app-header.types';
import styles from './AppHeader.module.css';

const { Title } = Typography;

const { loginPath } = DEFAULT_AUTH_ROUTES_CONFIG;

export function AppHeaderDesktop({ variant = 'full', routesMeta, pathname }: AppHeaderProps) {
  const navigate = useNavigate();
  const showNav = variant === 'full';

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { navItems, activeKey, isAuthenticated } = useHeaderNav({
    routesMeta,
    pathname,
  });

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    const target = navItems.find((item) => item.key === key);
    if (target?.path) navigate(target.path);
  };

  const menuItems = navItems.map(({ key, title, path }) => ({
    key,
    label: title,
    onClick: () => navigate(path),
  }));

  return (
    <Flex align="center" justify="space-between" className={styles.flex}>
      <Flex align="center" className={styles.brand} onClick={() => navigate('/')}>
        <Logo className={styles.logo} width={48} height={48} />
        <Title level={1} className={styles.title}>
          Robotic
        </Title>
      </Flex>

      <Flex align="center" gap="middle" justify="flex-end" flex={1}>
        <div className={styles.navWrapper} style={{ minHeight: 46 }}>
          {mounted ? (
            <Menu
              mode="horizontal"
              selectedKeys={activeKey ? [activeKey] : []}
              items={menuItems}
              onClick={handleMenuClick}
              className={styles.menu}
            />
          ) : (
            <div className={styles.menuHidden} aria-hidden />
          )}
        </div>

        <ThemeToggle />
        {showNav &&
          (isAuthenticated ? (
            <UserDropdown />
          ) : (
            <Button type="primary" size="small" onClick={() => navigate(loginPath)}>
              Войти
            </Button>
          ))}
      </Flex>
    </Flex>
  );
}
