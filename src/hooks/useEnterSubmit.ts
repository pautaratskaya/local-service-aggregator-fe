import { useEffect } from 'react';

/**
 * Hook that calls a callback function when Enter key is pressed
 * @param callback - Function to call on Enter press (should be memoized with useCallback)
 */
function useEnterSubmit(callback: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callback]);
}

export default useEnterSubmit;
