import { useQuery } from '@tanstack/react-query';
import { catalogService } from '../api/catalog/catalogService';

export const workspaceTypesQueryKey = ['catalog', 'workspace-types'] as const;

export function useWorkspaceTypes() {
  return useQuery({
    queryKey: workspaceTypesQueryKey,
    queryFn: () => catalogService.listWorkspaceTypes(),
  });
}
