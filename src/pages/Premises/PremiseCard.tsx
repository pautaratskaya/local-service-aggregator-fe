import { Link, useNavigate } from 'react-router-dom';
import { PREMISE_STATUSES, type Premise } from '../../api/admin/listLandlords';
import PhotoScroller from '../../components/PhotoScroller';
import { ruCount } from '../../helpers/ruCount';
import PinIcon from '../../icons/PinIcon';
import { formatPremiseStatus } from '../Admin/formatApplication';
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
  const navigate = useNavigate();
  const photos = [...premise.photos].sort((a, b) => a.order - b.order);

  return (
    <li className={styles.item}>
      <div className={styles.card}>
        <PhotoScroller
          photos={photos}
          className={`${styles.cover} ${photos.length > 1 ? styles.swipeable : ''}`}
          onActivate={() => navigate(`/premises/${premise.id}`)}
        >
          {({ index, scrollTo }) =>
            photos.length > 1 ? (
              <span className={styles.dots}>
                {photos.map((photo, photoIndex) => (
                  <button
                    key={photo.id}
                    type="button"
                    className={photoIndex === index ? styles.active : undefined}
                    aria-label={`Фото ${photoIndex + 1}`}
                    aria-current={photoIndex === index ? 'true' : undefined}
                    onClick={() => scrollTo(photoIndex)}
                  />
                ))}
              </span>
            ) : null
          }
        </PhotoScroller>
        <Link className={styles.body} to={`/premises/${premise.id}`}>
          <span className={styles.heading}>
            <span className={styles.title}>{premise.name}</span>
            <span className={styles.count}>
              {ruCount(
                premise.workspaces.length,
                'рабочее место',
                'рабочих мест',
                'рабочих места',
              )}
            </span>
          </span>
          <span className={styles.place}>
            <PinIcon />
            <span>
              {premise.city}, {premise.address}
            </span>
          </span>
          <span
            className={`${styles.status} ${STATUS_CLASS[premise.status] ?? ''}`}
          >
            {formatPremiseStatus(premise.status)}
          </span>
        </Link>
      </div>
    </li>
  );
}

export default PremiseCard;
