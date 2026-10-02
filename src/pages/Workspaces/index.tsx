import { useState } from 'react';
import FetchErrorNotice from '../../components/FetchErrorNotice';
import PageLoader from '../../components/PageLoader';
import { useLandlordWorkspaces } from '../../hooks/useLandlordWorkspaces';
import WorkspaceCard from './WorkspaceCard';
import styles from './Workspaces.module.scss';

function Workspaces() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { data, isLoading, isError, error, refetch, isFetching } =
    useLandlordWorkspaces(true);

  if (isLoading || (isError && isFetching)) {
    return <PageLoader />;
  }

  if (isError) {
    return (
      <FetchErrorNotice
        message={
          error instanceof Error
            ? error.message
            : 'Не удалось загрузить помещения'
        }
        actionLabel="Повторить"
        onAction={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <div className={styles.workspaces}>
      <h1>Мои помещения</h1>
      {data && data.length > 0 ? (
        <ul className={styles.list}>
          {data.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
              isExpanded={expandedId === workspace.id}
              onToggle={() =>
                setExpandedId((current) =>
                  current === workspace.id ? null : workspace.id,
                )
              }
            />
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>Помещений пока нет</p>
      )}
    </div>
  );
}

export default Workspaces;
