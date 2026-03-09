import { Link, useNavigate } from 'react-router-dom';
import { Flex, Typography, Button } from 'antd';
import { useUserStore } from '@/entities/user';
import { ThemeToggle } from '@/features/theme';
import { UserDropdown } from '@/features/user-dropdown';
import styles from './AppHeader.module.css';

const { Text } = Typography;

export function AppHeader() {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const navigate = useNavigate();

  return (
    <Flex align="center" justify="space-between" className={styles.flex}>
      <Text strong className={styles.title}>
        Портал клуба
      </Text>
      <Flex align="center" gap="middle">
        <Link to="/" className={styles.navLink}>
          Главная
        </Link>
        <Link to="/profile" className={styles.navLink}>
          Профиль
        </Link>
        <Link to="/lab" className={styles.navLink}>
          Лаборатория
        </Link>
        <Link to="/admin" className={styles.navLink}>
          Админка
        </Link>
        <ThemeToggle />
        {isAuthenticated ? (
          <UserDropdown />
        ) : (
          <Button type="primary" size="small" onClick={() => navigate('/login')}>
            Войти
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
