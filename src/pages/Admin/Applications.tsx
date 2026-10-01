import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../api/admin/adminService';
import FetchErrorNotice from '../../components/FetchErrorNotice';
import PageLoader from '../../components/PageLoader';
import { useToast } from '../../components/Toast/toastContext';
import { useAuthStore } from '../../stores/authStore';
import { ROLE_APPLICATION_STATUSES } from '../../types/user';
import WorkspaceRow from './WorkspaceRow';
import styles from './Admin.module.scss';

function AdminApplications() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const showToast = useToast();
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const rejectMutation = useMutation({
    mutationFn: (userId: number) => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.rejectLandlord({ token, userId });
    },
    onSuccess: async () => {
      showToast('success', 'Заявка отклонена');
      await queryClient.invalidateQueries({ queryKey: ['admin-landlords'] });
    },
    onError: (error) => {
      showToast(
        'error',
        error instanceof Error ? error.message : 'Не удалось отклонить заявку'
      );
    },
  });
  const approveMutation = useMutation({
    mutationFn: (userId: number) => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.approveLandlord({ token, userId });
    },
    onSuccess: async () => {
      showToast('success', 'Заявка одобрена');
      await queryClient.invalidateQueries({ queryKey: ['admin-landlords'] });
    },
    onError: (error) => {
      showToast(
        'error',
        error instanceof Error ? error.message : 'Не удалось одобрить заявку'
      );
    },
  });
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: [
      'admin-landlords',
      ROLE_APPLICATION_STATUSES.WAITING_APPROVAL,
    ],
    queryFn: () => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.listLandlords({
        token,
        roleRequestStatus: ROLE_APPLICATION_STATUSES.WAITING_APPROVAL,
      });
    },
    enabled: !!token,
  });

  if (!token) {
    return <p className={styles.empty}>Требуется авторизация</p>;
  }

  if (isLoading || (isError && isFetching)) {
    return <PageLoader />;
  }

  if (isError) {
    return (
      <FetchErrorNotice
        message={
          error instanceof Error ? error.message : 'Не удалось загрузить заявки'
        }
        actionLabel="Повторить"
        onAction={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <div className={styles.admin}>
      <h1>Заявки на роль арендодателя</h1>
      {data && data.some((request) => request.workspaces.length > 0) ? (
        <ol className={styles.list}>
          {data.flatMap((request) =>
            request.workspaces.map((workspace) => {
              const itemKey = `${request.userId}-${workspace.id}`;

              return (
                <WorkspaceRow
                  key={itemKey}
                  request={request}
                  workspace={workspace}
                  isExpanded={expandedKey === itemKey}
                  isDeciding={
                    rejectMutation.isPending || approveMutation.isPending
                  }
                  rejectMutation={rejectMutation}
                  approveMutation={approveMutation}
                  onToggle={() =>
                    setExpandedKey((current) =>
                      current === itemKey ? null : itemKey
                    )
                  }
                />
              );
            })
          )}
        </ol>
      ) : (
        <p className={styles.empty}>Заявок нет</p>
      )}
    </div>
  );
}

export default AdminApplications;
