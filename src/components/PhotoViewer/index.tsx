import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDialogLock } from '../../hooks/useDialogLock';
import { CrossIcon } from '../../icons';
import styles from './PhotoViewer.module.scss';

function NavChevron({ direction }: { direction: 'left' | 'right' }) {
  const path =
    direction === 'right'
      ? 'M1.25 1 L6.75 7 L1.25 13'
      : 'M6.75 1 L1.25 7 L6.75 13';

  return (
    <svg width="8" height="14" viewBox="0 0 8 14" aria-hidden="true">
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type ViewerPhoto = {
  src: string;
};

type PhotoViewerProps = {
  photos: ViewerPhoto[];
  index: number;
  onClose: () => void;
  onIndex: (index: number) => void;
};

function PhotoViewer({ photos, index, onClose, onIndex }: PhotoViewerProps) {
  const activeThumbRef = useRef<HTMLButtonElement>(null);
  const photo = photos[index];
  const hasMany = photos.length > 1;

  useDialogLock();

  const showNext = () => {
    onIndex(index === photos.length - 1 ? 0 : index + 1);
  };

  const showPrev = () => {
    onIndex(index === 0 ? photos.length - 1 : index - 1);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }

      if (event.key === 'ArrowLeft' && hasMany) {
        event.preventDefault();
        onIndex(index === 0 ? photos.length - 1 : index - 1);
      }

      if ((event.key === 'ArrowRight' || event.key === 'Enter') && hasMany) {
        event.preventDefault();
        onIndex(index === photos.length - 1 ? 0 : index + 1);
      }

      if (event.key === 'Enter' && !hasMany) {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [hasMany, index, onClose, onIndex, photos.length]);

  useEffect(() => {
    activeThumbRef.current?.scrollIntoView({
      block: 'nearest',
      inline: 'center',
    });
  }, [index]);

  if (!photo) {
    return null;
  }

  return createPortal(
    <div className={styles.viewer} onClick={onClose}>
      <form
        className={styles.viewerForm}
        role="dialog"
        aria-modal="true"
        aria-label="Просмотр фотографий"
        onSubmit={(event) => {
          event.preventDefault();
          if (hasMany) {
            showNext();
          } else {
            onClose();
          }
        }}
      >
        <div
          className={styles.viewerBar}
          onClick={(event) => event.stopPropagation()}
        >
          <span>
            {index + 1} / {photos.length}
          </span>
          <button
            type={hasMany ? 'button' : 'submit'}
            className={styles.viewerClose}
            aria-label="Закрыть"
            onClick={onClose}
          >
            <CrossIcon />
          </button>
        </div>
        <div className={styles.viewerStage}>
          {hasMany && (
            <button
              type="button"
              className={`${styles.viewerNav} ${styles.prev}`}
              aria-label="Предыдущее фото"
              onClick={(event) => {
                event.stopPropagation();
                showPrev();
              }}
            >
              <NavChevron direction="left" />
            </button>
          )}
          <img
            src={photo.src}
            alt=""
            onClick={(event) => event.stopPropagation()}
          />
          {hasMany && (
            <button
              type="submit"
              className={`${styles.viewerNav} ${styles.next}`}
              aria-label="Следующее фото"
              onClick={(event) => event.stopPropagation()}
            >
              <NavChevron direction="right" />
            </button>
          )}
        </div>
        {hasMany && (
          <div
            className={styles.filmstrip}
            onClick={(event) => event.stopPropagation()}
          >
            {photos.map((item, itemIndex) => (
              <button
                key={`${item.src}-${itemIndex}`}
                ref={itemIndex === index ? activeThumbRef : undefined}
                type="button"
                className={itemIndex === index ? styles.active : undefined}
                aria-label={`Фото ${itemIndex + 1}`}
                aria-current={itemIndex === index ? 'true' : undefined}
                onClick={() => onIndex(itemIndex)}
              >
                <img src={item.src} alt="" />
              </button>
            ))}
          </div>
        )}
      </form>
    </div>,
    document.body,
  );
}

export default PhotoViewer;
