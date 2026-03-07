import type { ReactNode } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Layout, Typography, Flex } from 'antd';
import { ThemeToggle, useTheme } from '@/features/theme';
import { THEME_DARK } from '@/shared/lib/theme';

const { Header, Content } = Layout;
const { Text } = Typography;

interface MainLayoutProps {
  children?: ReactNode;
}

const headerStyleLight = {
  background: '#fff',
  color: 'rgba(0, 0, 0, 0.88)',
  borderBottom: '1px solid rgba(5, 5, 5, 0.06)',
};
const headerStyleDark = {
  background: '#141414',
  color: 'rgba(255, 255, 255, 0.85)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
};

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === THEME_DARK;
  const headerStyle = isDark ? headerStyleDark : headerStyleLight;
  const navLinkStyle = { color: 'inherit' };

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7344/ingest/e6a99e2b-bb67-403e-b36f-d8c33bb14665', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': '2af046',
      },
      body: JSON.stringify({
        sessionId: '2af046',
        runId: 'pre-fix',
        hypothesisId: 'H3',
        location: 'src/app/layouts/main-layout.tsx:8',
        message: 'MainLayout location changed',
        data: {
          pathname: location.pathname,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={headerStyle}>
        <Flex align="center" justify="space-between" style={{ height: '100%' }}>
          <Text strong style={{ color: 'inherit', fontSize: 18 }}>
            Портал клуба
          </Text>
          <Flex align="center" gap="middle">
            <Link to="/" style={navLinkStyle}>
              Главная
            </Link>
            <Link to="/profile" style={navLinkStyle}>
              Профиль
            </Link>
            <Link to="/lab" style={navLinkStyle}>
              Лаборатория
            </Link>
            <Link to="/admin" style={navLinkStyle}>
              Админка
            </Link>
            <ThemeToggle />
          </Flex>
        </Flex>
      </Header>
      <Content style={{ padding: 24 }}>{children ?? <Outlet />}</Content>
    </Layout>
  );
}
