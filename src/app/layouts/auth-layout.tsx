import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import { AppHeader } from '@/widgets/header';
import styles from './MainLayout.module.css';

const { Header, Content } = Layout;

export function AuthLayout() {
  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <AppHeader variant="minimal" />
      </Header>
      <Content className={styles.content}>
        <Outlet />
      </Content>
    </Layout>
  );
}
