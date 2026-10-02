import FetchErrorNotice from '../../components/FetchErrorNotice';
import PageLoader from '../../components/PageLoader';
import { formatWorkspaceStatus } from '../Admin/formatApplication';
import { useLandlordWorkspaces } from '../../hooks/useLandlordWorkspaces';
import styles from './Workspaces.module.scss';

function Workspaces() {
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
            <li key={workspace.id} className={styles.item}>
              <span className={styles.name}>{workspace.name}</span>
              <span className={styles.address}>
                {workspace.city}, {workspace.address}
              </span>
              <span className={styles.status}>
                {formatWorkspaceStatus(workspace.status)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>Помещений пока нет</p>
      )}
    </div>
  );
}

export default Workspaces;
