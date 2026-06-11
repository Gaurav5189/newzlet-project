import { useQuery } from '@tanstack/react-query';
import { searchArticles } from '../services/api';

export const useSearch = (params) => {
  return useQuery({
    queryKey: ['search', params],
    queryFn: () => searchArticles(params),
    enabled: !!params.q || !!params.category,
  });
};
