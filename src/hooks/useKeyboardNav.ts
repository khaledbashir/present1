'use client';

import { useEffect, useCallback } from 'react';

interface UseKeyboardNavOptions {
  onNext: () => void;
  onPrev: () => void;
  onPresenter?: () => void;
  enabled?: boolean;
}

export function useKeyboardNav({ onNext, onPrev, onPresenter, enabled = true }: UseKeyboardNavOptions) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        onNext();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        onPrev();
        break;
      case 'Home':
        e.preventDefault();
        break;
      case 'p':
      case 'P':
        if (onPresenter && !e.ctrlKey && !e.metaKey) {
          onPresenter();
        }
        break;
    }
  }, [enabled, onNext, onPrev, onPresenter]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
