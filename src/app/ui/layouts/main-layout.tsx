import { Outlet, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import { AppHeader } from '@/widgets/header';
import { mainLayoutRoutesMeta } from '@/pages/routes.ts';
import styles from './MainLayout.module.css';

const { Header, Content } = Layout;

export function MainLayout() {
  const { pathname } = useLocation();

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <AppHeader variant="full" routesMeta={mainLayoutRoutesMeta} pathname={pathname} />
      </Header>
      <Content className={styles.content}>
        <Outlet />
      </Content>
    </Layout>
  );
}
