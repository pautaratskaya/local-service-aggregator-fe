import { Link } from 'react-router-dom';
import { PREMISE_STATUSES, type Premise } from '../../api/admin/listLandlords';
import { ruCount } from '../../helpers/ruCount';
import { formatPremiseStatus } from '../Admin/formatApplication';
import CardPreview from './CardPreview';
import styles from './Premises.module.scss';

type PremiseCardProps = {
  premise: Premise;
};

const STATUS_CLASS: Record<string, string> = {
  [PREMISE_STATUSES.APPROVED]: styles.approved,
  [PREMISE_STATUSES.UNDER_REVIEW]: styles.review,
  [PREMISE_STATUSES.REJECTED]: styles.rejected,
};

function PremiseCard({ premise }: PremiseCardProps) {
  return (
    <li className={styles.item}>
      <Link className={styles.card} to={`/premises/${premise.id}`}>
        <CardPreview photos={premise.photos} />
        <span className={styles.body}>
          <span className={styles.title}>{premise.name}</span>
          <span className={styles.meta}>
            {premise.city}, {premise.address}
          </span>
          <span className={styles.footer}>
            <span
              className={`${styles.status} ${STATUS_CLASS[premise.status] ?? ''}`}
            >
              {formatPremiseStatus(premise.status)}
            </span>
            <span className={styles.meta}>
              {ruCount(
                premise.workspaces.length,
                'рабочее место',
                'рабочих мест',
                'рабочих места',
              )}
            </span>
          </span>
        </span>
      </Link>
    </li>
  );
}

export default PremiseCard;
