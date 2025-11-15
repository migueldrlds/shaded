'use client';

import { slideInOut } from 'lib/view-transitions';
import { useTransitionRouter } from 'next-view-transitions';
import { useState } from 'react';

/**
 * Hook personalizado para manejar navegación con view transitions
 * @param delay - Delay opcional antes de navegar (útil si el carrito está abierto)
 */
export function useViewTransition(delay: number = 0) {
  const router = useTransitionRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  const navigateTo = (path: string, customDelay?: number) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const finalDelay = customDelay !== undefined ? customDelay : delay;

    if (finalDelay > 0) {
      setTimeout(() => {
        router.push(path, {
          onTransitionReady: slideInOut,
        });
        setTimeout(() => setIsAnimating(false), 1500);
      }, finalDelay);
    } else {
      router.push(path, {
        onTransitionReady: slideInOut,
      });
      setTimeout(() => setIsAnimating(false), 1500);
    }
  };

  return { navigateTo, isAnimating };
}

