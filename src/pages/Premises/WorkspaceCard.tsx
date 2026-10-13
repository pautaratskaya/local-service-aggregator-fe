import { Link, useNavigate } from 'react-router-dom';
import type { Workspace } from '../../api/admin/listLandlords';
import PhotoScroller from '../../components/PhotoScroller';
import styles from './Premises.module.scss';

type WorkspaceCardProps = {
  premiseId: number;
  workspace: Workspace;
};

function WorkspaceCard({ premiseId, workspace }: WorkspaceCardProps) {
  const navigate = useNavigate();
  const photos = [...workspace.photos].sort((a, b) => a.order - b.order);
  const to = `/premises/${premiseId}/workspaces/${workspace.id}`;

  return (
    <li className={styles.item}>
      <div className={styles.card}>
        <PhotoScroller
          photos={photos}
          className={`${styles.cover} ${photos.length > 1 ? styles.swipeable : ''}`}
          onActivate={() => navigate(to)}
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
        <Link className={styles.body} to={to}>
          <span className={styles.heading}>
            <span className={styles.title}>{workspace.kind}</span>
            <span className={styles.count}>
              {workspace.pricePerHour} Br/час
            </span>
          </span>
          <span className={styles.place}>
            <span>от {workspace.minRentMinutes} мин</span>
          </span>
        </Link>
      </div>
    </li>
  );
}

export default WorkspaceCard;
