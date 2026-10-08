import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../../api/admin/adminService';
import type { AdminWorkspaceTypePayload } from '../../../api/admin/workspaceType';
import type { CatalogGroup } from '../../../api/catalog/getCatalogTree';
import { useToast } from '../../../components/Toast/toastContext';
import { useAuthStore } from '../../../stores/authStore';
import { catalogTreeQueryKey } from './useCatalogTree';
import { workspaceTypeQueryKey } from './useGetWorkspaceType';

export type UpdateWorkspaceTypeVariables = {
  id: number;
  payload: AdminWorkspaceTypePayload;
};

export function useUpdateWorkspaceType() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const showToast = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateWorkspaceTypeVariables) => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.updateWorkspaceType(token, id, payload);
    },
    onSuccess: (updated, { id }) => {
      showToast('success', 'Тип помещения сохранён');
      queryClient.setQueryData<CatalogGroup[]>(catalogTreeQueryKey, (current) =>
        current?.map((group) => ({
          ...group,
          workspaceTypes: group.workspaceTypes.map((workspaceType) =>
            workspaceType.id === id
              ? {
                  ...workspaceType,
                  name: updated.name,
                  description: updated.description,
                  shared: updated.shared,
                }
              : workspaceType,
          ),
        })),
      );
      queryClient.setQueryData(workspaceTypeQueryKey(id), updated);
    },
    onError: (error) => {
      showToast(
        'error',
        error instanceof Error
          ? error.message
          : 'Не удалось сохранить тип помещения',
      );
    },
  });
}
