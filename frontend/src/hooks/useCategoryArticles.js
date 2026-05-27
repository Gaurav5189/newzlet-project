import { useQuery } from '@tanstack/react-query';
import { getCategoryArticles } from '../services/api';

export const useCategoryArticles = (slug, page) => {
  return useQuery({
    queryKey: ['categoryArticles', slug, page],
    queryFn: () => getCategoryArticles(slug, page),
    enabled: !!slug,
  });
};
