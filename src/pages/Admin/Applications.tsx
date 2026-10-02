import { useState } from 'react';
import FetchErrorNotice from '../../components/FetchErrorNotice';
import PageLoader from '../../components/PageLoader';
import { useAuthStore } from '../../stores/authStore';
import { useApproveLandlord } from './hooks/useApproveLandlord';
import { usePendingLandlords } from './hooks/usePendingLandlords';
import { useRejectLandlord } from './hooks/useRejectLandlord';
import WorkspaceRow from './WorkspaceRow';
import styles from './Admin.module.scss';

function AdminApplications() {
  const token = useAuthStore((state) => state.token);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const rejectMutation = useRejectLandlord();
  const approveMutation = useApproveLandlord();
  const { data, isLoading, isError, error, refetch, isFetching } =
    usePendingLandlords();

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
