import { useEffect } from 'react';
import { useMeQuery } from '../endpoints';
import { useUserStore } from '../store';

const ACCESS_TOKEN_KEY = 'access_token';

function getStoredToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Хук инициализации авторизации (гидратация сессии).
 * Вызывается при первом рендере приложения.
 * Если токен есть, делает запрос /me; при успехе — setUser, при 401 — logout.
 * После завершения (успех/ошибка/отсутствие токена) — setInitComplete.
 */
export function useAuthInit() {
  const token = getStoredToken();
  const setUser = useUserStore((s) => s.setUser);
  const setInitComplete = useUserStore((s) => s.setInitComplete);

  useMeQuery({ enabled: Boolean(token) });

  useEffect(() => {
    if (!token) {
      setUser(null);
      setInitComplete();
    }
  }, [token, setUser, setInitComplete]);
}
