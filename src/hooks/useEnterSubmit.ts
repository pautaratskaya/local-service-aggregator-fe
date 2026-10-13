import { useEffect } from 'react';

/**
 * Hook that calls a callback function when Enter key is pressed
 * @param callback - Function to call on Enter press (should be memoized with useCallback)
 */
function useEnterSubmit(callback: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.repeat || e.isComposing) {
        return;
      }

      // A focused button or link already runs its own click on Enter.
      if (e.target instanceof Element && e.target.closest('button, a')) {
        return;
      }

      callback();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callback]);
}

export default useEnterSubmit;
