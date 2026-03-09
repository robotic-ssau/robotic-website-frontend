import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/entities/user';
import { defaultAuthRoutesConfig } from '@/shared/routing/auth-routes';
import { useLogoutMutation } from '../model/use-logout-mutation';
import styles from './UserDropdown.module.css';

const { Text } = Typography;

export function UserDropdown() {
  const user = useUserStore((s) => s.user);
  const { mutate: logout, isPending } = useLogoutMutation();
  const navigate = useNavigate();
  const { profilePath } = defaultAuthRoutesConfig;

  if (!user) return null;

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <div className={styles.menuUserBlock}>
          <Text strong className={styles.menuUserName}>
            {user.displayName || user.email}
          </Text>
          <Text type="secondary" className={styles.menuUserMeta}>
            {user.email}
          </Text>
        </div>
      ),
      icon: <UserOutlined />,
      onClick: () => navigate(profilePath),
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: 'Выйти из аккаунта',
      danger: true,
      disabled: isPending,
      onClick: () => logout(),
    },
  ];

  return (
    <Dropdown menu={{ items: menuItems }} trigger={['hover']} placement="bottomRight">
      <Avatar
        icon={<UserOutlined />}
        className={styles.avatar}
        alt={user.displayName || user.email}
      />
    </Dropdown>
  );
}
