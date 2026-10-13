import { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDialogLock } from '../../hooks/useDialogLock';
import { usePhotoScroller } from '../../hooks/usePhotoScroller';
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
  const placedRef = useRef(false);
  const photo = photos[index];
  const hasMany = photos.length > 1;
  const {
    scrollerRef,
    scrollTo,
    onScroll,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  } = usePhotoScroller(photos.length, index);

  useDialogLock();

  const showNext = () => {
    onIndex(index === photos.length - 1 ? 0 : index + 1);
  };

  const showPrev = () => {
    onIndex(index === 0 ? photos.length - 1 : index - 1);
  };

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || scroller.clientWidth === 0) {
      return;
    }

    const left = index * scroller.clientWidth;
    if (Math.abs(scroller.scrollLeft - left) < 1) {
      placedRef.current = true;
      return;
    }

    if (!placedRef.current) {
      scroller.scrollLeft = left;
      placedRef.current = true;
      return;
    }

    scrollTo(index);
  }, [index, scrollTo, scrollerRef]);

  const onTrackScrollEnd = () => {
    const scroller = scrollerRef.current;
    if (!scroller || scroller.clientWidth === 0) {
      return;
    }

    const next = Math.round(scroller.scrollLeft / scroller.clientWidth);
    if (next !== index) {
      onIndex(next);
    }
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
      <div
        className={styles.viewerBody}
        role="dialog"
        aria-modal="true"
        aria-label="Просмотр фотографий"
      >
        <div
          className={styles.viewerBar}
          onClick={(event) => event.stopPropagation()}
        >
          <span>
            {index + 1} / {photos.length}
          </span>
          <button
            type="button"
            className={styles.viewerClose}
            aria-label="Закрыть"
            onClick={onClose}
          >
            <CrossIcon />
          </button>
        </div>
        <div
          className={styles.viewerStage}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClick={(event) => event.stopPropagation()}
        >
          <div
            ref={scrollerRef}
            className={styles.viewerTrack}
            onScroll={onScroll}
            onScrollEnd={onTrackScrollEnd}
          >
            {photos.map((item, itemIndex) => (
              <div key={`${item.src}-${itemIndex}`} className={styles.slide}>
                <img src={item.src} alt="" />
              </div>
            ))}
          </div>
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
          {hasMany && (
            <button
              type="button"
              className={`${styles.viewerNav} ${styles.next}`}
              aria-label="Следующее фото"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
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
      </div>
    </div>,
    document.body,
  );
}

export default PhotoViewer;
