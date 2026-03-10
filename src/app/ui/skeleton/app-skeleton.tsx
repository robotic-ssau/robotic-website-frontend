import { Layout, Skeleton, Flex } from 'antd';
import styles from './AppSkeleton.module.css';

const { Header, Content } = Layout;

function AppSkeleton() {
  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <Skeleton.Input active size="small" className={styles.skeletonInput} />
        <Flex align="center" gap="middle">
          <Skeleton.Button active size="small" className={styles.skeletonButton} />
          <Skeleton.Button active size="small" className={styles.skeletonButton} />
          <Skeleton.Button active size="small" className={styles.skeletonButtonWide} />
          <Skeleton.Button active size="small" className={styles.skeletonButton} />
          <Skeleton.Avatar active size="small" shape="circle" />
        </Flex>
      </Header>
      <Content className={styles.content}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Content>
    </Layout>
  );
}

export default AppSkeleton;
