import { useQuery } from '@tanstack/react-query';
import { getArticles } from '../services/api';

export const useArticles = (page = 1) => {
  return useQuery({
    queryKey: ['articles', page],
    queryFn: () => getArticles(page),
  });
};
