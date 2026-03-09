import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import clsx from 'clsx';
import styles from './AppLayout.module.css';

const { Header, Content, Sider } = Layout;

export interface AppLayoutProps {
  /** Содержимое шапки (например, AppHeader) */
  headerContent: ReactNode;
  /** Стили для Header (тема) */
  headerStyle?: React.CSSProperties;
  /** Класс для Header (например, тема светлая/тёмная) */
  headerClassName?: string;
  /** Опциональный сайдбар; если не передан, рендерится пустой Sider для сохранения структуры */
  siderContent?: ReactNode;
  /** Содержимое контентной области; по умолчанию Outlet */
  children?: ReactNode;
}

export function AppLayout({
  headerContent,
  headerStyle,
  headerClassName,
  siderContent,
  children,
}: AppLayoutProps) {
  return (
    <Layout className={styles.layout}>
      <Header style={headerStyle} className={clsx(headerClassName)}>
        {headerContent}
      </Header>
      <Layout>
        {siderContent != null ? (
          <Sider width={200} className={styles.sider}>
            {siderContent}
          </Sider>
        ) : null}
        <Content className={styles.content}>{children ?? <Outlet />}</Content>
      </Layout>
    </Layout>
  );
}
