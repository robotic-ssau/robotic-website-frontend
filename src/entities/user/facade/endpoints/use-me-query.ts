import { useEffect } from 'react';
import { useCurrentUserQuery } from '../../repository';
import { useUserStore } from '../store';

/**
 * Endpoint: запрос /me + синхронизация результата со стором.
 * При успехе — setUser(data), при 401 — logout(), иначе setInitComplete().
 */
export function useMeQuery(options: { enabled: boolean }) {
  const setUser = useUserStore((s) => s.setUser);
  const logout = useUserStore((s) => s.logout);
  const setInitComplete = useUserStore((s) => s.setInitComplete);

  const query = useCurrentUserQuery(options);

  useEffect(() => {
    if (!options.enabled) return;

    if (query.data) {
      setUser(query.data);
    }

    if (query.isError) {
      const status = (query.error as { response?: { status?: number } })?.response?.status;
      if (status === 401) {
        logout();
      } else {
        setInitComplete();
      }
    }
  }, [options.enabled, query.data, query.isError, query.error, setUser, logout, setInitComplete]);

  return query;
}
