import { Navigate, useLocation } from 'react-router-dom';
import { Card, Layout, Typography } from 'antd';
import { useUserStore } from '@/entities/user';
import { LoginForm } from '@/features/auth-by-username';
import { ThemeToggle } from '@/features/theme';
import styles from './LoginPage.module.css';

const { Content } = Layout;
const { Title } = Typography;

export function LoginPage() {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;

  if (isAuthenticated) {
    return <Navigate to={from ?? '/'} replace />;
  }

  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <div className={styles.themeToggleWrap}>
          <ThemeToggle />
        </div>
        <Card className={styles.card}>
          <Title level={2} className={styles.title}>
            Вход
          </Title>
          <LoginForm />
        </Card>
      </Content>
    </Layout>
  );
}

export default LoginPage;
