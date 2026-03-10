import { Navigate, useLocation } from 'react-router-dom';
import { Card, Typography } from 'antd';

import { useUserStore } from '@/entities/user';
import { LoginForm } from '@/features/auth-by-username';

import styles from './LoginPage.module.css';

const { Title } = Typography;

export function LoginPage() {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;

  if (isAuthenticated) {
    return <Navigate to={from ?? '/'} replace />;
  }

  return (
    <div className={styles.content}>
      <Card className={styles.card}>
        <Title level={2} className={styles.title}>
          Вход
        </Title>
        <LoginForm />
      </Card>
    </div>
  );
}

export default LoginPage;
