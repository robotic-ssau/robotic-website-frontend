import { useNavigate } from 'react-router-dom';
import { Flex, Typography, Button, Menu } from 'antd';
import type { MenuProps } from 'antd';
import Logo from '@assets/logo.svg?react';
import { ThemeToggle } from '@/features/theme';
import { UserDropdown } from '@/features/user-dropdown';
import { defaultAuthRoutesConfig } from '@/shared/routing/auth-routes';
import { useHeaderNav } from '../facade/hooks/use-header-nav';
import type { AppHeaderProps } from './app-header.types';
import styles from './AppHeader.module.css';

const { Text } = Typography;

export function AppHeaderDesktop({
  variant = 'full',
  routesMeta,
  pathname,
  authRoutes,
}: AppHeaderProps) {
  const navigate = useNavigate();
  const showNav = variant === 'full';
  const authConfig = authRoutes ?? defaultAuthRoutesConfig;

  const { navItems, activeKey, isAuthenticated } = useHeaderNav({
    routesMeta,
    pathname,
  });

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    const target = navItems.find((item) => item.key === key);
    if (target?.path) navigate(target.path);
  };

  return (
    <Flex align="center" justify="space-between" className={styles.flex}>
      {/* Логотип */}
      <Flex
        align="center"
        className={styles.brand}
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      >
        <Logo className={styles.logo} width={48} height={48} />
        <Text strong>Robotic</Text>
      </Flex>

      <Flex
        align="center"
        gap="middle"
        style={{ flex: 1, minWidth: 0, justifyContent: 'flex-end' }}
      >
        {showNav && navItems.length > 0 && (
          <div style={{ flex: 1, minWidth: 0, marginLeft: '30%' }}>
            <Menu
              mode="horizontal"
              selectedKeys={activeKey ? [activeKey] : []}
              items={navItems.map(({ key, title, path }) => ({
                key,
                label: title,
                onClick: () => navigate(path),
              }))}
              onClick={handleMenuClick}
              style={{ borderBottom: 'none', justifyContent: 'flex-end' }}
            />
          </div>
        )}

        <ThemeToggle />
        {showNav &&
          (isAuthenticated ? (
            <UserDropdown />
          ) : (
            <Button type="primary" size="small" onClick={() => navigate(authConfig.loginPath)}>
              Войти
            </Button>
          ))}
      </Flex>
    </Flex>
  );
}
