import { useState } from 'react';
import FetchErrorNotice from '../../components/FetchErrorNotice';
import PageLoader from '../../components/PageLoader';
import { formatDate } from '../../helpers';
import ApplicationRow from './ApplicationRow';
import { useApproveLandlord } from './hooks/useApproveLandlord';
import { usePendingLandlords } from './hooks/usePendingLandlords';
import { useRejectLandlord } from './hooks/useRejectLandlord';
import WorkspaceDetails from './WorkspaceDetails';
import styles from './Admin.module.scss';

function LandlordApplications() {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const rejectLandlordMutation = useRejectLandlord();
  const approveLandlordMutation = useApproveLandlord();
  const landlordsQuery = usePendingLandlords();

  const renderContent = () => {
    if (
      landlordsQuery.isLoading ||
      (landlordsQuery.isError && landlordsQuery.isFetching)
    ) {
      return <PageLoader />;
    }

    if (landlordsQuery.isError) {
      return (
        <FetchErrorNotice
          message={
            landlordsQuery.error instanceof Error
              ? landlordsQuery.error.message
              : 'Не удалось загрузить заявки'
          }
          actionLabel="Повторить"
          onAction={() => {
            void landlordsQuery.refetch();
          }}
        />
      );
    }

    if (
      !landlordsQuery.data ||
      !landlordsQuery.data.some((request) => request.workspaces.length > 0)
    ) {
      return <p className={styles.empty}>Заявок нет</p>;
    }

    return (
      <ol className={styles.list}>
        {landlordsQuery.data.flatMap((request) =>
          request.workspaces.map((workspace) => {
            const itemKey = `${request.userId}-${workspace.id}`;

            return (
              <ApplicationRow
                key={itemKey}
                summary={`${request.realName} — ${workspace.name} — ${formatDate(workspace.createdAt)}`}
                details={
                  <WorkspaceDetails request={request} workspace={workspace} />
                }
                isExpanded={expandedKey === itemKey}
                isDeciding={
                  rejectLandlordMutation.isPending ||
                  approveLandlordMutation.isPending
                }
                onApprove={() => approveLandlordMutation.mutate(request.userId)}
                onReject={(reason) =>
                  rejectLandlordMutation.mutate({
                    userId: request.userId,
                    ...(reason ? { reason } : {}),
                  })
                }
                onToggle={() =>
                  setExpandedKey((current) =>
                    current === itemKey ? null : itemKey,
                  )
                }
              />
            );
          }),
        )}
      </ol>
    );
  };

  return (
    <section>
      <h1>Заявки на роль арендодателя</h1>
      {renderContent()}
    </section>
  );
}

export default LandlordApplications;
