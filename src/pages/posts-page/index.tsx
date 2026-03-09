import { useRef, useEffect } from 'react';
import type { AppRouteMeta } from '@/shared/routing/types';
import { usePostsList } from '@/entities/post';
import type { Role } from '@/entities/user';
import styles from './posts-page.module.css';

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

  if (isError) {
    return (
      <div className={styles.wrapper}>
        <h1>Посты</h1>
        <p className={styles.error}>Ошибка загрузки: {error?.message ?? 'Неизвестная ошибка'}</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h1>Посты</h1>

      {isLoading ? (
        <p className={styles.loading}>Загрузка…</p>
      ) : (
        <ul className={styles.list}>
          {posts.map((post) => (
            <li key={post.id} className={styles.item}>
              <h2 className={styles.title}>{post.title}</h2>
              <p className={styles.content}>{post.content || '—'}</p>
            </li>
          ))}
        </ul>
      )}

      <div ref={sentinelRef} aria-hidden className={styles.sentinel} />
      {isFetchingNextPage && <p className={styles.loading}>Загрузка следующих…</p>}
    </div>
  );
}

export default PostsPage;

export const postsRouteMeta: AppRouteMeta<Role> = {
  path: '/posts',
  key: 'posts',
  title: 'Новости',
  showInMainNav: true,
  element: <PostsPage />,
};
