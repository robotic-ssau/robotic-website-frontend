import type { ReactNode } from 'react';
import { AppLayout } from '@/app/layout';
import { AppHeader } from '@/widgets/header';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <AppLayout headerContent={<AppHeader />} headerClassName={styles.header}>
      {children}
    </AppLayout>
  );
}
