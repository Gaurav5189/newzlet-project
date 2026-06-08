import { useQuery } from '@tanstack/react-query';
import { getArticles } from '../services/api';

export const useArticles = (page = 1, pageSize = 12) => {
  return useQuery({
    queryKey: ['articles', page, pageSize],
    queryFn: () => getArticles(page, pageSize),
  });
};
