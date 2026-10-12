import type { LandlordPhoto } from '../../api/admin/listLandlords';
import styles from './Premises.module.scss';

type CardPreviewProps = {
  photos: LandlordPhoto[];
};

function CardPreview({ photos }: CardPreviewProps) {
  const sorted = [...photos].sort((a, b) => a.order - b.order);
  const shown = sorted.slice(0, 3);
  const extra = sorted.length - shown.length;
  const layout =
    shown.length <= 1
      ? styles.single
      : shown.length === 2
        ? styles.pair
        : styles.mosaic;

  return (
    <div className={`${styles.preview} ${layout}`}>
      {shown.length === 0 ? (
        <span className={styles.placeholder}>Нет фото</span>
      ) : (
        shown.map((photo, index) => {
          const isLead = index === 0 && shown.length > 2;
          const showMore = index === shown.length - 1 && extra > 0;

          if (showMore) {
            return (
              <span key={photo.id} className={styles.tile}>
                <img src={photo.url} alt="" />
                <span className={styles.more}>+{extra}</span>
              </span>
            );
          }

          return (
            <img
              key={photo.id}
              className={isLead ? styles.lead : undefined}
              src={photo.url}
              alt=""
            />
          );
        })
      )}
    </div>
  );
}

export default CardPreview;
