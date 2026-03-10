import { useEffect, useRef } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { App } from 'antd';

import { UNAUTHORIZED_EVENT_TYPE, UnauthorizedCustomEventType } from '@/shared/api';
import { matchRouteMeta } from '@/shared/routing';

import { useUserStore, useAuthInit } from '@/entities/user';

import { ALL_ROUTES_META } from '@/pages/routes.ts';

import { AppSkeleton } from '@/app/ui';

/**
 * Пути, требующие авторизации (защищённые маршруты).
 * При добавлении новых защищённых страниц — дополнять массив.
 */
export const PROTECTED_ROUTES = ALL_ROUTES_META.filter((route) => route.requiredRoles);

/**
 * Проверяет, является ли путь защищённым (требующим авторизации).
 */
export function isProtectedPath(pathname: string): boolean {
  return Boolean(matchRouteMeta(pathname, PROTECTED_ROUTES));
}

/**
 * Обёртка для инициализации авторизации и умного редиректа.
 * Показывает скелетон пока идёт инициализация (!isInit).
 * После инициализации: если не авторизован и путь защищён — редирект на /login,
 * если не авторизован и путь публичный — показ сообщения об истечении сессии.
 */
export function AuthInitWrapper() {
  const { message } = App.useApp();
  useAuthInit();

  const isInit = useUserStore((s) => s.isInit);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const location = useLocation();
  const navigate = useNavigate();
  const sessionExpiredShown = useRef(false);

  useEffect(() => {
    const handleUnauthorized = (event: Event) => {
      const customEvent = event as CustomEvent<UnauthorizedCustomEventType>;
      const { pathname } = customEvent.detail;
      if (isProtectedPath(pathname)) {
        navigate('/login', { state: { from: { pathname } }, replace: true });
      } else if (!sessionExpiredShown.current) {
        message.error('Сессия истекла');
        sessionExpiredShown.current = true;
      }
    };

    window.addEventListener(UNAUTHORIZED_EVENT_TYPE, handleUnauthorized);
    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT_TYPE, handleUnauthorized);
    };
  }, [navigate, message]);

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
