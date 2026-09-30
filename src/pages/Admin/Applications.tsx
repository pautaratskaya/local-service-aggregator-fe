import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../api/admin/adminService';
import Button from '../../components/Button';
import FetchErrorNotice from '../../components/FetchErrorNotice';
import PageLoader from '../../components/PageLoader';
import { useAuthStore } from '../../stores/authStore';
import { LANDLORD_APPLICATION_STATUSES } from '../../types/landlord';
import styles from './Admin.module.scss';

function AdminApplications() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const reject = useMutation({
    mutationFn: (userId: number) => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.rejectLandlord({ token, userId });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-landlords'] });
    },
  });
  const approve = useMutation({
    mutationFn: (userId: number) => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.approveLandlord({ token, userId });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-landlords'] });
    },
  });
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: [
      'admin-landlords',
      LANDLORD_APPLICATION_STATUSES.WAITING_APPROVAL,
    ],
    queryFn: () => {
      if (!token) {
        throw new Error('Требуется авторизация');
      }

      return adminService.listLandlords({
        token,
        roleRequestStatus: LANDLORD_APPLICATION_STATUSES.WAITING_APPROVAL,
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
              const isExpanded = expandedKey === itemKey;
              const isDeciding = reject.isPending || approve.isPending;

              return (
                <li key={itemKey}>
                  <div className={styles.row}>
                    <button
                      type="button"
                      className={styles.summary}
                      aria-expanded={isExpanded}
                      onClick={() =>
                        setExpandedKey(isExpanded ? null : itemKey)
                      }
                    >
                      {request.realName} — {workspace.name}
                    </button>
                    <div className={styles.actions}>
                      <Button
                        type="button"
                        disabled={isDeciding}
                        onClick={() => reject.mutate(request.userId)}
                      >
                        Отклонить
                      </Button>
                      <Button
                        type="button"
                        disabled={isDeciding}
                        onClick={() => approve.mutate(request.userId)}
                        cta
                      >
                        Одобрить
                      </Button>
                    </div>
                  </div>
                  {reject.isError && reject.variables === request.userId && (
                    <p className={styles.actionError}>
                      {reject.error instanceof Error
                        ? reject.error.message
                        : 'Не удалось отклонить заявку'}
                    </p>
                  )}
                  {approve.isError && approve.variables === request.userId && (
                    <p className={styles.actionError}>
                      {approve.error instanceof Error
                        ? approve.error.message
                        : 'Не удалось одобрить заявку'}
                    </p>
                  )}
                  {isExpanded && (
                    <dl className={styles.details}>
                      <div>
                        <dt>Имя пользователя</dt>
                        <dd>{request.realName}</dd>
                      </div>
                      <div>
                        <dt>Название помещения</dt>
                        <dd>{workspace.name}</dd>
                      </div>
                      <div>
                        <dt>Телефон</dt>
                        <dd>{request.phone}</dd>
                      </div>
                      <div>
                        <dt>Город</dt>
                        <dd>{workspace.city}</dd>
                      </div>
                      <div>
                        <dt>Адрес</dt>
                        <dd>{workspace.address}</dd>
                      </div>
                      {workspace.photos.length > 0 && (
                        <div>
                          <dt>Фото</dt>
                          <dd>
                            <ul className={styles.photos}>
                              {workspace.photos.map((photo) => (
                                <li key={photo.id}>
                                  <img src={photo.url} alt="" />
                                </li>
                              ))}
                            </ul>
                          </dd>
                        </div>
                      )}
                    </dl>
                  )}
                </li>
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
