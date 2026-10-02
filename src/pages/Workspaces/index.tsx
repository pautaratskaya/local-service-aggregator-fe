import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import FetchErrorNotice from '../../components/FetchErrorNotice';
import PageLoader from '../../components/PageLoader';
import { useLandlordWorkspaces } from '../../hooks/useLandlordWorkspaces';
import WorkspaceCard from './WorkspaceCard';
import styles from './Workspaces.module.scss';

function Workspaces() {
  const navigate = useNavigate();
  const location = useLocation();
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
            : 'Не удалось загрузить рабочие места'
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
      <div className={styles.header}>
        <h1>Мои рабочие места</h1>
        <Button
          type="button"
          className={styles.addButton}
          cta
          onClick={() =>
            navigate('/add-workspace', { state: { background: location } })
          }
        >
          Добавить рабочее место
        </Button>
      </div>
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
        <p className={styles.empty}>Рабочих мест пока нет</p>
      )}
    </div>
  );
}

export default Workspaces;
