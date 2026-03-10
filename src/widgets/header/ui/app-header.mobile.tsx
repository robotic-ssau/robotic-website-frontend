import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown, Flex, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Logo from '@assets/logo.svg?react';
import { useGetUserDropdownItems } from '@/features/user-dropdown';
import { useHeaderNav } from '../facade/hooks/use-header-nav';
import type { AppHeaderProps } from './app-header.types';
import styles from './AppHeader.module.css';

const { Title } = Typography;

export function AppHeaderMobile({ variant = 'full', routesMeta, pathname }: AppHeaderProps) {
  const navigate = useNavigate();
  const showNav = variant === 'full';

  const { userProfileItem, userLogout } = useGetUserDropdownItems();

  const { navItems, isAuthenticated, activeKey } = useHeaderNav({
    routesMeta,
    pathname,
  });

  const menuItems = useMemo<MenuProps['items']>(() => {
    const items: MenuProps['items'] = [userProfileItem, { type: 'divider' }];

    if (!isAuthenticated || !userLogout) {
      items.push(
        ...navItems.map(({ key, title, path }) => ({
          key,
          label: title,
          onClick: () => navigate(path),
        })),
      );
      return items;
    }

    items.push(
      ...navItems.map(({ key, title, path }) => ({
        key,
        label: title,
        onClick: () => navigate(path),
      })),
    );
    items.push({ type: 'divider' });
    items.push(userLogout);

    return items;
  }, [userProfileItem, isAuthenticated, userLogout, navItems, navigate]);

  return (
    <Flex align="center" justify={showNav ? 'space-between' : 'center'} className={styles.flex}>
      {showNav && <div style={{ width: 32 }} />}
      <Flex
        align="center"
        justify="center"
        className={styles.brand}
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
        <Title level={1} className={styles.title}>
          Robotic
        </Title>
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
