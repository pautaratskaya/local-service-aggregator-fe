import { useRef, useState, type MouseEvent, type PointerEvent } from 'react';

type Drag = {
  pointerId: number;
  x: number;
  left: number;
};

export function usePhotoScroller(count: number) {
  const [index, setIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const suppressClickRef = useRef(false);

  function scrollTo(next: number) {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    scroller.scrollTo({
      left: next * scroller.clientWidth,
      behavior: 'smooth',
    });
  }

  function onScroll() {
    const scroller = scrollerRef.current;
    if (!scroller || scroller.clientWidth === 0) {
      return;
    }

    const next = Math.round(scroller.scrollLeft / scroller.clientWidth);
    setIndex((current) => (current === next ? current : next));
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType !== 'mouse' ||
      count < 2 ||
      (event.target as HTMLElement).closest('button')
    ) {
      return;
    }

    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      left: scroller.scrollLeft,
    };
    scroller.style.scrollSnapType = 'none';
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const scroller = scrollerRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !scroller) {
      return;
    }

    const delta = event.clientX - drag.x;
    if (Math.abs(delta) > 4) {
      suppressClickRef.current = true;
    }
    scroller.scrollLeft = drag.left - delta;
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const scroller = scrollerRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !scroller) {
      return;
    }

    dragRef.current = null;
    scroller.style.scrollSnapType = '';
    const next = Math.round(scroller.scrollLeft / scroller.clientWidth);
    scroller.scrollTo({
      left: next * scroller.clientWidth,
      behavior: 'smooth',
    });
  }

  function shouldActivate(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest('button')) {
      return false;
    }
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return false;
    }
    return true;
  }

  return {
    index,
    scrollerRef,
    scrollTo,
    onScroll,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    shouldActivate,
  };
}
