import { useRef, useEffect } from 'react';
import { Skeleton, Typography } from 'antd';

import { usePostsList } from '@/entities/post';

import styles from './posts-page.module.css';

const { Title, Text } = Typography;

export function PostsPage() {
  const { posts, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, isError, error } =
    usePostsList();

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return undefined;
    const el = sentinelRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: '100px', threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderSkeleton = () => (
    <div className={styles.list}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((key) => (
        <div key={key} className={styles.item}>
          <Skeleton active title={{ width: '60%' }} paragraph={{ rows: 2 }} />
        </div>
      ))}
    </div>
  );

  if (isError) {
    return (
      <div className={styles.wrapper}>
        <Title level={1}>Посты</Title>
        <Text type="danger">Ошибка загрузки: {error?.message ?? 'Неизвестная ошибка'}</Text>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Title level={2}>Посты</Title>

      {isLoading ? (
        renderSkeleton()
      ) : (
        <ul className={styles.list}>
          {posts.map((post) => (
            <li key={post.id} className={styles.item}>
              <Title level={3}>{post.title}</Title>
              <Text>{post.content || '—'}</Text>
            </li>
          ))}
        </ul>
      )}

      <div ref={sentinelRef} aria-hidden className={styles.sentinel} />
      {isFetchingNextPage && renderSkeleton()}
    </div>
  );
}

export default PostsPage;
