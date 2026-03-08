import { useEffect, useRef } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useUserStore, useAuthInit } from '@/entities/user';
import { isProtectedPath } from '@/shared/config/routes';
import { AppSkeleton } from '@/app/ui';

/**
 * Обёртка для инициализации авторизации и умного редиректа.
 * Показывает скелетон пока идёт инициализация (!isInit).
 * После инициализации: если не авторизован и путь защищён — редирект на /login,
 * если не авторизован и путь публичный — показ сообщения об истечении сессии.
 */
export function AuthInitWrapper() {
  useAuthInit();

  const isInit = useUserStore((s) => s.isInit);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const location = useLocation();
  const navigate = useNavigate();
  const sessionExpiredShown = useRef(false);

  useEffect(() => {
    const handleUnauthorized = (event: Event) => {
      const customEvent = event as CustomEvent<{ pathname: string }>;
      const { pathname } = customEvent.detail;
      if (isProtectedPath(pathname)) {
        navigate('/login', { state: { from: { pathname } }, replace: true });
      } else if (!sessionExpiredShown.current) {
        message.error('Сессия истекла');
        sessionExpiredShown.current = true;
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [navigate]);

  if (!isInit) {
    return <AppSkeleton />;
  }

  if (!isAuthenticated && isProtectedPath(location.pathname)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuthenticated && !sessionExpiredShown.current && location.pathname !== '/login') {
    const hasToken = typeof localStorage !== 'undefined' && localStorage.getItem('access_token');
    if (hasToken) {
      message.error('Сессия истекла');
      sessionExpiredShown.current = true;
    }
  }

  return <Outlet />;
}
