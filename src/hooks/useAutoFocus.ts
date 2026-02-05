import { useEffect, type RefObject } from 'react';
import { isElementVisible } from '../helpers';

/**
 * Autofocus an input without scrolling if it's already visible
 */
export function useAutoFocus<T extends HTMLElement>(
  ref: RefObject<T | null>,
  shouldFocus: boolean = true
) {
  useEffect(() => {
    if (shouldFocus && ref.current) {
      const element = ref.current;
      const preventScroll = isElementVisible(element);
      element.focus({ preventScroll });
    }
  }, [shouldFocus, ref]);
}

/**
 * Handler for preventing scroll on pointer down if element is visible
 */
export function preventScrollOnFocus(e: React.PointerEvent<HTMLElement>) {
  const element = e.currentTarget;
  if (isElementVisible(element)) {
    e.preventDefault();
    element.focus({ preventScroll: true });
  }
}
