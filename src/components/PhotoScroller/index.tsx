import type { ReactNode } from 'react';
import { usePhotoScroller } from '../../hooks/usePhotoScroller';
import styles from './PhotoScroller.module.scss';

export type PhotoSlide = {
  id: string | number;
  url: string;
};

type PhotoScrollerState = {
  index: number;
  scrollTo: (index: number) => void;
};

type PhotoScrollerProps = {
  photos: PhotoSlide[];
  className?: string;
  emptyLabel?: string;
  onActivate?: (index: number) => void;
  children?: (state: PhotoScrollerState) => ReactNode;
};

function PhotoScroller({
  photos,
  className,
  emptyLabel = 'Нет фото',
  onActivate,
  children,
}: PhotoScrollerProps) {
  const {
    index,
    scrollerRef,
    scrollTo,
    onScroll,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    shouldActivate,
  } = usePhotoScroller(photos.length);

  return (
    <div
      className={`${styles.frame} ${className ?? ''}`}
      onClick={(event) => {
        if (shouldActivate(event)) {
          onActivate?.(index);
        }
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {photos.length > 0 ? (
        <div ref={scrollerRef} className={styles.scroller} onScroll={onScroll}>
          {photos.map((photo) => (
            <div key={photo.id} className={styles.slide}>
              <img src={photo.url} alt="" />
            </div>
          ))}
        </div>
      ) : (
        <span className={styles.placeholder}>{emptyLabel}</span>
      )}
      {children?.({ index, scrollTo })}
    </div>
  );
}

export default PhotoScroller;
