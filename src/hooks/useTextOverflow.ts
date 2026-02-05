import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

/**
 * Hook to detect if text content is overflowing and requires a tooltip
 * @param ref - Reference to the element containing the text
 * @param text - Text content to monitor
 * @returns boolean indicating if tooltip should be shown
 */
export function useTextOverflow(
  ref: RefObject<HTMLElement | null>,
  text: string | undefined
): boolean {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const checkOverflow = () => {
      const isOverflowing = element.scrollWidth > element.clientWidth;
      setShowTooltip(isOverflowing);
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [text, ref]);

  return showTooltip;
}
