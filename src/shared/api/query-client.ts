import { QueryClient } from '@tanstack/react-query';

const defaultStaleTime = 60 * 1000; // 1 min
const defaultCacheTime = 5 * 60 * 1000; // 5 min

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: defaultStaleTime,
      gcTime: defaultCacheTime,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
