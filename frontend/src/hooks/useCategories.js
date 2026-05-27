import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../services/api';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};
