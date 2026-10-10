import { useState } from 'react';
import FetchErrorNotice from '../../components/FetchErrorNotice';
import PageLoader from '../../components/PageLoader';
import ApplicationRow from './ApplicationRow';
import { useApproveMaster } from './hooks/useApproveMaster';
import { usePendingMasters } from './hooks/usePendingMasters';
import { useRejectMaster } from './hooks/useRejectMaster';
import MasterDetails from './MasterDetails';
import styles from './Admin.module.scss';

function MasterApplications() {
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const rejectMasterMutation = useRejectMaster();
  const approveMasterMutation = useApproveMaster();
  const mastersQuery = usePendingMasters();

  const renderContent = () => {
    if (
      mastersQuery.isLoading ||
      (mastersQuery.isError && mastersQuery.isFetching)
    ) {
      return <PageLoader />;
    }

    if (mastersQuery.isError) {
      return (
        <FetchErrorNotice
          message={
            mastersQuery.error instanceof Error
              ? mastersQuery.error.message
              : 'Не удалось загрузить заявки'
          }
          actionLabel="Повторить"
          onAction={() => {
            void mastersQuery.refetch();
          }}
        />
      );
    }

    if (!mastersQuery.data || mastersQuery.data.length === 0) {
      return <p className={styles.empty}>Заявок нет</p>;
    }

    return (
      <ol className={styles.list}>
        {mastersQuery.data.map((request) => (
          <ApplicationRow
            key={request.userId}
            summary={`${request.realName} — ${request.master.name} — ${request.master.speciality}`}
            details={<MasterDetails request={request} />}
            isExpanded={expandedUserId === request.userId}
            isDeciding={
              rejectMasterMutation.isPending || approveMasterMutation.isPending
            }
            onApprove={() => approveMasterMutation.mutate(request.userId)}
            onReject={(reason) =>
              rejectMasterMutation.mutate({
                userId: request.userId,
                ...(reason ? { reason } : {}),
              })
            }
            onToggle={() =>
              setExpandedUserId((current) =>
                current === request.userId ? null : request.userId,
              )
            }
          />
        ))}
      </ol>
    );
  };

  return (
    <section>
      <h1>Заявки на роль мастера</h1>
      {renderContent()}
    </section>
  );
}

export default MasterApplications;
