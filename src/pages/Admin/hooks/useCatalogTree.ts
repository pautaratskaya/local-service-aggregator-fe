import { useQuery } from '@tanstack/react-query';
import { catalogService } from '../../../api/catalog/catalogService';

export const catalogTreeQueryKey = ['catalog', 'tree'] as const;

export function useCatalogTree() {
  return useQuery({
    queryKey: catalogTreeQueryKey,
    queryFn: () => catalogService.getCatalogTree(),
  });
}
