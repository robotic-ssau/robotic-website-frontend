import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Dropdown, Flex, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import Logo from '@assets/logo.svg?react';
import { defaultAuthRoutesConfig } from '@/shared/routing/auth-routes';
import { useLogoutMutation } from '@/features/user-dropdown';
import { useHeaderNav } from '../facade/hooks/use-header-nav';
import type { AppHeaderProps } from './app-header.types';
import styles from './AppHeader.module.css';

const { Text } = Typography;

export function AppHeaderMobile({
  variant = 'full',
  routesMeta,
  pathname,
  authRoutes,
}: AppHeaderProps) {
  const location = useLocation();

  const navigate = useNavigate();
  const showNav = variant === 'full';
  const { mutate: logout, isPending } = useLogoutMutation();

  const { navItems, isAuthenticated, user, activeKey } = useHeaderNav({
    routesMeta,
    pathname,
  });

  const authConfig = authRoutes ?? defaultAuthRoutesConfig;

  const menuItems = useMemo<MenuProps['items']>(() => {
    const items: MenuProps['items'] = [];

    if (!isAuthenticated) {
      items.push({
        key: 'login',
        label: 'Войти',
        onClick: () => navigate(authConfig.loginPath, { state: { from: location } }),
      });
      items.push({ type: 'divider' });
      items.push(
        ...navItems.map(({ key, title, path }) => ({
          key,
          label: title,
          onClick: () => navigate(path),
        })),
      );
      return items;
    }

    items.push({
      key: 'profile',
      label: (
        <Flex vertical gap={2}>
          <Text strong>{user?.displayName || user?.email}</Text>
          {user?.email && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {user.email}
            </Text>
          )}
        </Flex>
      ),
      icon: <UserOutlined />,
      onClick: () => navigate(authConfig.profilePath),
    });
    items.push({ type: 'divider' });
    items.push(
      ...navItems
        .filter((item) => item.path !== authConfig.profilePath)
        .map(({ key, title, path }) => ({
          key,
          label: title,
          onClick: () => navigate(path),
        })),
    );
    items.push({ type: 'divider' });
    items.push({
      key: 'logout',
      label: 'Выйти из аккаунта',
      danger: true,
      disabled: isPending,
      onClick: () => logout(),
    });

    return items;
  }, [
    isAuthenticated,
    user?.displayName,
    user?.email,
    navItems,
    isPending,
    navigate,
    authConfig.loginPath,
    authConfig.profilePath,
    location,
    logout,
  ]);

  return (
    <Flex align="center" justify={showNav ? 'space-between' : 'center'} className={styles.flex}>
      {showNav && <div style={{ width: 32 }} />}
      <Flex align="center" justify="center" gap="middle" className={styles.brand}>
        <Flex
          align="center"
          justify="center"
          className={styles.title}
          onClick={() => navigate('/')}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate('/');
            }
          }}
        >
          <Logo className={styles.logo} width={48} height={48} aria-hidden />
          <Text strong>Robotic</Text>
        </Flex>
      </Flex>
      {showNav && (
        <Flex align="center" gap="small">
          <Dropdown
            menu={{ items: menuItems, selectedKeys: [activeKey] }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button type="text" icon={<MenuOutlined />} />
          </Dropdown>
        </Flex>
      )}
    </Flex>
  );
}
