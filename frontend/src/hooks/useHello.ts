// src/hooks/useHello.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useHello() {
  return useQuery({
    queryKey: ['hello'],
    queryFn: async () => {
      const { data } = await api.get('/api/hello');
      return data.message as string;
    },
    retry: 3,
    staleTime: 1000 * 60, // 1 minuto
    refetchOnWindowFocus: false
  });
}