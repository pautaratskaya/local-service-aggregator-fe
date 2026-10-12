import { Link } from 'react-router-dom';
import type { Workspace } from '../../api/admin/listLandlords';
import CardPreview from './CardPreview';
import styles from './Premises.module.scss';

type WorkspaceCardProps = {
  premiseId: number;
  workspace: Workspace;
};

function WorkspaceCard({ premiseId, workspace }: WorkspaceCardProps) {
  return (
    <li className={styles.item}>
      <Link
        className={styles.card}
        to={`/premises/${premiseId}/workspaces/${workspace.id}`}
      >
        <CardPreview photos={workspace.photos} />
        <span className={styles.body}>
          <span className={styles.title}>{workspace.kind}</span>
          {workspace.description && (
            <span className={styles.meta}>{workspace.description}</span>
          )}
          <span className={styles.footer}>
            <span>{workspace.pricePerHour} Br/час</span>
            <span className={styles.meta}>
              от {workspace.minRentMinutes} мин
            </span>
          </span>
        </span>
      </Link>
    </li>
  );
}

export default WorkspaceCard;
