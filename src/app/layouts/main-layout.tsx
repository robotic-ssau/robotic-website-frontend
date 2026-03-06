import type { ReactNode } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();

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
    <div>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          borderBottom: '1px solid #e5e5e5',
        }}
      >
        <span style={{ fontWeight: 600 }}>Портал клуба</span>
        <nav style={{ display: 'flex', gap: 16 }}>
          <Link to="/">Главная</Link>
          <Link to="/profile">Профиль</Link>
          <Link to="/lab">Лаборатория</Link>
          <Link to="/admin">Админка</Link>
        </nav>
      </header>

      <main style={{ padding: '24px' }}>{children ?? <Outlet />}</main>
    </div>
  );
}
