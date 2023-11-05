import { useCallback, useEffect } from 'react';

type UseShortcutsProps = (fn: (e: KeyboardEvent) => void) => void;

export const useShortcuts: UseShortcutsProps = (fn) => {
  const handleShortcutOpen = useCallback(fn, [fn]);
  useEffect(() => {
    window.addEventListener('keydown', handleShortcutOpen);
    return () => {
      window.removeEventListener('keydown', handleShortcutOpen);
    };
  }, [handleShortcutOpen]);
};
