import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../../api/admin/adminService';
import type { AdminWorkspaceTypePayload } from '../../../api/admin/workspaceType';
import type { CatalogGroup } from '../../../api/catalog/getCatalogTree';
import { useToast } from '../../../components/Toast/toastContext';
import { useAuthStore } from '../../../stores/authStore';
import { catalogTreeQueryKey } from './useCatalogTree';
import { workspaceTypeQueryKey } from './useGetWorkspaceType';

export type CreateWorkspaceTypeVariables = {
  groupId: number;
  payload: AdminWorkspaceTypePayload;
};

export function useCreateWorkspaceType() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const showToast = useToast();

  return useMutation({
    mutationFn: ({ groupId, payload }: CreateWorkspaceTypeVariables) => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.createWorkspaceType(token, groupId, payload);
    },
    onSuccess: (created) => {
      showToast('success', 'Тип помещения добавлен');
      queryClient.setQueryData(workspaceTypeQueryKey(created.id), created);
      queryClient.setQueryData<CatalogGroup[]>(catalogTreeQueryKey, (current) =>
        current?.map((group) =>
          group.id === created.groupId
            ? {
                ...group,
                workspaceTypes: [
                  ...group.workspaceTypes,
                  {
                    id: created.id,
                    name: created.name,
                    description: created.description,
                    shared: created.shared,
                    services: [],
                  },
                ],
              }
            : group,
        ),
      );
    },
    onError: (error) => {
      showToast(
        'error',
        error instanceof Error
          ? error.message
          : 'Не удалось добавить тип помещения',
      );
    },
  });
}
