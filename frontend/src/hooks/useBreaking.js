import { useQuery } from '@tanstack/react-query';
import { getBreaking } from '../services/api';

export const useBreaking = () => {
  return useQuery({
    queryKey: ['breaking'],
    queryFn: getBreaking,
  });
};
