import { MenuProps, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';

import { DEFAULT_AUTH_ROUTES_CONFIG } from '@/shared/routing';
import { useUserStore } from '@/entities/user';

import { useLogoutMutation } from '../facade/use-logout-mutation';

import styles from './UserDropdown.module.css';

const { Text } = Typography;

const { profilePath, loginPath } = DEFAULT_AUTH_ROUTES_CONFIG;

type MenuItem = NonNullable<MenuProps['items']>[number];

export type UseGetUserDropdownItemsReturn = {
  userProfileItem: MenuItem;
  userLogout: MenuItem | null;
};

export const useGetUserDropdownItems = (): UseGetUserDropdownItemsReturn => {
  const location = useLocation();
  const user = useUserStore((s) => s.user);
  const { mutate: logout, isPending } = useLogoutMutation();
  const navigate = useNavigate();

  if (!user)
    return {
      userProfileItem: {
        key: 'login',
        label: 'Войти',
        onClick: () => navigate(loginPath, { state: { from: location } }),
      },
      userLogout: null,
    };

  const userProfileItem: MenuItem = {
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
  };

  const userLogout: MenuItem = {
    key: 'logout',
    label: 'Выйти из аккаунта',
    danger: true,
    disabled: isPending,
    onClick: () => logout(),
  };

  return { userProfileItem, userLogout };
};
