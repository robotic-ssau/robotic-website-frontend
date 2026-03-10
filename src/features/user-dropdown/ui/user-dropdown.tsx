import { useMemo } from 'react';
import { Avatar, Dropdown, MenuProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { useUserStore } from '@/entities/user';
import { useGetUserDropdownItems } from './use-get-user-dropdown-items.tsx';

import styles from './UserDropdown.module.css';

type MenuItems = NonNullable<MenuProps['items']>;

function UserDropdown() {
  const user = useUserStore((s) => s.user);

  const { userProfileItem, userLogout } = useGetUserDropdownItems();

  const menuItems: MenuItems = useMemo(() => {
    if (!userLogout) return [userProfileItem];
    return [userProfileItem, { type: 'divider' }, userLogout];
  }, [userLogout, userProfileItem]);

  const alt = user?.displayName || user?.email;

  return (
    <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
      <Avatar icon={<UserOutlined />} className={styles.avatar} alt={alt} />
    </Dropdown>
  );
}
export default UserDropdown;
