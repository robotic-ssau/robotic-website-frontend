import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, mapLoginResponseDtoToDomain, useUserStore } from '@/entities/user';

const ACCESS_TOKEN_KEY = 'access_token';

export function useLoginMutation() {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useUserStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await login(credentials);
      return mapLoginResponseDtoToDomain(response);
    },
    onSuccess: (data) => {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.token);
      setUser(data.user);
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;
      navigate(from ?? '/', { replace: true });
    },
  });
}
