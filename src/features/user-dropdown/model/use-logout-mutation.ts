import { useMutation } from '@tanstack/react-query';
import { useUserStore, logout as logoutApi, CURRENT_USER_QUERY_KEY } from '@/entities/user';
import { queryClient } from '@/shared/api';

const ACCESS_TOKEN_KEY = 'access_token';

export function useLogoutMutation() {
  const setUser = useUserStore((s) => s.setUser);

  return useMutation({
    mutationFn: logoutApi,
    onSettled: () => {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
      }
      setUser(null);
      queryClient.removeQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    },
  });
}
